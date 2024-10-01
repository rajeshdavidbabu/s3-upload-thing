"use client";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import AwsS3 from "@uppy/aws-s3";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import { useState } from "react";
import { getS3UploadParams, uploadFilesToDB } from "@/lib/s3/action";
import { toast } from "sonner";

function createUppy() {
  const uppy = new Uppy();

  // @ts-ignore
  return uppy.use(AwsS3, {
    async getUploadParameters(fileObject, options) {
      const file = fileObject.data as File;

      const { url, fields } = await getS3UploadParams(
        file.name,
        file.type,
        file.size
      );

      if (!url || !fields) {
        throw new Error("Upload URL is undefined");
      }

      uppy.setFileMeta(fileObject.id, { fileKey: fields.key });

      return {
        url,
        method: "POST",
        fields,
      };
    },
  });
}

export function UppyUploader() {
  const [uppy] = useState(createUppy());

  uppy.on("complete", async (result) => {
    console.log("complete", result);

    const { successful = [], failed } = result;

    const validUploads = successful.map((file) => {
      return {
        name: file.name as string,
        key: file.meta.fileKey as string,
        size: file.size as number,
        type: file.type as string,
      };
    });

    const messageDB = await uploadFilesToDB(validUploads);

    toast.success(`${validUploads.length} files uploaded successfully!`);
  });

  return <Dashboard uppy={uppy} />;
}
