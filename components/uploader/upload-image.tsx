"use client";

import { useSession } from "next-auth/react";
import { useUploadFile } from "@/app/hooks/use-upload-file";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { UppyUploader } from "./uppy-uploader";

export function UploadImage() {
  const { data: session } = useSession();
  const { onUpload, progresses, isUploading } = useUploadFile({
    userId: session?.user?.id,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload files</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80%]">
        <DialogHeader>
          <DialogTitle>Upload files</DialogTitle>
          <DialogDescription>
            Drag and drop your files here or click to browse.
          </DialogDescription>
        </DialogHeader>
        <UppyUploader />
      </DialogContent>
    </Dialog>
  );
}
