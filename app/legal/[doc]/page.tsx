import { notFound } from "next/navigation";
import Link from "next/link";
import { readContentFile } from "@/lib/content";

export const dynamic = "force-dynamic";

const DOCS: Record<string, string> = {
  terms: "Terms of Service",
  privacy: "Privacy Policy",
  refunds: "Refund Policy",
  "license-starter": "Starter Licence",
  "license-pro": "Pro Licence",
  "license-consultant": "Consultant Licence",
};

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  return { title: DOCS[doc] ?? "Legal" };
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  if (!DOCS[doc]) notFound();

  const content = await readContentFile(`legal/${doc}.md`);

  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">{DOCS[doc]}</h1>
        <article className="mt-6 whitespace-pre-wrap font-mono text-sm leading-relaxed text-muted-foreground">
          {content ?? "[PLACEHOLDER] This document has not been written yet."}
        </article>
      </div>
    </main>
  );
}
