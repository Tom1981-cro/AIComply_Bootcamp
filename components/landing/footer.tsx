import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-semibold">EU AI Act SME Compliance Pack</p>
            <p className="mt-2 text-sm text-muted-foreground">
              [PLACEHOLDER] Legal entity name, registered address, and VAT number.
              Sold by Lemon Squeezy, our Merchant of Record — VAT is handled at
              checkout.
            </p>
          </div>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/legal/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/legal/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/legal/refunds" className="hover:text-foreground">
              Refunds
            </Link>
            <Link href="/orders" className="hover:text-foreground">
              Re-download a purchase
            </Link>
          </nav>
        </div>
        <p className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} [PLACEHOLDER legal entity]. This toolkit is
          not legal advice.
        </p>
      </div>
    </footer>
  );
}
