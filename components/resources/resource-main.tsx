"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import queryString from "query-string";

import { env } from "@/env";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchData } from "@/lib/fetch-utils";
import { CategoryType, ResourceType, TagType } from "@/lib/types";

import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ResourcesList } from "./resources-list";
import { ResourcesTags } from "./resources-tags";

/* eslint-disable @typescript-eslint/no-unused-vars */

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

type Filters = {
  q?: string;
  tags?: string;
  resourceType?: string;
  category?: string;
};

export const ResourceMain = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTags = searchParams.get("tag")?.split(",") || [];

  // Store filters in state
  const [tab, setTab] = useState<Filters>({
    ...queryString.parse(searchParams.toString()),
    tags: queryTags.length ? queryTags.join(",") : undefined,
  });

  // 🔹 Apply debounce to `tab` to prevent rapid API calls
  const debouncedTab = useDebounce(tab, 500);

  // Fetch Data
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchData<TagType[]>(`${env.NEXT_PUBLIC_API_URL}/tags`),
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      fetchData<CategoryType[]>(`${env.NEXT_PUBLIC_API_URL}/categories`),
  });
  const { data: resources } = useQuery({
    queryKey: ["resources", debouncedTab], // 🔹 Use debouncedTab here
    queryFn: () =>
      fetchData<ResourceType[]>(
        `${env.NEXT_PUBLIC_API_URL}/resources?${debouncedTab.resourceType ? `type=${debouncedTab.resourceType}` : ""}&${debouncedTab.category ? `category=${debouncedTab.category}` : ""}&${debouncedTab.tags ? `tags=${debouncedTab.tags}` : ""}`
      ),
    enabled: !!debouncedTab,
  });

  // Update state when filters change
  const updateFilters = (updates: Partial<Filters>) => {
    setTab((prev) => ({ ...prev, ...updates }));
  };

  // Push updated filters to the URL when `tab` changes
  useEffect(() => {
    const filteredParams = Object.fromEntries(
      Object.entries(tab).filter(([key, v]) => v !== undefined && v !== "")
    );
    const newUrl = queryString.stringifyUrl({
      url: pathname,
      query: filteredParams,
    });

    router.push(newUrl, { scroll: false });
  }, [tab, pathname, router]);

  // Clear all selected tags
  const clearAllTags = () => {
    updateFilters({ tags: undefined });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <motion.div
        variants={itemVariants}
        className="mx-auto max-w-2xl space-y-4 text-center"
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Resources
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Browse our curated collection of high-quality free coding resources
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap justify-center gap-2"
      >
        {categories?.map((category) => (
          <Button
            key={category.id}
            onClick={() => updateFilters({ category: category.name })}
            variant="outline"
            size="sm"
            className={`rounded-full text-sm ${tab.category === category.name ? "bg-primary text-white hover:bg-blue-600 hover:text-white" : ""}`}
          >
            {category.name}
          </Button>
        ))}
        {tab.category && (
          <Button
            onClick={() => updateFilters({ category: undefined })}
            variant="secondary"
            size="sm"
            className="rounded-full text-sm"
          >
            Clear
          </Button>
        )}
      </motion.div>

      {/* Tabs and Tags */}
      <motion.div variants={itemVariants}>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <Tabs defaultValue="all" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-3">
                  {["all", "video", "article"].map((type) => (
                    <TabsTrigger
                      key={type}
                      value={type}
                      onClick={() =>
                        updateFilters({
                          resourceType: type !== "all" ? type : undefined,
                        })
                      }
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Tags Selection */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <ResourcesTags
                initialTags={tags?.map((tag) => tag.name) ?? []}
                selectedTags={tab.tags ? tab.tags.split(",") : []}
                handleTagsClick={(checked, tag) => {
                  setTab((prev) => {
                    const currentTags = prev.tags ? prev.tags.split(",") : [];
                    const updatedTags = checked
                      ? [...currentTags, tag]
                      : currentTags.filter((t) => t !== tag);
                    return {
                      ...prev,
                      tags: updatedTags.length
                        ? updatedTags.join(",")
                        : undefined,
                    };
                  });
                }}
              />

              {/* Clear All Button (Shown Only if Tags are Selected) */}
              {tab.tags && (
                <Button
                  onClick={clearAllTags}
                  variant="destructive"
                  size="sm"
                  className="rounded-full text-sm"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Resource List */}
        {resources && <ResourcesList resources={resources} />}
      </motion.div>
    </motion.div>
  );
};
