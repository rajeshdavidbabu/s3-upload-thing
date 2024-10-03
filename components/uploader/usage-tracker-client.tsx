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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface UsageTrackerClientProps {
  storageUsed: string;
  bandwidthUsed: string;
  storagePercentage: number;
  bandwidthPercentage: number;
}

export function UsageTrackerClient({
  storageUsed,
  bandwidthUsed,
  storagePercentage,
  bandwidthPercentage,
}: UsageTrackerClientProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors cursor-pointer hover:opacity-70">
            <span className="flex items-center mr-1 font-bold">Usage: </span>
            <span className="flex items-center">
              <HardDrive className="w-4 h-4 mr-1" />
              <span>{storageUsed}</span>
            </span>
            <span className="mx-1"> / </span>
            <span className="flex items-center">
              <Wifi className="w-4 h-4 mr-1" />
              <span>{bandwidthUsed}</span>
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-64 p-0 bg-transparent">
          <Card className="pt-4">
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium flex items-center">
                      <HardDrive className="w-4 h-4 mr-1" /> Storage
                    </span>
                    <span className="text-sm font-medium">{storageUsed}</span>
                  </div>
                  <Progress value={storagePercentage} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium flex items-center">
                      <Wifi className="w-4 h-4 mr-1" /> Bandwidth
                    </span>
                    <span className="text-sm font-medium">{bandwidthUsed}</span>
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
