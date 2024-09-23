import { UploadImage } from "@/components/uploader/upload-image";
import { FileGallery } from "@/components/uploader/file-gallery";

export default function Dashboard() {
  return (
    <div className="grid grid-rows-[auto,1fr] gap-4 h-full">
      <div className="flex justify-end">
        <UploadImage />
      </div>
      <div className="overflow-hidden mb-4">
        <FileGallery />
      </div>
    </div>
  );
}
