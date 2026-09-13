import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import "../styles/streamChatTheme.css";
import Providers from "./providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const viewport = {
  themeColor: "#350d36",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Slacki — Where Work Happens",
  description: "Professional workspace for teams — real-time messaging, channels, and video calls. Built with Next.js, Clerk, and Stream.",
  icons: { icon: "/slack-logo.png" },
  openGraph: {
    title: "Slacki — Professional Workspace",
    description: "Real-time messaging, organized channels, and crystal-clear video.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Slacki — Where Work Happens" },
};

export const dynamic = "force-dynamic";

const isPreview =
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("dummy");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Preview without Clerk — render directly (MarketingLanding + no auth)
  if (isPreview) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Providers>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                className: "text-sm",
                style: { border: "1px solid #e4e4e7", borderRadius: "12px", padding: "12px 16px", background: "#fff", color: "#18181b" },
                success: { iconTheme: { primary: "#18181b", secondary: "#fff" } },
              }}
            />
          </Providers>
          <div className="fixed bottom-3 right-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3 py-2 rounded-lg shadow-sm">
            Preview mode — set real Clerk keys in <code className="font-mono">.env.local</code> to enable auth
          </div>
        </body>
      </html>
    );
  }

  if (!publishableKey) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div className="p-8 text-center">Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY — check .env</div>
        </body>
      </html>
    );
  }
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Providers>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                className: "text-sm",
                style: { border: "1px solid #e4e4e7", borderRadius: "12px", padding: "12px 16px", background: "#fff", color: "#18181b" },
                success: { iconTheme: { primary: "#18181b", secondary: "#fff" } },
              }}
            />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
