import { formatMoney } from "@/lib/utils";

export interface DayRevenue {
  day: string; // e.g. "05-26"
  total: number; // minor units
}

export function RevenueChart({ data, currency = "EUR" }: { data: DayRevenue[]; currency?: string }) {
  const max = Math.max(1, ...data.map((d) => d.total));
  const sum = data.reduce((acc, d) => acc + d.total, 0);

  return (
    <section className="rounded-lg border border-border bg-background p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-semibold">Revenue · last 30 days</h2>
        <span className="text-sm text-muted-foreground">{formatMoney(sum, currency)} total</span>
      </div>
      <div className="mt-6 flex h-40 items-end gap-1">
        {data.map((d) => (
          <div key={d.day} className="group flex flex-1 flex-col items-center justify-end">
            <div
              className="w-full rounded-t bg-primary/80 transition-colors group-hover:bg-primary"
              style={{ height: `${Math.round((d.total / max) * 100)}%` }}
              title={`${d.day}: ${formatMoney(d.total, currency)}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
