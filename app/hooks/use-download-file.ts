import { useState, useEffect } from "react";
import { getS3DownloadUrl } from "@/lib/s3/action";
import { toast } from "sonner";

interface UseDownloadFileOptions {
  enabled?: boolean;
}

export function useDownloadFile(key: string, options?: UseDownloadFileOptions) {
  const { enabled = true } = options || {};
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isMounted = true;

    const fetchUrl = async () => {
      setIsLoading(true);

      try {
        const downloadUrl = await getS3DownloadUrl(key);

        if (!downloadUrl) {
          throw new Error("Failed to fetch download URL");
        }

        if (isMounted) {
          setUrl(downloadUrl);
        }
      } catch (err) {
        if (isMounted) {
          toast.error("Error occurred while fetching the URL");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUrl();

    return () => {
      isMounted = false;
    };
  }, [key, enabled]);

  return { url, isLoading };
}
