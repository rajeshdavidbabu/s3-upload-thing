"use client";

import { useSession } from "next-auth/react";
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload files</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80%]">
        <DialogHeader>
          <DialogTitle>Upload files</DialogTitle>
          <DialogDescription>
            Drag and drop your files here or click to browse. Maximum file size
            is 500 MB specified inside s3/action.ts.
          </DialogDescription>
        </DialogHeader>
        <UppyUploader />
      </DialogContent>
    </Dialog>
  );
}
