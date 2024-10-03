import { getFilesFromDB } from "@/lib/s3/action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { EmptyCard } from "@/components/uploader/empty-card";
import { FileItem } from "./file-item";
import { Suspense } from "react";
import { Spinner } from "../helpers/spinner";
import { PaginationBar } from "@/components/general/pagination-bar";
interface FileGalleryProps {
  page: number;
  selectedFileTypes: string[];
  fileName?: string;
}

export async function FileGallery({
  page,
  selectedFileTypes,
  fileName,
}: FileGalleryProps) {
  const pageSize = 12;
  const { fileInfo, totalPages } = await getFilesFromDB(
    page,
    pageSize,
    selectedFileTypes,
    fileName
  );

  return (
    <Card className="grid h-full grid-rows-[auto,1fr,auto]">
      <CardHeader>
        <CardTitle>File Gallery</CardTitle>
        <CardDescription>View uploaded files</CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden">
        {fileInfo.length > 0 ? (
          <div className="h-full overflow-auto pr-4 scroll-smooth">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {fileInfo.map(({ s3Key, filename, contentType, size }) => (
                <Suspense key={s3Key} fallback={<Spinner />}>
                  <FileItemWrapper
                    key={s3Key}
                    fileKey={s3Key}
                    fileName={filename}
                    contentType={contentType}
                    size={size}
                  />
                </Suspense>
              ))}
            </div>
          </div>
        ) : (
          <EmptyCard page={page} totalPages={totalPages} />
        )}
      </CardContent>
      <CardFooter>
        <PaginationBar
          currentPage={page}
          totalPages={totalPages}
          basePath="/dashboard"
        />
      </CardFooter>
    </Card>
  );
}

async function FileItemWrapper({
  fileKey,
  fileName,
  contentType,
  size,
}: {
  fileKey: string;
  fileName: string;
  contentType: string;
  size: number;
}) {
  return (
    <FileItem
      fileKey={fileKey}
      fileName={fileName}
      contentType={contentType}
      size={size}
    />
  );
}
