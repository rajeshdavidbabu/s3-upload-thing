"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

export default function FileTypeFilterDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["all"]);
  const [isOpen, setIsOpen] = useState(false);

  const fileTypes = ["all", "images", "videos", "pdf", "other"];

  useEffect(() => {
    const urlTypes = searchParams.get("selectedFileTypes");
    if (urlTypes) {
      setSelectedTypes(urlTypes.split(","));
    } else {
      setSelectedTypes(["all"]);
    }
  }, [searchParams]);

  const handleToggle = (type: string) => {
    setSelectedTypes((prev) => {
      let newTypes: string[];
      if (type === "all") {
        newTypes = ["all"];
      } else {
        newTypes = prev.includes(type)
          ? prev.filter((t) => t !== type)
          : [...prev.filter((t) => t !== "all"), type];

        newTypes = newTypes.length === 0 ? ["all"] : newTypes;
      }

      updateURL(newTypes);
      return newTypes;
    });
  };

  const updateURL = (types: string[]) => {
    const params = new URLSearchParams(searchParams);
    if (types.includes("all") || types.length === 0) {
      params.delete("selectedFileTypes");
    } else {
      params.set("selectedFileTypes", types.join(","));
    }
    router.push(params.toString() ? `?${params.toString()}` : "/");
  };

  const isAllSelected = selectedTypes.includes("all");
  const isAllDisabled = selectedTypes.length > 0 && !isAllSelected;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2">
        <div className="space-y-2">
          {fileTypes.map((type) => (
            <Toggle
              key={type}
              pressed={selectedTypes.includes(type)}
              onPressedChange={() => handleToggle(type)}
              disabled={type === "all" ? isAllDisabled : false}
              className="w-full justify-start"
            >
              <span className="capitalize">
                {type === "all" ? "All Files" : type}
              </span>
            </Toggle>
          ))}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Selected: {selectedTypes.join(", ")}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
