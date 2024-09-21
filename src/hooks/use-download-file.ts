import { useState, useEffect } from 'react';
import { getS3DownloadUrl } from '@/app/api/s3/action';

interface UseDownloadFileOptions {
  enabled?: boolean;
}

export function useDownloadFile(key: string, options?: UseDownloadFileOptions) {
  const { enabled = true } = options || {};
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isMounted = true;

    const fetchUrl = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const downloadUrl = await getS3DownloadUrl(key);
        if (isMounted) {
          setUrl(downloadUrl);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'An error occurred while fetching the URL'
          );
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

  return { url, isLoading, error };
}
