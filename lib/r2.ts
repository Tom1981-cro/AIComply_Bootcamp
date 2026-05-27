import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireEnv } from "@/lib/env";

let cached: S3Client | undefined;

function client(): S3Client {
  if (cached) return cached;
  cached = new S3Client({
    region: "auto",
    endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
  return cached;
}

/**
 * Generate a short-lived presigned GET URL for an R2 object. This is the URL
 * the customer's browser actually fetches the bytes from. We keep it very
 * short-lived (default 60s) because access is gated by our own download route
 * (which enforces the 1-hour grant window, the 5-download cap, and IP binding);
 * the presigned URL is just the final redirect target.
 */
export async function getPresignedDownloadUrl(
  fileKey: string,
  expiresInSeconds = 60,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: requireEnv("R2_BUCKET"),
    Key: fileKey,
  });
  return getSignedUrl(client(), command, { expiresIn: expiresInSeconds });
}
