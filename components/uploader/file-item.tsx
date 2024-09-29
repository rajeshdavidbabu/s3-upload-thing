"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand, Trash2, Download } from "lucide-react"; // Assuming you're using lucide-react for icons
import { Button } from "@/components/ui/button";
import { deleteFileFromDB, deleteFileFromS3 } from "@/lib/s3/action";
import { toast } from "sonner";
import { Spinner, Deleting } from "../helpers/spinner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface FileItemProps {
  fileKey: string;
  fileName: string;
  contentType: string;
}

export function FileItem({ fileKey, fileName, contentType }: FileItemProps) {
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [isThumbnailError, setIsThumbnailError] = useState(false);
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
          {isThumbnailError ? (
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
              <p className="text-white text-lg">Preview not available</p>
              <p className="text-white text-lg">Use <Download className="w-4 h-4 text-green-500" /> or <Expand className="w-4 h-4 text-blue-500" /> to view the file</p>
            </div>
          ) : (
            <Image
              src={`/api/thumbnails/${encodeURIComponent(fileKey)}`}
              alt={`File ${fileKey}`}
              sizes="(min-width: 640px) 640px, 100vw"
              className={`object-cover transition-opacity duration-300 ${isFileLoaded ? "opacity-100" : "opacity-0"} group-hover:blur-[1px]`}
              fill
              loading="lazy"
              onLoad={() => setIsFileLoaded(true)}
              onError={() => {
                setIsThumbnailError(true);
                setIsFileLoaded(true);
              }}
            />
          )}
          <div className="absolute bottom-3 left-2 w-full">
            <PillTooltip name={fileName} />
          </div>
          <OverlayButtons fileKey={fileKey} onDelete={onDelete} contentType={contentType} />
        </>
      )}
    </div>
  );
}

function PillTooltip({ name }: { name: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full w-[60%]">
            <span className="block truncate">{name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-sm">{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function OverlayButtons({fileKey, contentType, onDelete}: {fileKey: string, contentType: string, onDelete: () => void}) {
  const isImage = contentType.startsWith('image/');

  return (
    <>
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
        <Link
          href={`/api/files/${encodeURIComponent(fileKey)}`}
          target="_blank"
          download={fileKey}
        >
          <Download className="w-4 h-4 text-green-500" />
        </Link>
      </Button>
      {isImage && (
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
      )}
    </>
  );
}
