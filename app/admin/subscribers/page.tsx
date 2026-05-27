import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function buildWhere(sp: Record<string, string | undefined>): Prisma.LeadMagnetSubscriberWhereInput {
  const where: Prisma.LeadMagnetSubscriberWhereInput = {};
  if (sp.tag) where.tag = { contains: sp.tag, mode: "insensitive" };
  if (sp.confirmed === "yes") where.confirmed = true;
  if (sp.confirmed === "no") where.confirmed = false;
  return where;
}

export default async function AdminSubscribersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const where = buildWhere(sp);

  const subscribers = await prisma.leadMagnetSubscriber.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  const exportQuery = new URLSearchParams();
  if (sp.tag) exportQuery.set("tag", sp.tag);
  if (sp.confirmed) exportQuery.set("confirmed", sp.confirmed);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Lead-magnet subscribers</h2>
        <a
          href={`/api/admin/subscribers/export?${exportQuery.toString()}`}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-surface-muted"
        >
          Export CSV
        </a>
      </div>

      <form className="flex flex-wrap items-end gap-3" method="get">
        <label className="flex flex-col text-xs text-muted-foreground">
          Tag
          <input
            name="tag"
            defaultValue={sp.tag ?? ""}
            placeholder="source:toolkit-lead-magnet"
            className="mt-1 h-9 w-64 rounded-md border border-input bg-background px-2 text-sm"
          />
        </label>
        <label className="flex flex-col text-xs text-muted-foreground">
          Status
          <select
            name="confirmed"
            defaultValue={sp.confirmed ?? ""}
            className="mt-1 h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
          >
            <option value="">All</option>
            <option value="yes">Confirmed</option>
            <option value="no">Unconfirmed</option>
          </select>
        </label>
        <button
          type="submit"
          className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Filter
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Confirmed</th>
              <th className="px-4 py-3">Tag</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No subscribers match these filters.
                </td>
              </tr>
            )}
            {subscribers.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3">{s.confirmed ? "Yes" : "No"}</td>
                <td className="px-4 py-3 font-mono text-xs">{s.tag}</td>
                <td className="px-4 py-3">{s.source}</td>
                <td className="whitespace-nowrap px-4 py-3">{formatDate(s.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
