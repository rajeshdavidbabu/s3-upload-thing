import * as React from "react";
import { toast } from "sonner";
import { getS3UploadParams, uploadFilesToDB } from "@/lib/s3/action";

interface UseUploadFileProps {
  userId?: string;
}

export function useUploadFile({ userId }: UseUploadFileProps = {}) {
  const [progresses, setProgresses] = React.useState<Record<string, number>>(
    {},
  );
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadFileWithProgress(
    file: File,
    url: string,
    fields: Record<string, string>,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setProgresses((prev) => ({ ...prev, [file.name]: progress }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 204) {
          const fileUrl = `${url}/${fields.key}`;
          resolve(fileUrl);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("XHR error"));

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", file);

      xhr.send(formData);
    });
  }

  async function onUpload(files: File[]) {
    if (!userId) {
      toast.error("User ID is required for upload");
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        try {
          const { url, fields } = await getS3UploadParams(
            file.name,
            file.type,
            file.size,
          );

          if (url && fields) {
            await uploadFileWithProgress(file, url, fields);
            return {
              name: file.name,
              size: file.size,
              key: fields.key,
              type: file.type,
            };
          } else {
            toast.error(`Failed to get upload params for ${file.name}`);
            return null;
          }
        } catch (error) {
          console.error(error);
          toast.error(`Failed to upload ${file.name}`);
          return null;
        }
      });

      const successfulUploads = await Promise.all(uploadPromises);
      const validUploads = successfulUploads.filter(
        (upload) => upload !== null,
      );

      console.log(
        "validUploads ",
        validUploads.map((upload) => upload?.name),
      );

      const messageDB = await uploadFilesToDB(validUploads);

      if (!messageDB.success) {
        throw new Error("Failed to upload files to DB");
      }

      toast.success("Files uploaded successfully!");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An error occurred during upload");
      }
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    onUpload,
    progresses,
    isUploading,
  };
}
