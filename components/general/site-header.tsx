import Link from "next/link";
import { UploadIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/general/theme-toggle";
import { UserButton } from "@/app/auth/components/user-button";
import { User } from "next-auth";
import UsageTracker from "../uploader/usage-tracker";

export function SiteHeader({ user }: { user?: User }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-2 flex items-center md:mr-6 md:space-x-2">
          <UploadIcon className="size-4" aria-hidden="true" />
          <span className="hidden font-bold md:inline-block">
            {siteConfig.name}
          </span>
        </Link>
        <nav className="flex flex-1 items-center md:justify-end gap-4">
          <ModeToggle />
          {user ? (
            <UserButton user={user} />
          ) : (
            <Button variant="ghost" size="icon" className="size-8" asChild>
              <Link
                aria-label="GitHub repo"
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubLogoIcon className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
