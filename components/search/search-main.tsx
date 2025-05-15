"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import queryString from "query-string";
import Masonry from "react-masonry-css";

import { searchResources } from "@/lib/http";

import InfiniteScrollContainer from "../infinite-scroll-container";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ResourceCard, ResourceCardSkeleton } from "./resource-card";

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

export const SearchMain = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") ?? undefined;
  const [searchData, setSearchData] = useState({
    ...queryString.parse(searchParams.toString()),
    query: initialQuery,
  });
  const [query, setQuery] = useState(initialQuery);
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["search", searchData],
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams();
        if (searchData.query) {
          params.append("query", searchData.query);
        }
        if (pageParam) {
          params.append("cursor", pageParam);
        }
        return searchResources(params.toString()).then((res) => res.data);
      },
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      enabled: !!searchData.query,
    });

  const allResources = data?.pages.flatMap((page) => page.resources) ?? [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchButton = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchData({
      ...searchData,
      query: query,
    });
    router.push(`/search?query=${encodeURIComponent(query ?? "")}`);
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
        <h1 className="text-3xl font-bold text-slate-900 capitalize dark:text-white">
          Search Resources
        </h1>
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
              {allResources.length > 0 &&
                allResources?.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05, // <-- This staggers cards by 50ms each
                    }}
                  >
                    <ResourceCard resource={resource} />
                  </motion.div>
                ))}
              {isFetchingNextPage && (
                <>
                  {[...Array(6)].map((_, index) => (
                    <ResourceCardSkeleton key={index} />
                  ))}
                </>
              )}
            </Masonry>
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
          className="py-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {searchData.query ? (
            <h3 className="mb-2 text-xl font-medium">No resources found</h3>
          ) : (
            <h3 className="mb-2 text-xl font-medium">Search for resources</h3>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
