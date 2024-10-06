import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const S3 = new S3Client();
const DEST_BUCKET = process.env.DEST_BUCKET;
const THUMBNAIL_WIDTH = 300; // px
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const SUPPORTED_CONTENT_TYPES = {
  'image/jpeg': true,
  'image/png': true,
  'image/webp': true,
  'image/avif': true,
  'image/gif': true,
  'image/tiff': true,
};

export const handler = async (event, context) => {
  const { eventTime, eventName, s3 } = event.Records[0];
  const srcBucket = s3.bucket.name;
  const srcKey = decodeURIComponent(s3.object.key.replace(/\+/g, " "));

  console.log(`Inside lambda: ${eventTime} - ${eventName} - ${srcBucket}/${srcKey}`);

  // Handle delete events
  if (eventName.startsWith('ObjectRemoved:')) {
    try {
      await S3.send(
        new DeleteObjectCommand({
          Bucket: DEST_BUCKET,
          Key: srcKey,
        })
      );
      console.log(`Successfully deleted ${srcKey} from ${DEST_BUCKET}`);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Successfully deleted ${srcKey} from ${DEST_BUCKET}`,
        }),
      };
    } catch (error) {
      console.error("Error deleting object:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error deleting image", error: error.message }),
      };
    }
  }

  // Handle create/update events
  try {
    // Get the object's metadata
    const headResult = await S3.send(
      new HeadObjectCommand({
        Bucket: srcBucket,
        Key: srcKey,
      })
    );
    const contentType = headResult.ContentType;
    const contentLength = headResult.ContentLength;
    console.log(`Content-Type: ${contentType}`);

    if (!SUPPORTED_CONTENT_TYPES[contentType]) {
      console.log(`ERROR: Unsupported content type (${contentType})`);
      return;
    }

    if (contentLength > MAX_FILE_SIZE) {
      console.log(`ERROR: File size exceeds maximum limit (${contentLength} bytes)`);
      return;
    }

    // Get the image from the source bucket
    const { Body } = await S3.send(
      new GetObjectCommand({
        Bucket: srcBucket,
        Key: srcKey,
      })
    );
    const image = await Body.transformToByteArray();

    // Resize image
    const outputBuffer = await sharp(image).resize(THUMBNAIL_WIDTH).toBuffer();

    // Store new image in the destination bucket
    await S3.send(
      new PutObjectCommand({
        Bucket: DEST_BUCKET,
        Key: srcKey,
        Body: outputBuffer,
        ContentType: contentType,
      })
    );

    const message = `Successfully resized ${srcBucket}/${srcKey} and uploaded to ${DEST_BUCKET}/${srcKey}`;
    console.log(message);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message,
        contentType,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error processing image", error: error.message }),
    };
  }
};