"use server";

import { db } from "@/db";
import { files } from "@/db/schema";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Can be improved with subquery https://orm.drizzle.team/learn/guides/limit-offset-pagination
export async function getFileKeys(
  userId: string,
  page: number = 1,
  pageSize: number = 20,
) {
  const offset = (page - 1) * pageSize;

  const result = await db
    .select({
      s3Key: files.s3Key,
    })
    .from(files)
    .where(eq(files.userId, userId))
    .orderBy(desc(files.createdAt))
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(files)
    .where(eq(files.userId, userId));

  const fileKeys = result.map((row) => row.s3Key);
  const totalCount = totalCountResult[0]?.count ?? 0;

  console.log(fileKeys);

  return {
    fileKeys,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
  };
}

export async function insertFileRecords(
  userId: string,
  filesData: Array<{
    name: string;
    size: number;
    key: string;
    type: string;
  }>,
) {
  const now = new Date();
  const newFiles = await db
    .insert(files)
    .values(
      filesData.map((fileData, index) => ({
        userId,
        filename: fileData.name,
        mimeType: fileData.type,
        size: fileData.size,
        s3Key: fileData.key,
        createdAt: new Date(now.getTime() + index), // Add index to ensure unique timestamps
      })),
    )
    .returning();

  return newFiles;
}

export async function deleteFileRecord(userId: string, s3Key: string) {
  try {
    const result = await db
      .delete(files)
      .where(and(eq(files.userId, userId), eq(files.s3Key, s3Key)))
      .returning({ deletedS3Key: files.s3Key });

    if (result.length === 0) {
      throw new Error(
        "File not found or user not authorized to delete this file",
      );
    }

    return result[0].deletedS3Key;
  } catch (error) {
    console.error("Error deleting file record:", error);
    throw error;
  }
}
