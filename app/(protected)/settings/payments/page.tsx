import { verifySession } from "@/app/auth/utils";
import { getUserById } from "@/db/api/user";
import { redirect } from "next/navigation";

export default async function SettingsPaymentsPage() {
  const { userId } = await verifySession();

  const user = await getUserById(userId);

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium">Current Plan</h3>
        <p className="text-sm text-muted-foreground">Free</p>
      </div>
      <div>
        <h3 className="text-sm font-medium">Manage Subscription</h3>
        <p className="text-sm text-muted-foreground">Upgrade to Pro</p>
      </div>
      <div>
        <h3 className="text-sm font-medium">Upgrade</h3>
        <p className="text-sm text-muted-foreground">Upgrade to Pro</p>
      </div>
    </div>
  );
}
