"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand, Trash2, Download } from "lucide-react"; // Assuming you're using lucide-react for icons
import { Button } from "@/components/ui/button";
import { deleteFileFromDB, deleteFileFromS3 } from "@/lib/s3/action";
import { toast } from "sonner";
import { Spinner, Deleting } from "../helpers/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

interface FileItemProps {
  fileKey: string;
}

export function FileItem({ fileKey }: FileItemProps) {
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    setIsDeleting(true);
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
      setIsDeleting(false); // Only reset isDeleting if there's an error
    }
  };

  return (
    <div className="relative aspect-video overflow-hidden rounded-md bg-gray-200 border-gray-300 border group">
      {isDeleting ? (
        <Deleting />
      ) : (
        <>
          {!isFileLoaded && <Spinner />}
          <Image
            src={`/api/files/${encodeURIComponent(fileKey)}`}
            alt={`File ${fileKey}`}
            sizes="(min-width: 640px) 640px, 100vw"
            className={`object-cover transition-opacity duration-300 ${isFileLoaded ? "opacity-100" : "opacity-0"} group-hover:blur-[1px]`}
            fill
            loading="lazy"
            onLoad={() => setIsFileLoaded(true)}
          />
          <Button
            onClick={onDelete}
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
          <Button
            onClick={onDelete}
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
          <Button 
            asChild
            variant="outline"
            size="icon"
            className="absolute bottom-2 right-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Link href={`/api/files/${encodeURIComponent(fileKey)}`} target="_blank" download={fileKey}>
              <Download className="w-4 h-4 text-green-500" />
            </Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 left-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Expand className="w-4 h-4 text-blue-500" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] h-[90vh]">
              <Image
                src={`/api/files/${encodeURIComponent(fileKey)}`}
                alt={`File ${fileKey}`}
                fill
                className="object-contain p-8"
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
