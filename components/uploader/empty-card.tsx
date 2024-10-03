'use client';

import { useSearchParams } from 'next/navigation';
import { ImageIcon, SearchIcon, FileIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface EmptyCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  page: number;
  totalPages: number;
}

export function EmptyCard({
  page,
  totalPages,
  className,
  ...props
}: EmptyCardProps) {
  const searchParams = useSearchParams();
  const isSearching = searchParams.has('fileName') || searchParams.has('selectedFileTypes');

  let title: string;
  let description: string;
  let Icon: React.ComponentType<{ className?: string }>;

  if (isSearching) {
    title = "No results found";
    description = "Try adjusting your search or filter criteria";
    Icon = SearchIcon;
  } else {
    title = page > totalPages ? "No more files to show" : "No files uploaded";
    description = "Upload some files to get started";
    Icon = FileIcon;
  }

  return (
    <Card
      className={cn(
        "flex w-full h-full flex-col items-center justify-center space-y-6 bg-transparent p-16",
        className,
      )}
      {...props}
    >
      <div className="mr-4 shrink-0 rounded-full border border-dashed p-4">
        <Icon className="size-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </Card>
  );
}
