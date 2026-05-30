import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireEnv } from "@/lib/env";

/**
 * S3-compatible storage client.
 *
 * Defaults assume Hetzner Object Storage (S3-compatible). The same code paths
 * work with any S3-compatible backend (R2, AWS S3, MinIO, etc.) — just point
 * the env vars at the provider's endpoint.
 *
 * Hetzner Object Storage endpoints are regional:
 *   https://fsn1.your-objectstorage.com   (Falkenstein)
 *   https://nbg1.your-objectstorage.com   (Nuremberg)
 *   https://hel1.your-objectstorage.com   (Helsinki)
 *
 * NOTE: Hetzner has two distinct products — Object Storage (S3-compatible,
 * this file) and Storage Box (SFTP/WebDAV, NOT S3). If the actual target is
 * the Storage Box, the download flow needs to either proxy bytes through this
 * app over SFTP, or front the Storage Box with a WebDAV/HTTP gateway. Confirm
 * before deploying.
 */

let cached: S3Client | undefined;

function client(): S3Client {
  if (cached) return cached;
  cached = new S3Client({
    region: requireEnv("S3_REGION"),
    endpoint: requireEnv("S3_ENDPOINT"),
    credentials: {
      accessKeyId: requireEnv("S3_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("S3_SECRET_ACCESS_KEY"),
    },
    // Hetzner Object Storage uses virtual-hosted-style addressing
    // (<bucket>.<region>.your-objectstorage.com), which is the SDK default.
    forcePathStyle: false,
  });
  return cached;
}

/**
 * Generate a short-lived presigned GET URL for an object. This is the URL
 * the customer's browser actually fetches the bytes from. We keep it very
 * short-lived (default 60s) because access is gated by our own download
 * route, which enforces the 1-hour grant window, the 5-download cap, and IP
 * binding; the presigned URL is just the final redirect target.
 */
export async function getPresignedDownloadUrl(
  fileKey: string,
  expiresInSeconds = 60,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: requireEnv("S3_BUCKET"),
    Key: fileKey,
  });
  return getSignedUrl(client(), command, { expiresIn: expiresInSeconds });
}
