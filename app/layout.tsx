import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/general/theme-provider";
import { SiteHeader } from "@/components/general/site-header";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { TailwindIndicator } from "@/components/helpers/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "nextjs",
    "react",
    "uploader",
    "file-uploader",
    "file-input",
    "s3-file-uploader",
    "shadcn-file-uploader",
    "s3-upload-thing",
  ],
  authors: [
    {
      name: "rajeshdavidbabu",
      url: "https://www.rajeshdavidbabu.com",
    },
  ],
  creator: "rajeshdavidbabu",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@rajeshdavidbabu",
  },
  icons: {
    icon: "/icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  const session = await auth();
  const user = session?.user;

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex h-screen flex-col gap-4">
              <SiteHeader user={user} />
              <main className="flex-1 overflow-hidden container">
                {children}
              </main>
            </div>
            <TailwindIndicator />
          </ThemeProvider>
        </SessionProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
