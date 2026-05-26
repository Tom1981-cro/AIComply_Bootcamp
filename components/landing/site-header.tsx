import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-semibold tracking-tight">
          EU AI Act SME Compliance Pack
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          <a href="#deliverables" className="hover:text-foreground">
            What&apos;s inside
          </a>
          <a href="#pricing" className="hover:text-foreground">
            Pricing
          </a>
          <a href="#faq" className="hover:text-foreground">
            FAQ
          </a>
          <a href="#lead-magnet" className="hover:text-foreground">
            Free pack
          </a>
        </nav>
      </div>
    </header>
  );
}
