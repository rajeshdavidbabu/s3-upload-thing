'use server';

import { UsageTrackerClient } from "./usage-tracker-client";
import { getUserUsage } from "@/lib/s3/action";
import { formatBytes } from "@/lib/utils";
import { verifySession } from "@/app/auth/utils";
import { HardDrive, Wifi } from "lucide-react";

const getPercentage = (used: number, total: number) => {
  if (used === -1 || total === -1) return 0;
  return Math.min(Math.round((used / total) * 100), 100);
};

export default async function UsageTracker() {
  const usageData = await getUserUsage();

  console.log(usageData);

  const storagePercentage = getPercentage(
    usageData.storageUsedBytes,
    50 * 1024 * 1024 * 1024
  ); // Assuming 50GB total
  const bandwidthPercentage = getPercentage(
    usageData.bandwidthUsedBytes,
    10 * 1024 * 1024 * 1024
  ); // Assuming 10GB total

  return (
    <>
      <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors cursor-pointer hover:opacity-70">
        <span className="flex items-center mr-1 font-bold">Usage: </span>
        <span className="flex items-center">
          <HardDrive className="w-4 h-4 mr-1" />
          <span>{formatBytes(usageData.storageUsedBytes)}</span>
        </span>
        <span className="mx-1"> / </span>
        <span className="flex items-center">
          <Wifi className="w-4 h-4 mr-1" />
          <span>{formatBytes(usageData.bandwidthUsedBytes)}</span>
        </span>
      </div>
      <UsageTrackerClient
        storageUsed={formatBytes(usageData.storageUsedBytes)}
        bandwidthUsed={formatBytes(usageData.bandwidthUsedBytes)}
        storagePercentage={storagePercentage}
        bandwidthPercentage={bandwidthPercentage}
      />
    </>
  );
}
