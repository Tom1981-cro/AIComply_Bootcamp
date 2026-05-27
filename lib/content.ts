import { promises as fs } from "node:fs";
import path from "node:path";

const CONTENT_ROOT = path.join(process.cwd(), "content");

/**
 * Read a markdown content file relative to /content. Returns null if absent.
 * Content files are human-authored placeholders; we render them as plain text
 * (whitespace preserved) rather than pulling in a markdown renderer dependency.
 */
export async function readContentFile(relativePath: string): Promise<string | null> {
  // Guard against path traversal.
  const resolved = path.resolve(CONTENT_ROOT, relativePath);
  if (!resolved.startsWith(CONTENT_ROOT)) return null;
  try {
    return await fs.readFile(resolved, "utf8");
  } catch {
    return null;
  }
}
