import { getS3DownloadUrl } from "@/lib/s3/action";
import { verifySession } from "@/app/auth/utils";


export async function GET(
  request: Request,
  { params }: { params: { key: string } },
) {
  try {
    await verifySession();

    const { key } = params;
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType') || 'application/octet-stream';

    // Generate pre-signed URL
    const signedUrl = await getS3DownloadUrl(key);
    
    if (!signedUrl) {
      return new Response("Failed to generate download URL", { status: 500 });
    }
    // NOTE: You can directly return the signedUrl, but we are fetching the files
    // from S3 using the signed URL to avoid any unauthorized access to the files.
    const response = await fetch(signedUrl);

    // Stream the image back to the client
    const imageStream = response.body;

    // Create a new response with caching headers and redirect to the signed URL
    // max-age is based on getDownloadUrl expiresIn parameter
    return new Response(imageStream, {
      headers: {
        "Cache-Control": "public, max-age=3599",
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Error in file download API:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
