import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function csvCell(value: string | boolean | Date | null): string {
  if (value === null) return "";
  const s = value instanceof Date ? value.toISOString() : String(value);
  // Escape per RFC 4180.
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tag = url.searchParams.get("tag");
  const confirmed = url.searchParams.get("confirmed");

  const where: Prisma.LeadMagnetSubscriberWhereInput = {};
  if (tag) where.tag = { contains: tag, mode: "insensitive" };
  if (confirmed === "yes") where.confirmed = true;
  if (confirmed === "no") where.confirmed = false;

  const subscribers = await prisma.leadMagnetSubscriber.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const header = ["email", "confirmed", "tag", "source", "confirmedAt", "createdAt"];
  const rows = subscribers.map((s) =>
    [s.email, s.confirmed, s.tag, s.source, s.confirmedAt, s.createdAt].map(csvCell).join(","),
  );
  const csv = [header.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
