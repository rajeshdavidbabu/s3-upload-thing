"use client"

import { useEffect, useState } from "react"
import { useUploadFile } from "@/hooks/use-upload-file"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileUploader } from "@/components/file-uploader"
import { ImageGallery } from "./image-gallery"

export function BasicUploaderDemo() {
  const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile({
    defaultUploadedFiles: [],
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="grid grid-rows-[auto,1fr] gap-4 h-full">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Upload files</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Upload files</DialogTitle>
              <DialogDescription>
                Drag and drop your files here or click to browse.
              </DialogDescription>
            </DialogHeader>
            <FileUploader
              maxFileCount={4}
              maxSize={4 * 1024 * 1024}
              progresses={progresses}
              onUpload={onUpload}
              disabled={isUploading}
              multiple={true}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-hidden mb-4">
        {isMounted && <ImageGallery />}
      </div>
    </div>
  )
}
