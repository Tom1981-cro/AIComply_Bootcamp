import { RequestLinkForm } from "@/components/orders/request-link-form";

export const metadata = { title: "Re-download a purchase" };

export default function OrdersIndexPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-surface px-6 py-24">
      <div className="w-full max-w-lg rounded-lg border border-border bg-background p-8">
        <h1 className="text-xl font-semibold">Re-download a purchase</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the email you purchased with. We&apos;ll send a secure link to access your most
          recent order&apos;s downloads.
        </p>
        <div className="mt-6">
          <RequestLinkForm />
        </div>
      </div>
    </main>
  );
}
