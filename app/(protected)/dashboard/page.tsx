import { UploadImage } from "@/components/uploader/upload-image";
import { FileGallery } from "@/components/uploader/file-gallery";
import { redirect } from "next/navigation";

interface DashboardPageProps {
  searchParams: { page?: string };
}

export default function Dashboard({ searchParams }: DashboardPageProps) {
  let page = 1;

  if (searchParams.page) {
    const parsedPage = parseInt(searchParams.page);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      page = parsedPage;
    } else {
      // Redirect to page 1 if an invalid page number is provided
      redirect('/dashboard?page=1');
    }
  } else {
    // Redirect to page 1 if no page is specified
    redirect('/dashboard?page=1');
  }

  return (
    <div className="grid grid-rows-[auto,1fr] gap-4 h-full">
      <div className="flex justify-end">
        <UploadImage />
      </div>
      <div className="overflow-hidden mb-4">
        <FileGallery page={page} />
      </div>
    </div>
  );
}
