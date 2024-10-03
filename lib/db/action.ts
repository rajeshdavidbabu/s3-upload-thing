'use server'

import { checkUserFileAccess, deleteFileRecord, getFileInfo, insertFileRecords } from "@/db/api/file";
import { verifySession } from "@/app/auth/utils";
import { revalidatePath } from "next/cache";
import { UploadedFile } from "@/types";
import { trackStorageChange } from "@/db/api/usage";


  
  export async function getFilesFromDB(
    page: number,
    pageSize: number,
    selectedFileTypes: string[],
    fileName?: string
  ) {
    const { userId } = await verifySession();
  
    return getFileInfo(userId, page, pageSize, selectedFileTypes, fileName);
  }
  
  export async function uploadFilesToDB(files: UploadedFile[]) {
    try {
      const { userId } = await verifySession();
      await insertFileRecords(userId, files);
  
      // Track storage increase
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      await trackStorageChange(userId, totalSize);
  
      // Wait for 2 seconds for thumbnails to be generated
      await new Promise((resolve) => setTimeout(resolve, 2000));
  
      // Revalidate the dashboard page after successful upload
      revalidatePath("/dashboard");
  
      return { success: true };
    } catch (error) {
      console.error("Error uploading files:", error);
      return { success: false };
    }
  }
  
  export async function deleteFileFromDB(fileKey: string, size: number) {
    const { userId } = await verifySession();
    const checkAccess = await checkUserFileAccess(userId, fileKey);
  
    if (!checkAccess) {
      throw new Error("Access denied");
    }
  
    try {
      // Delete the file record from the database
      await deleteFileRecord(userId, fileKey);
  
      if (size > 0) {
        // Track storage decrease
        await trackStorageChange(userId, -size);
      }
  
      // Revalidate the dashboard page after successful deletion
      revalidatePath("/dashboard");
  
      return { success: true, message: "File deleted successfully" };
    } catch (error) {
      console.error("Error deleting file:", error);
      return { success: false, message: "Failed to delete file" };
    }
  }
  
  export async function revalidateDashboard() {
    revalidatePath("/dashboard");
  
    return { success: true };
  }