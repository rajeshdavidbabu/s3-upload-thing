'use server';

import { UsageTrackerClient } from "./usage-tracker-client";
import { getUserUsage } from "@/db/api/usage";
import { formatBytes } from "@/lib/utils";
import { verifySession } from "@/app/auth/utils";

const getPercentage = (used: number, total: number) => {
  if (used === -1 || total === -1) return 0;
  return Math.min(Math.round((used / total) * 100), 100);
};

const MAX_STORAGE = 50 * 1024 * 1024 * 1024;
const MAX_BANDWIDTH = 10 * 1024 * 1024 * 1024;

export default async function UsageTracker() {
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
    <div className="group">
      <UsageTrackerClient
        storageUsed={formatBytes(usageData.storageUsedBytes)}
        storageMax={formatBytes(MAX_STORAGE)}
        bandwidthUsed={formatBytes(usageData.bandwidthUsedBytes)}
        bandwidthMax={formatBytes(MAX_BANDWIDTH)}
        storagePercentage={storagePercentage}
        bandwidthPercentage={bandwidthPercentage}
      />
    </div>
  );
}
