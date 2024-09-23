"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react"; // Assuming you're using lucide-react for icons
import { Button } from "@/components/ui/button";
import { deleteFileFromDB, deleteFileFromS3 } from "@/lib/s3/action";
import { toast } from "sonner";
interface FileItemProps {
  url: string;
  fileKey: string;
}

export function FileItem({ fileKey }: FileItemProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const onDelete = async () => {
    try {
      const messageS3 = await deleteFileFromS3(fileKey);
      const messageDB = await deleteFileFromDB(fileKey);

      if (!messageS3?.success) {
        throw new Error("Failed to delete file from S3");
      }

      if (!messageDB?.success) {
        throw new Error("Failed to delete file from DB");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`${error.message}`);
      } else {
        toast.error("Failed to delete file due to unknown error");
      }
    }
  };

  return (
    <div className="relative aspect-video overflow-hidden rounded-md bg-gray-200 group">
      {!isImageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
        </div>
      )}
      <Image
        src={`/api/files/${encodeURIComponent(fileKey)}`}
        alt={`File ${fileKey}`}
        sizes="(min-width: 640px) 640px, 100vw"
        className={`object-cover transition-opacity duration-300 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
        fill
        loading="lazy"
        onLoad={() => setIsImageLoaded(true)}
      />
      <Button
        onClick={onDelete}
        variant="outline"
        size="icon"
        className="absolute top-2 right-2 p-1 bg-white rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <Trash2 className="w-5 h-5 text-red-500" />
      </Button>
    </div>
  );
}
