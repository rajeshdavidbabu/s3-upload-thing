import { Trash2Icon } from "lucide-react";

export function Spinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
    </div>
  );
}

export function Deleting() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <Trash2Icon className="animate-bounce text-red-500 w-8 h-8" />
      </div>
    </div>
  );
}