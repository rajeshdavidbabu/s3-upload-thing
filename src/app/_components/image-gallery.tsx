"use client"

import { useState } from "react"
import Image from "next/image"

import { useDownloadFile } from "@/hooks/use-download-file"
import { useImageKeyStorage } from "@/hooks/use-image-key-storage"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EmptyCard } from "@/components/empty-card"
import { useInView } from 'react-intersection-observer';

export function ImageGallery() {
  const { imageKeys } = useImageKeyStorage()

  return (
    <Card className="grid h-full grid-rows-[auto,1fr]">
      <CardHeader>
        <CardTitle>Image Gallery</CardTitle>
        <CardDescription>View uploaded images</CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden">
        {imageKeys.length > 0 ? (
          <div className="h-full overflow-auto pr-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {imageKeys.map((key) => (
                <ImageItem key={key} imageKey={key} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyCard
            title="No images uploaded"
            description="Upload some images to see them here"
            className="h-full w-full"
          />
        )}
      </CardContent>
    </Card>
  )
}

function ImageItem({ imageKey }: { imageKey: string }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { url, isLoading, error } = useDownloadFile(imageKey, { enabled: inView })  
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  if (error) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-md bg-red-100 text-sm">
        Failed to load image
      </div>
    )
  }

  return (
    <div ref={ref} className="relative aspect-video overflow-hidden rounded-md bg-gray-200">
      {(isLoading || !isImageLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
        </div>
      )}
      {url && (
        <Image
          src={url}
          alt={`Image ${imageKey}`}
          fill
          sizes="(min-width: 640px) 640px, 100vw"
          className={`object-cover transition-opacity duration-300 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setIsImageLoaded(true)}
          loading="lazy"
        />
      )}
    </div>
  )
}
