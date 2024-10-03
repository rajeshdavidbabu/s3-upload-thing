"use client";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import AwsS3 from "@uppy/aws-s3";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import { useState, useRef } from "react";
import { getS3UploadParams } from "@/lib/s3/action";
import { uploadFilesToDB } from "@/lib/db/action";
import { toast } from "sonner";
import { formatBytes } from "@/lib/utils";

// Current max 50 files, 1000 MB
function createUppy() {
  const uppy = new Uppy({
    restrictions: {
      maxNumberOfFiles: 50,
      maxTotalFileSize: 1000 * 1024 * 1024,
    },
  });

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
  const toastIdRef = useRef<string | number | null>(null);

  uppy.on("complete", async (result) => {
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

    // Dismiss the toast if it exists
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }

    toast.success(`${validUploads.length} files uploaded successfully!`);
  });

  uppy.on("progress", (progress) => {
    const progressMessage = `Uploading files... progress: ${progress}/100%`;

    if (!toastIdRef.current) {
      toastIdRef.current = toast.loading(progressMessage);
    } else {
      toast.loading(progressMessage, { 
        id: toastIdRef.current,
      });
    }
  });

  return <Dashboard uppy={uppy} />;
}
