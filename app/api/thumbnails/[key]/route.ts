import { getS3ThumbnailDownloadUrl } from "@/lib/s3/action";
import { checkS3ObjectExists } from "@/lib/s3/core";
import { verifySession } from "@/app/auth/utils";

export async function GET(
  request: Request,
  { params }: { params: { key: string } },
) {
  await verifySession();

  const { key } = params;
  
  // Image generation is done on Lambda, and the thumbnail is uploaded to S3
  // by the Lambda function. Sometimes it takes a while for the thumbnail to
  // be uploaded to S3, so we retry a few times before giving up.
  // Ideally, we need to update a status in the database when the thumbnail
  // is generated and then fetch the thumbnail from the database.
  async function getThumbnailUrl(key: string, maxAttempts = 5) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      console.log(`Attempt ${attempt + 1} to get thumbnail for: ${key}`);
      
      const objectExists = await checkS3ObjectExists(key);
      if (objectExists) {
        const signedUrl = await getS3ThumbnailDownloadUrl(key);
        if (signedUrl) return signedUrl;
      }

      if (attempt < maxAttempts - 1) {
        console.log("Thumbnail not ready, waiting before retry...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`Failed to get thumbnail after ${maxAttempts} attempts`);
    return null;
  }

  const signedUrl = await getThumbnailUrl(key);

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
    },
  });
}
