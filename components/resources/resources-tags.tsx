"use client";

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Tags } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "../ui/badge";

export type Checked = DropdownMenuCheckboxItemProps["checked"];

interface ResourcesTagsProps {
  initialTags: string[];
  selectedTags: string[];
  handleTagsClick: (checked: Checked, tag: string) => void;
}

export const ResourcesTags = ({
  selectedTags,
  initialTags,
  handleTagsClick,
}: ResourcesTagsProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Tags Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
          <Tags className="size-5" />
          <span>Filter by Tags</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Available Tags</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {initialTags?.map((tag) => (
            <DropdownMenuCheckboxItem
              key={tag}
              checked={selectedTags.includes(tag)}
              onCheckedChange={(checked) => handleTagsClick(checked, tag)}
            >
              {tag}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center space-x-1 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/30"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
