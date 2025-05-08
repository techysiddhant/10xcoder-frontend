"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";
import { ScaleLoader } from "react-spinners";

import { getBookmarks } from "@/lib/http";
import { BookmarkType } from "@/lib/types";

import InfiniteScrollContainer from "../infinite-scroll-container";
import { BookmarkCard } from "./bookmark-card";

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
const BookmarksMain = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["bookmarks"],
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams();
        if (pageParam) {
          params.append("cursor", pageParam);
        }
        return getBookmarks(params.toString()).then((res) => res.data);
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      initialPageParam: undefined,
    });

  const bookmarks = data?.pages.flatMap((page) => page.bookmarks);
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
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
          Your Bookmarks
        </h1>
      </motion.div>
      <div className="w-full">
        {bookmarks && bookmarks.length > 0 ? (
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
                {bookmarks.map((bookmark: BookmarkType, index) => (
                  <motion.div
                    key={bookmark.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05, // <-- This staggers cards by 50ms each
                    }}
                  >
                    <BookmarkCard bookmark={bookmark} />
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
          <div>No bookmarks found</div>
        )}
      </div>
    </motion.div>
  );
};

export default BookmarksMain;
