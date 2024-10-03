import { Download } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { revalidateDashboard } from "@/lib/db/action";
import { toast } from "sonner";
import { useCallback, useRef } from "react";

export function DownloadFile({
  fileKey,
  contentType,
}: {
  fileKey: string;
  contentType: string;
}) {
  const handleDownload = async () => {
    // Update the bandwidth usage after the download is started
    setTimeout(async () => {
      await revalidateDashboard();
    }, 3000);
  };

  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className="absolute bottom-2 right-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      onClick={handleDownload}
    >
      <Link
        href={`/api/files/${encodeURIComponent(fileKey)}?contentType=${encodeURIComponent(contentType)}`}
        target="_blank"
        download={fileKey}
      >
        <Download className={`w-4 h-4 text-green-500`} />
      </Link>
    </Button>
  );
}
