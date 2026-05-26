import { prisma } from "@/lib/prisma";
import { consumeMagicLink } from "@/lib/magic-link";
import { buildOrderLinks } from "@/lib/fulfillment";
import { TIERS } from "@/lib/tiers";
import { formatMoney, formatDate } from "@/lib/utils";
import { RequestLinkForm } from "@/components/orders/request-link-form";

export const dynamic = "force-dynamic";

const REISSUE_CAP = 3;

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-surface px-6 py-24">
      <div className="w-full max-w-lg rounded-lg border border-border bg-background p-8">
        <h1 className="text-xl font-semibold">{title}</h1>
        {children}
      </div>
    </main>
  );
}

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ order_id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { order_id } = await params;
  const { token } = await searchParams;

  const order = await prisma.order.findUnique({ where: { id: order_id } });

  if (!order) {
    return (
      <Shell title="Order not found">
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t find that order. Check the link in your purchase email.
        </p>
      </Shell>
    );
  }

  // No token: ask for the purchase email to receive a magic link.
  if (!token) {
    return (
      <Shell title="Access your downloads">
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the email you purchased with and we&apos;ll send you a secure link to your
          downloads.
        </p>
        <div className="mt-6">
          <RequestLinkForm orderId={order.id} />
        </div>
      </Shell>
    );
  }

  const valid = await consumeMagicLink(order.id, token);
  if (!valid) {
    return (
      <Shell title="Link expired">
        <p className="mt-2 text-sm text-muted-foreground">
          This access link is no longer valid. Request a fresh one below.
        </p>
        <div className="mt-6">
          <RequestLinkForm orderId={order.id} />
        </div>
      </Shell>
    );
  }

  if (order.downloadReissueCount >= REISSUE_CAP) {
    return (
      <Shell title="Re-issue limit reached">
        <p className="mt-2 text-sm text-muted-foreground">
          This order has reached its limit of {REISSUE_CAP} re-issued download links. Please
          contact support for help.
        </p>
      </Shell>
    );
  }

  const { links, loomUrl } = await buildOrderLinks(order);
  await prisma.order.update({
    where: { id: order.id },
    data: { downloadReissueCount: { increment: 1 } },
  });

  return (
    <Shell title={`Your ${TIERS[order.tier].name} downloads`}>
      <p className="mt-1 text-sm text-muted-foreground">
        Order {formatMoney(order.amount, order.currency)} · {formatDate(order.createdAt)}
      </p>
      <ul className="mt-6 space-y-3">
        {links.map((l) => (
          <li key={l.url}>
            <a
              href={l.url}
              className="flex items-center justify-between rounded-md border border-border px-4 py-3 text-sm font-medium text-primary hover:bg-surface-muted"
            >
              {l.label}
              <span aria-hidden>↓</span>
            </a>
          </li>
        ))}
        {loomUrl && (
          <li>
            <a
              href={loomUrl}
              className="flex items-center justify-between rounded-md border border-border px-4 py-3 text-sm font-medium text-primary hover:bg-surface-muted"
            >
              Walkthrough video
              <span aria-hidden>↗</span>
            </a>
          </li>
        )}
      </ul>
      <p className="mt-6 text-xs text-muted-foreground">
        Each link is valid for 1 hour and up to 5 downloads.
      </p>
    </Shell>
  );
}
