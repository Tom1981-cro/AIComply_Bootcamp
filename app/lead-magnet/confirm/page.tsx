import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { addToAudience, sendEmail } from "@/lib/resend";
import { createDownloadGrant, downloadUrl } from "@/lib/download";
import { leadMagnetDeliveryEmail } from "@/lib/email/templates";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const LEAD_MAGNET_FILE = {
  fileKey: "files/article-50-disclosure-pack.zip",
  label: "Article 50 disclosure pack",
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-surface px-6 py-24">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-8 text-center">
        {children}
      </div>
    </main>
  );
}

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <Shell>
        <h1 className="text-xl font-semibold">Invalid link</h1>
        <p className="mt-2 text-sm text-muted-foreground">No confirmation token was provided.</p>
      </Shell>
    );
  }

  const subscriber = await prisma.leadMagnetSubscriber.findUnique({
    where: { confirmToken: token },
  });

  if (!subscriber) {
    return (
      <Shell>
        <h1 className="text-xl font-semibold">Link expired or already used</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This confirmation link is no longer valid. Please request the pack again.
        </p>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/#lead-magnet">Request again</Link>
          </Button>
        </div>
      </Shell>
    );
  }

  // Best-effort: add to the Resend audience (don't block delivery on it).
  let audienceId: string | undefined;
  try {
    audienceId = await addToAudience(subscriber.email);
  } catch (err) {
    console.error("addToAudience failed", err);
  }

  await prisma.leadMagnetSubscriber.update({
    where: { id: subscriber.id },
    data: {
      confirmed: true,
      confirmedAt: new Date(),
      confirmToken: null,
      resendAudienceId: audienceId ?? subscriber.resendAudienceId,
    },
  });

  const grant = await createDownloadGrant({
    ...LEAD_MAGNET_FILE,
    email: subscriber.email,
    subscriberId: subscriber.id,
  });
  const url = downloadUrl(grant.id);

  try {
    await sendEmail({ to: subscriber.email, ...leadMagnetDeliveryEmail(url) });
  } catch (err) {
    console.error("lead-magnet delivery email failed", err);
  }

  return (
    <Shell>
      <h1 className="text-xl font-semibold">You&apos;re confirmed</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We&apos;ve emailed your Article 50 disclosure pack. You can also download it now:
      </p>
      <div className="mt-6">
        <Button asChild>
          <a href={url}>Download the pack</a>
        </Button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Link valid for 1 hour, up to 5 downloads.
      </p>
    </Shell>
  );
}
