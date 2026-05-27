import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { TIER_ORDER } from "@/lib/tiers";
import { formatDate, formatMoney } from "@/lib/utils";
import { RevenueChart, type DayRevenue } from "@/components/admin/revenue-chart";

export const dynamic = "force-dynamic";

const TIER_VALUES = new Set<string>(TIER_ORDER);

function parseDate(v?: string): Date | undefined {
  if (!v) return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

async function getDailyRevenue(): Promise<DayRevenue[]> {
  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: { status: "PAID", createdAt: { gte: since } },
    select: { amount: true, createdAt: true },
  });

  const buckets = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    buckets.set(d.toISOString().slice(5, 10), 0);
  }
  for (const o of orders) {
    const key = o.createdAt.toISOString().slice(5, 10);
    if (buckets.has(key)) buckets.set(key, buckets.get(key)! + o.amount);
  }
  return [...buckets.entries()].map(([day, total]) => ({ day, total }));
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;

  const where: Prisma.OrderWhereInput = {};
  if (sp.tier && TIER_VALUES.has(sp.tier)) where.tier = sp.tier as Prisma.OrderWhereInput["tier"];
  if (sp.country) where.country = { contains: sp.country, mode: "insensitive" };
  const from = parseDate(sp.from);
  const to = parseDate(sp.to);
  if (from || to) where.createdAt = { ...(from && { gte: from }), ...(to && { lte: to }) };

  const [orders, daily] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }),
    getDailyRevenue(),
  ]);

  return (
    <div className="space-y-8">
      {sp.reissued && (
        <p className="rounded-md border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
          Re-issued downloads for order {sp.reissued}.
        </p>
      )}

      <RevenueChart data={daily} />

      <section>
        <h2 className="font-semibold">Orders</h2>
        <form className="mt-4 flex flex-wrap items-end gap-3" method="get">
          <label className="flex flex-col text-xs text-muted-foreground">
            Tier
            <select
              name="tier"
              defaultValue={sp.tier ?? ""}
              className="mt-1 h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
            >
              <option value="">All</option>
              {TIER_ORDER.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-xs text-muted-foreground">
            Country
            <input
              name="country"
              defaultValue={sp.country ?? ""}
              placeholder="IE"
              className="mt-1 h-9 rounded-md border border-input bg-background px-2 text-sm"
            />
          </label>
          <label className="flex flex-col text-xs text-muted-foreground">
            From
            <input
              type="date"
              name="from"
              defaultValue={sp.from ?? ""}
              className="mt-1 h-9 rounded-md border border-input bg-background px-2 text-sm"
            />
          </label>
          <label className="flex flex-col text-xs text-muted-foreground">
            To
            <input
              type="date"
              name="to"
              defaultValue={sp.to ?? ""}
              className="mt-1 h-9 rounded-md border border-input bg-background px-2 text-sm"
            />
          </label>
          <button
            type="submit"
            className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Filter
          </button>
        </form>

        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Lemon ID</th>
                <th className="px-4 py-3">Re-issues</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    No orders match these filters.
                  </td>
                </tr>
              )}
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="whitespace-nowrap px-4 py-3">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3">{o.email}</td>
                  <td className="px-4 py-3">{o.tier}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatMoney(o.amount, o.currency)}
                  </td>
                  <td className="px-4 py-3">{o.country ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{o.lemonOrderId}</td>
                  <td className="px-4 py-3">{o.downloadReissueCount}</td>
                  <td className="px-4 py-3 text-right">
                    <form action="/api/admin/reissue" method="post">
                      <input type="hidden" name="orderId" value={o.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-border px-3 py-1 text-xs hover:bg-surface-muted"
                      >
                        Re-issue
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
