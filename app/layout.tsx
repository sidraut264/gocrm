import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import SessionProvider from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "GoCRM",
  description: "Modern CRM built with Next.js + Prisma + MongoDB + shadcn/ui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-white">
        {/* ✅ Fix: Client wrapper for next-auth */}
        <SessionProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster />

          {/* Background gradient overlay for visual depth */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-purple-900/5" />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
