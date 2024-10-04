import { UploadImage } from "@/components/uploader/upload-image";
import { FileGallery } from "@/components/uploader/file-gallery";
import { redirect } from "next/navigation";
import FileTypeFilterDropdown from "@/components/uploader/file-type-filter";
import SearchByFileName from "@/components/uploader/search-by-file-name";
import UsageTracker from "@/components/uploader/usage-tracker";

interface DashboardPageProps {
  searchParams: {
    page?: string;
    selectedFileTypes?: string;
    fileName?: string;
  };
}

export default function Dashboard({ searchParams }: DashboardPageProps) {
  let page = 1;
  let selectedFileTypes: string[] = [];
  let fileName: string = '';

  // Handle page parameter
  if (searchParams.page) {
    const parsedPage = parseInt(searchParams.page);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      page = parsedPage;
    } else {
      // Redirect to page 1 if an invalid page number is provided
      redirect('/dashboard?page=1');
    }
  }

  // Handle selectedFileTypes parameter
  if (searchParams.selectedFileTypes) {
    selectedFileTypes = searchParams.selectedFileTypes.split(',');
  }

  if (searchParams.fileName) {
    fileName = searchParams.fileName;
  }

  return (
    <div className="grid grid-rows-[auto,1fr] gap-4 h-full">
      <div className="flex justify-between pt-1">
        <div className="flex items-center gap-2">
          <SearchByFileName />
          <FileTypeFilterDropdown />
        </div>
        <div className="flex items-center gap-4">
          <UsageTracker />
          <UploadImage />
        </div>
      </div>
      <div className="overflow-hidden">
        <FileGallery page={page} selectedFileTypes={selectedFileTypes} fileName={fileName} />
      </div>
    </div>
  );
}
