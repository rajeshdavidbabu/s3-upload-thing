import { verifySession } from "@/app/auth/utils";
import { getUserById } from "@/db/api/user";
import { Progress } from "@/components/ui/progress";
import { HardDrive, Wifi } from "lucide-react";
import { redirect } from "next/navigation";
import { getUserUsage } from "@/db/api/usage";
import { formatBytes } from "@/lib/utils";

const getPercentage = (used: number, total: number) => {
  if (used === -1 || total === -1) return 0;
  return Math.min(Math.round((used / total) * 100), 100);
};

const MAX_STORAGE = 50 * 1024 * 1024 * 1024;
const MAX_BANDWIDTH = 10 * 1024 * 1024 * 1024;

export default async function SettingsUsagePage() {
  const { userId } = await verifySession();
  const usageData = await getUserUsage(userId);

  const storagePercentage = getPercentage(
    usageData.storageUsedBytes,
    MAX_STORAGE
  );
  const bandwidthPercentage = getPercentage(
    usageData.bandwidthUsedBytes,
    MAX_BANDWIDTH
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium flex items-center">
              <HardDrive className="w-4 h-4 mr-1" /> Storage
            </span>
            <span className="text-sm font-medium">
              {formatBytes(usageData.storageUsedBytes)} / {formatBytes(MAX_STORAGE)}
            </span>
          </div>
          <Progress value={storagePercentage} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium flex items-center">
              <Wifi className="w-4 h-4 mr-1" /> Bandwidth (Download Data-transfer)
            </span>
            <span className="text-sm font-medium">
              {formatBytes(usageData.bandwidthUsedBytes)} / {formatBytes(MAX_BANDWIDTH)}
            </span>
          </div>
          <Progress value={bandwidthPercentage} className="h-2" />
        </div>
      </div>
    </div>
  );
}
