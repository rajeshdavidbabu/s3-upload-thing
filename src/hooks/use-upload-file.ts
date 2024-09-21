import * as React from "react"
import { toast } from "sonner"
import { getS3UploadParams } from "@/app/api/s3/action"
import { UploadedFile } from "@/types"
import { useImageKeyStorage } from './use-image-key-storage';

interface UseUploadFileProps {
  defaultUploadedFiles?: UploadedFile[]
}

export function useUploadFile(
  { defaultUploadedFiles = [] }: UseUploadFileProps = {}
) {
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>(defaultUploadedFiles)
  const [progresses, setProgresses] = React.useState<Record<string, number>>({})
  const [isUploading, setIsUploading] = React.useState(false)

  const { addImageKeys } = useImageKeyStorage();

  async function uploadFileWithProgress(file: File, url: string, fields: Record<string, string>): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setProgresses(prev => ({ ...prev, [file.name]: progress }));
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

      xhr.onerror = () => reject(new Error('XHR error'));

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('file', file);

      xhr.send(formData);
    });
  }

  async function onUpload(files: File[]) {
    setIsUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        try {
          // Get presigned POST data from the server action
          const { url, fields } = await getS3UploadParams(file.name, file.type, file.size);

          console.log(url, fields);

          // Upload file and get the file URL
          const fileUrl = await uploadFileWithProgress(file, url, fields);

          return {
            name: file.name,
            size: file.size,
            key: fields.key,
            url: fileUrl,
          };
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("An unknown error occurred");
          }
          throw error; // Re-throw to prevent this file from being added to uploadedFiles
        }
      });

      const successfulUploads = await Promise.all(uploadPromises);
      setUploadedFiles(prev => [...prev, ...successfulUploads.map(file => ({
        ...file,
        key: file.key || file.name // Use file.name as fallback if key is undefined
      }))]);
      
      // Add the new keys to local storage
      addImageKeys(successfulUploads.map(file => file.key || file.name));

      toast.success("Files uploaded successfully!");
    } catch (err) {
      console.error(err);
      // General error message is already shown for individual file errors
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
  }
}
