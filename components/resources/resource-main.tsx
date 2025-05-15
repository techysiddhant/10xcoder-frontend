"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import queryString from "query-string";
import Masonry from "react-masonry-css";
import { ScaleLoader } from "react-spinners";

import { useDebounce } from "@/hooks/use-debounce";
import { getCategories, getResources, getTags } from "@/lib/http";
import { CategoryType, TagType } from "@/lib/types";
import { cn } from "@/lib/utils";

import InfiniteScrollContainer from "../infinite-scroll-container";
import { UpvoteProvider } from "../providers/upvote-provider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ResourceCard } from "./resource-card";
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

export type Filters = {
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
  const resourceType = searchParams.get("resourceType");
  const [query, setQuery] = useState(""); // Store filters in state
  const [tab, setTab] = useState<Filters>({
    ...queryString.parse(searchParams.toString()),
    tags: queryTags.length ? queryTags.join(",") : undefined,
  });
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };
  // 🔹 Apply debounce to `tab` to prevent rapid API calls
  const debouncedTab = useDebounce(tab, 500);

  // Fetch Data
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      return getTags().then((res) => res.data);
    },
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return getCategories().then((res) => res.data);
    },
  });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["resources", debouncedTab],
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams();
        if (debouncedTab.resourceType) {
          params.append("resourceType", debouncedTab.resourceType);
        }
        if (debouncedTab.category) {
          params.append("category", debouncedTab.category);
        }
        if (debouncedTab.tags) {
          params.append("tags", debouncedTab.tags);
        }
        if (pageParam) {
          params.append("cursor", pageParam);
        }
        return getResources(params.toString()).then((res) => res.data);
      },
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      enabled: !!debouncedTab,
    });
  const allResources = data?.pages.flatMap((page) => page.resources) ?? [];
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchButton = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <UpvoteProvider>
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
          <h1 className="text-3xl font-bold text-slate-900 capitalize dark:text-white">
            {debouncedTab.category
              ? `${debouncedTab.category} Resources`
              : "Resources"}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Browse our curated collection of high-quality free coding resources
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="relative mx-auto w-full max-w-md">
            <form onSubmit={handleSearchButton}>
              <Search
                size={18}
                className="absolute top-1/2 left-3 -translate-y-1/2 transform text-slate-400"
              />
              <Input
                type="text"
                placeholder="Search resources"
                value={query}
                aria-label="Search resources"
                onChange={handleSearch}
                className="dark:bg-card w-full rounded-lg border-slate-200 bg-white py-6 pl-10 shadow-sm transition-all duration-200 focus:border-amber-500 focus:ring-blue-500 dark:border-amber-500/40"
              />
              <Button
                type="submit"
                className="absolute top-1/2 right-2 -translate-y-1/2 transform text-white"
              >
                Search
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-2"
        >
          {categories?.map((category: CategoryType) => (
            <Button
              key={category.id}
              onClick={() => updateFilters({ category: category.name })}
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full text-sm hover:bg-yellow-500 hover:text-white",
                tab.category === category.name && "bg-primary text-white"
              )}
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
                <Tabs
                  defaultValue={resourceType ? resourceType : "all"}
                  className="w-full max-w-md"
                >
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
              <div className="flex flex-col items-center justify-center gap-3">
                {tags?.length > 0 && (
                  <div>
                    <ResourcesTags
                      initialTags={tags?.map((tag: TagType) => tag.name) ?? []}
                      selectedTags={tab.tags ? tab.tags.split(",") : []}
                      handleTagsClick={(checked, tag) => {
                        setTab((prev) => {
                          const currentTags = prev.tags
                            ? prev.tags.split(",")
                            : [];
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
                  </div>
                )}

                {/* Clear All Button (Shown Only if Tags are Selected) */}
                {tab.tags && (
                  <Button
                    onClick={clearAllTags}
                    variant="secondary"
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
          {allResources && allResources.length > 0 ? (
            <div className="mt-10">
              <InfiniteScrollContainer
                onBottomReached={() =>
                  hasNextPage && !isFetching && fetchNextPage()
                }
              >
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="flex w-auto gap-6"
                  columnClassName="masonry-column"
                >
                  {allResources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.05, // <-- This staggers cards by 50ms each
                      }}
                    >
                      <ResourceCard
                        resource={resource}
                        debouncedTab={debouncedTab}
                      />
                    </motion.div>
                  ))}
                </Masonry>
                {isFetchingNextPage && (
                  <div className="my-4 flex justify-center">
                    <ScaleLoader color="#f59e0b" />
                  </div>
                )}
              </InfiniteScrollContainer>
            </div>
          ) : isFetching ? (
            <div className="my-4 flex justify-center">
              <ScaleLoader color="#f59e0b" />
            </div>
          ) : (
            <motion.div
              className="py-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="mb-2 text-xl font-medium">No resources found</h3>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </UpvoteProvider>
  );
};
