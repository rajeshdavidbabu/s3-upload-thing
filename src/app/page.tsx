"use client"

import { ImageKeyStoreProvider } from "@/components/image-key-store-provider"
import { Shell } from "@/components/shell"

import { BasicUploaderDemo } from "./_components/basic-uploader-demo"

export default function IndexPage() {
  return (
    <ImageKeyStoreProvider>
      <BasicUploaderDemo />
    </ImageKeyStoreProvider>
  )
}
