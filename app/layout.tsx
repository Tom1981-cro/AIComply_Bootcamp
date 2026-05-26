import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/posthog-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "The EU AI Act SME Compliance Pack",
    template: "%s · EU AI Act SME Compliance Pack",
  },
  description:
    "[PLACEHOLDER] A practical toolkit for SMEs and consultants preparing for the EU AI Act.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
