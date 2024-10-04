import type { Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/general/theme-provider";
import { SiteHeader } from "@/components/general/site-header";
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
              {/* This div exists to add a gap at the bottom of the page */}
              <div />
            </div>
            <TailwindIndicator />
          </ThemeProvider>
        </SessionProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
