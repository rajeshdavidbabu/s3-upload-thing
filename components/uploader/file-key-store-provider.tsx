import React, { createContext, useEffect, useState } from "react";

interface FileKeyStoreContextProps {
  fileKeys: string[];
  addFileKeys: (newKeys: string[]) => void;
}

export const FileKeyStoreContext = createContext<
  FileKeyStoreContextProps | undefined
>(undefined);

const STORAGE_KEY = "uploadedImageKeys";

export function FileKeyStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load image keys from local storage
  // TODO: Move this to an actual database
  const [fileKeys, setFileKeys] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log("Initial stored keys:", stored);
      if (stored) {
        try {
          return JSON.parse(stored) as string[];
        } catch (error) {
          console.error("Error parsing stored keys:", error);
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Updating local storage with:", fileKeys);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fileKeys));
    }
  }, [fileKeys]);

  const addFileKeys = (newKeys: string[]) => {
    setFileKeys((prev) => [...new Set([...prev, ...newKeys])]);
  };

  return (
    <FileKeyStoreContext.Provider value={{ fileKeys, addFileKeys }}>
      {children}
    </FileKeyStoreContext.Provider>
  );
}
