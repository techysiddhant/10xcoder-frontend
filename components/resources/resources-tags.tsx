"use client";

import { useState } from "react";

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export type Checked = DropdownMenuCheckboxItemProps["checked"];

interface ResourcesTagsProps {
  initialTags: string[];
  selectedTags: string[];
  handleTagsClick: (checked: Checked, tag: string) => void;
  clearAllTags: () => void;
}

export const ResourcesTags = ({
  selectedTags,
  initialTags,
  handleTagsClick,
  clearAllTags,
}: ResourcesTagsProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select tags"
            className="w-[200px] justify-between capitalize"
          >
            {selectedTags.length > 0
              ? selectedTags.length > 2
                ? `${selectedTags.length} selected`
                : selectedTags.join(", ")
              : "Select tags..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search tags..." className="h-9" />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {initialTags.map((tag) => (
                  <CommandItem
                    className="capitalize"
                    key={tag}
                    value={tag}
                    onSelect={(currentValue) => {
                      handleTagsClick(true, currentValue);
                    }}
                  >
                    {tag}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <div className="flex items-center border-t p-2">
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearAllTags();
                    setOpen(false);
                  }}
                  className="mr-auto h-8 text-xs"
                >
                  Clear all
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => setOpen(false)}
                className="ml-auto h-8 text-xs"
              >
                Done
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-primary flex items-center space-x-1 bg-amber-500/10"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
