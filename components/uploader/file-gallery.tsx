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
}

export async function FileGallery({ page }: FileGalleryProps) {
  const { fileKeys, totalPages } = await getFilesFromDB(page);

  return (
    <Card className="grid h-full grid-rows-[auto,1fr,auto]">
      <CardHeader>
        <CardTitle>File Gallery</CardTitle>
        <CardDescription>View uploaded files</CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden">
        {fileKeys.length > 0 ? (
          <div className="h-full overflow-auto pr-4 scroll-smooth">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {fileKeys.map((key) => (
                <Suspense key={key} fallback={<Spinner />}>
                  <FileItemWrapper key={key} fileKey={key} />
                </Suspense>
              ))}
            </div>
          </div>
        ) : (
          <EmptyCard
            title={`${page > totalPages ? "No more files to show" : "No files uploaded"}`}
            description="Upload some files to (Note: currently only images are supported)"
            className="h-full w-full"
          />
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

async function FileItemWrapper({ fileKey }: { fileKey: string }) {
  return <FileItem fileKey={fileKey} />;
}
