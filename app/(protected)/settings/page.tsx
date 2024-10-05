import { verifySession } from "@/app/auth/utils";
import { getUserById } from "@/db/api/user";
import { redirect } from "next/navigation";

export default async function SettingsAccountPage() {
  const { userId } = await verifySession();

  const user = await getUserById(userId);

  if (!user) {
    return redirect("/");
  }

  const type = "Google OAuth";
  const { email, name } = user;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium">Name</h3>
        <p className="text-sm text-muted-foreground">{name}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium">Email</h3>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium">Type</h3>
        <p className="text-sm text-muted-foreground">{type}</p>
      </div>
    </div>
  );
}
