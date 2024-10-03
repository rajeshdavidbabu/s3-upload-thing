import 'server-only';

import { db } from "@/db";
import { files } from "@/db/schema";
import { and, count, desc, eq, or, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Can be improved with subquery https://orm.drizzle.team/learn/guides/limit-offset-pagination
export async function getFileInfo(
  userId: string,
  page: number = 1,
  pageSize: number = 20,
  selectedFileTypes: string[],
  fileName?: string,
) {
  const offset = (page - 1) * pageSize;

  let whereClause = eq(files.userId, userId);

  console.log('incoming fileName ', fileName);

  if (selectedFileTypes.length > 0) {
    const typeConditions = selectedFileTypes.map(type => {
      switch (type) {
        case 'images':
          return sql`${files.mimeType} LIKE 'image/%'`;
        case 'videos':
          return sql`${files.mimeType} LIKE 'video/%'`;
        case 'pdf':
          return sql`${files.mimeType} = 'application/pdf'`;
        case 'other':
          return sql`${files.mimeType} NOT LIKE 'image/%' AND ${files.mimeType} NOT LIKE 'video/%' AND ${files.mimeType} != 'application/pdf'`;
        default:
          return sql`1=0`; // This condition will never be true, effectively filtering out this type
      }
    });

    const combinedwhereClause = and(whereClause, or(...typeConditions));

    if(combinedwhereClause) {
      whereClause = combinedwhereClause;
    }
  }

  // Add fileName filter
  if (fileName && fileName.trim() !== '') {
    console.log('fileName here ', fileName);
    const fileNameClause = and(
      whereClause,
      sql`LOWER(${files.filename}) LIKE ${`%${fileName.toLowerCase()}%`}`
    );

    if(fileNameClause) {
      whereClause = fileNameClause;
    }
  }

  const result = await db
    .select({
      s3Key: files.s3Key,
      filename: files.filename,
      contentType: files.mimeType,
      size: files.size,
    })
    .from(files)
    .where(whereClause)
    .orderBy(desc(files.createdAt))
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(files)
    .where(whereClause);

  const fileInfo = result.map((row) => ({
    s3Key: row.s3Key,
    filename: row.filename,
    contentType: row.contentType,
    size: row.size,
  }));
  const totalCount = totalCountResult[0]?.count ?? 0;

  return {
    fileInfo,
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
