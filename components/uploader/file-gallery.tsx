import { getFilesFromDB, getS3DownloadUrl } from "@/lib/s3/action";
import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyCard } from "@/components/uploader/empty-card";
import { FileItem } from "./file-item";
import { Suspense } from "react";
import { Spinner } from "../helpers/spinner";

export async function FileGallery() {
  const { fileKeys } = await getFilesFromDB();

  return (
    <Card className="grid h-full grid-rows-[auto,1fr]">
      <CardHeader>
        <CardTitle>File Gallery</CardTitle>
        <CardDescription>View uploaded files</CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden">
        {fileKeys.length > 0 ? (
          <div className="h-full overflow-auto pr-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {fileKeys.map((key) => (
                <Suspense
                  key={key}
                  fallback={<Spinner />}
                >
                  <FileItemWrapper key={key} fileKey={key} />
                </Suspense>
              ))}
            </div>
          </div>
        ) : (
          <EmptyCard
            title="No files uploaded"
            description="Upload some files to (Note: currently only images are supported)"
            className="h-full w-full"
          />
        )}
      </CardContent>
    </Card>
  );
}

async function FileItemWrapper({ fileKey }: { fileKey: string }) {
  const url = await getS3DownloadUrl(fileKey);

  return <FileItem fileKey={fileKey} />;
}
