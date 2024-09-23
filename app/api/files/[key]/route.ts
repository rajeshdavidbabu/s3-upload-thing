import { NextRequest, NextResponse } from "next/server";
import { getS3DownloadUrl } from "@/lib/s3/action";
import { verifySession } from "@/app/auth/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } },
) {
  await verifySession();

  const { key } = params;

  // Generate pre-signed URL
  const signedUrl = await getS3DownloadUrl(key);

  if (!signedUrl) {
    return new NextResponse("Failed to generate download URL", { status: 500 });
  }

  // Create a new response with caching headers and redirect to the signed URL
  // max-age is based on getDownloadUrl expiresIn parameter
  return NextResponse.redirect(signedUrl, {
    headers: {
      "Cache-Control": "public, max-age=3599",
    },
  });
}
