import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./components/sidebar-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarNavItems = [
    {
      href: "/settings",
      title: "Account",
    },
    {
      href: "/settings/usage",
      title: "Usage",
    }
  ];

  return (
    <div className="h-full gap-4 flex flex-col">
      <Link href="/dashboard">
        <Button variant="link" className="p-0">
          <ChevronLeft />
          Back to dashboard
        </Button>
      </Link>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl">Settings</CardTitle>
          <CardDescription>
            Manage your account, payments and verify your usage.
          </CardDescription>
          <Separator />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-1/4">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <main className="flex-1">{children}</main>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
