"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand, Trash2, Download, FileIcon, File } from "lucide-react"; // Assuming you're using lucide-react for icons
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
import { formatBytes } from "@/lib/utils";
interface FileItemProps {
  fileKey: string;
  fileName: string;
  contentType: string;
  size: number;
}

export function FileItem({ fileKey, fileName, contentType, size }: FileItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isImage = contentType.startsWith("image/");

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
          {isImage ? (
            <ImagePreview fileKey={fileKey} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <FileIcon className="w-10 h-10" />
              </div>
            </div>
          )}
          <div className="absolute bottom-3 left-2 w-full">
            <PillTooltip name={fileName} contentType={contentType} size={size} />
          </div>
          <OverlayButtons
            fileKey={fileKey}
            onDelete={onDelete}
            contentType={contentType}
          />
        </>
      )}
    </div>
  );
}

function ImagePreview({ fileKey }: { fileKey: string }) {
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [isThumbnailError, setIsThumbnailError] = useState(false);

  return (
    <>
      {!isFileLoaded && <Spinner />}
      {isThumbnailError ? (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <p className="text-white text-lg">Preview not available</p>
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
    </>
  );
}

function PillTooltip({ name, contentType, size }: { name: string, contentType: string, size: number }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full w-[60%] hover:cursor-pointer">
            <span className="block truncate">{name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px]">
          <ul className="text-sm space-y-1">
            <li>
              <strong>Name:</strong> {name}
            </li>
            <li>
              <strong>Type:</strong> {contentType}
            </li>
            <li>
              <strong>Size:</strong> {formatBytes(size)}
            </li>
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function OverlayButtons({
  fileKey,
  contentType,
  onDelete,
}: {
  fileKey: string;
  contentType: string;
  onDelete: () => void;
}) {
  const isImage = contentType.startsWith("image/");

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
          href={`/api/files/${encodeURIComponent(fileKey)}?contentType=${encodeURIComponent(contentType)}`}
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
