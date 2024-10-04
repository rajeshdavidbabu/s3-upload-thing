"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { HardDrive, Wifi } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface UsageTrackerClientProps {
  storageUsed: string;
  bandwidthUsed: string;
  storageMax: string;
  bandwidthMax: string;
  storagePercentage: number;
  bandwidthPercentage: number;
}

export function UsageTrackerClient({
  storageUsed,
  bandwidthUsed,
  storageMax,
  bandwidthMax,
  storagePercentage,
  bandwidthPercentage,
}: UsageTrackerClientProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex animate-buttonheartbeat group-hover:animate-none gap-2 items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors cursor-pointer justify-center">
            Usage
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-64 p-0 bg-transparent">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage</CardTitle>
              <CardDescription>
                The main costs for Cloud Storage are the Storage and the
                Download Bandwidth costs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium flex items-center">
                      <HardDrive className="w-4 h-4 mr-1" /> Storage
                    </span>
                    <span className="text-sm font-medium">
                      {storageUsed} / {storageMax}
                    </span>
                  </div>
                  <Progress value={storagePercentage} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium flex items-center">
                      <Wifi className="w-4 h-4 mr-1" /> Bandwidth
                    </span>
                    <span className="text-sm font-medium">
                      {bandwidthUsed} / {bandwidthMax}
                    </span>
                  </div>
                  <Progress value={bandwidthPercentage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
