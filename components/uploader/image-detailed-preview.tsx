import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FileIcon } from 'lucide-react'; // Assuming you're using lucide-react for icons
import { Spinner } from '../helpers/spinner';

export function ImageDetailedPreview({ fileKey }: { fileKey: string }) {
  const [imageError, setImageError] = useState(false);
  const [isFileLoaded, setIsFileLoaded] = useState(false);

  if (imageError) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100">
        <FileIcon className="w-16 h-16 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Image failed to load</p>
      </div>
    );
  }

  return (
    <>
      {!isFileLoaded && <Spinner />}
      <Image
        src={`/api/files/${encodeURIComponent(fileKey)}`}
        alt={`File ${fileKey}`}
        fill
        className={`object-contain p-8 transition-opacity duration-300 ${
          isFileLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onError={() => {
          setImageError(true);
          setIsFileLoaded(true);
        }}
        onLoad={() => setIsFileLoaded(true)}
      />
    </>
    
  );
}