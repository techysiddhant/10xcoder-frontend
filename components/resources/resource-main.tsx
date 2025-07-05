"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

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
import { ResourceCardSkeleton } from "../search/resource-card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ResourceCard } from "./resource-card";
import { ResourcesTags } from "./resources-tags";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Reduced from 0.1 for faster animation
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }, // Reduced from 0.4 for faster animation
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

  // Extract query parameters once
  const initialParams = useMemo(() => {
    const queryTags = searchParams.get("tag")?.split(",") || [];
    return {
      ...queryString.parse(searchParams.toString()),
      tags: queryTags.length ? queryTags.join(",") : undefined,
      resourceType: searchParams.get("resourceType") || undefined,
      category: searchParams.get("category") || undefined,
    };
  }, [searchParams]);

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Filters>(initialParams);
  const [isSearching, setIsSearching] = useState(false);

  // Apply debounce to prevent rapid API calls
  const debouncedTab = useDebounce(tab, 500);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  // Optimized data fetching with stale-time and cache configuration
  const { data: tags, isLoading: isTagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => getTags().then((res) => res.data),
    staleTime: 5 * 60 * 1000, // Cache tags for 5 minutes
    refetchOnWindowFocus: false,
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => getCategories().then((res) => res.data),
    staleTime: 5 * 60 * 1000, // Cache categories for 5 minutes
    refetchOnWindowFocus: false,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
  } = useInfiniteQuery({
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
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000, // Cache resources for 1 minute
  });

  // Memoize resources to prevent unnecessary re-renders
  const allResources = useMemo(
    () => data?.pages.flatMap((page) => page.resources) ?? [],
    [data?.pages]
  );

  // Use callback for filter updates to prevent recreating function on each render
  const updateFilters = useCallback((updates: Partial<Filters>) => {
    setTab((prev) => ({ ...prev, ...updates }));
  }, []);

  // Push updated filters to the URL when `debouncedTab` changes
  useEffect(() => {
    const filteredParams = Object.fromEntries(
      Object.entries(debouncedTab).filter(
        ([_, v]) => v !== undefined && v !== ""
      )
    );

    const newUrl = queryString.stringifyUrl({
      url: pathname,
      query: filteredParams,
    });

    router.push(newUrl, { scroll: false });
  }, [debouncedTab, pathname, router]);

  // Memoized handlers for better performance
  const clearAllTags = useCallback(() => {
    updateFilters({ tags: undefined });
  }, [updateFilters]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleSearchButton = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSearching(true);
      router.push(`/search?query=${encodeURIComponent(query)}`);
      setIsSearching(false);
    },
    [query, router]
  );

  const handleTagsClick = useCallback((tag: string) => {
    setTab((prev) => {
      const currentTags = prev.tags ? prev.tags.split(",") : [];
      const updatedTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];

      return {
        ...prev,
        tags: updatedTags.length ? updatedTags.join(",") : undefined,
      };
    });
  }, []);

  // Determine if we're in a loading state
  const isLoading = isTagsLoading || isCategoriesLoading || isSearching;

  // Show a loading indicator while initial data loads
  if (isLoading && !allResources.length) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ScaleLoader color="#f59e0b" />
      </div>
    );
  }

  return (
    <UpvoteProvider>
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8" // Reduced from space-y-10
      >
        <motion.div
          variants={itemVariants}
          className="mx-auto max-w-2xl space-y-3" // Reduced from space-y-4
        >
          <h1 className="text-center text-3xl font-bold text-slate-900 capitalize dark:text-white">
            {debouncedTab.category
              ? `${debouncedTab.category} Resources`
              : "Resources"}
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-300">
            Browse our curated collection of high-quality free coding resources
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }} // Reduced delay
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
          <div className="space-y-5">
            {" "}
            {/* Reduced from space-y-6 */}
            <div className="space-y-3">
              {" "}
              {/* Reduced from space-y-4 */}
              <div className="flex justify-center">
                <Tabs
                  defaultValue={tab.resourceType || "all"}
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
                      clearAllTags={clearAllTags}
                      handleTagsClick={handleTagsClick}
                    />
                  </div>
                )}

                {/* Clear All Button (Shown Only if Tags are Selected) */}
                {/* {tab.tags && (
                  <Button
                    onClick={clearAllTags}
                    variant="secondary"
                    size="sm"
                    className="rounded-full text-sm"
                  >
                    Clear All
                  </Button>
                )} */}
              </div>
            </div>
          </div>

          {/* Resource List */}
          {allResources && allResources.length > 0 ? (
            <div className="mt-8">
              {" "}
              {/* Reduced from mt-10 */}
              <InfiniteScrollContainer
                onBottomReached={() =>
                  hasNextPage && !isFetching && fetchNextPage()
                }
              >
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="flex w-auto gap-5" // Reduced from gap-6
                  columnClassName="masonry-column"
                >
                  {allResources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4, // Reduced from 0.5
                        delay: Math.min(index * 0.03, 0.9), // Limit max delay to 0.9s
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
            <div className="my-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(6)].map((_, index) => (
                <ResourceCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <motion.div
              className="py-10 text-center" // Reduced from py-12
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="mb-2 text-xl font-medium">No resources found</h3>
              <p>
                Try going back to
                <Link
                  className="text-primary px-1 font-medium underline"
                  href={"/"}
                >
                  Home
                </Link>
                or
                <span
                  className="text-primary cursor-pointer px-1 font-medium underline"
                  onClick={() => {
                    refetch();
                  }}
                >
                  Refreshing Page
                </span>{" "}
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </UpvoteProvider>
  );
};
