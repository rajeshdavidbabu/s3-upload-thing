import React, {
  createContext,
  useEffect,
  useState,
} from "react"

interface ImageKeyStoreContextProps {
  imageKeys: string[]
  addImageKeys: (newKeys: string[]) => void
}

export const ImageKeyStoreContext = createContext<ImageKeyStoreContextProps | undefined>(
  undefined
)

const STORAGE_KEY = "uploadedImageKeys"

export function ImageKeyStoreProvider({ children }: { children: React.ReactNode }) {
  // Load image keys from local storage
  // TODO: Move this to an actual database
  const [imageKeys, setImageKeys] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      console.log("Initial stored keys:", stored)
      if (stored) {
        try {
          return JSON.parse(stored) as string[]
        } catch (error) {
          console.error("Error parsing stored keys:", error)
          return []
        }
      }
    }
    return []
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Updating local storage with:", imageKeys)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(imageKeys))
    }
  }, [imageKeys])

  const addImageKeys =  (newKeys: string[]) => {
    setImageKeys((prev) => [...new Set([...newKeys, ...prev])])
  }

  return (
    <ImageKeyStoreContext.Provider value={{ imageKeys, addImageKeys }}>
      {children}
    </ImageKeyStoreContext.Provider>
  )
}
