import Link from "next/link";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/admin" className="font-semibold">
            Admin
          </Link>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/admin" className="hover:text-foreground">
              Orders
            </Link>
            <Link href="/admin/subscribers" className="hover:text-foreground">
              Subscribers
            </Link>
            <Link href="/" className="hover:text-foreground">
              Site ↗
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
