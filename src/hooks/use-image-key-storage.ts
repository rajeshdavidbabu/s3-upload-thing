import { useContext } from "react";
import { ImageKeyStoreContext } from "@/components/image-key-store-provider";

export function useImageKeyStorage() {
    const context = useContext(ImageKeyStoreContext);
    if (!context) {
      throw new Error('useImageKeyStorage must be used within an ImageKeyStoreProvider');
    }
    return context;
  }