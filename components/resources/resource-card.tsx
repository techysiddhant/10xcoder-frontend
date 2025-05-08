"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { useMemo } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { ArrowUpRight, FileText, Tag, Video } from "lucide-react";
import { useTheme } from "next-themes";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { addOrRemoveBookmark, upvoteResource } from "@/lib/http";
import { ResourceType } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Filters } from "./resource-main";

export const ResourceCard = ({
  resource,
  debouncedTab,
}: {
  resource: ResourceType;
  debouncedTab?: Filters;
}) => {
  const { theme } = useTheme();
  const currentTheme = useMemo(() => theme, [theme]);
  const queryClient = useQueryClient();
  const bookmarkMutation = useMutation({
    mutationFn: async (resourceId: string) => {
      return (await addOrRemoveBookmark(resourceId)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["resources", debouncedTab],
      });
    },
  });
  const upvoteMutation = useMutation({
    mutationFn: async (resourceId: string) => {
      return (await upvoteResource(resourceId)).data;
    },
    onSuccess: ({ resourceId, action, count }) => {
      queryClient.setQueryData(["resource", resourceId], (oldResource: any) => {
        if (!oldResource) return oldResource;

        return {
          ...oldResource,
          upvoteCount: count,
          hasUpvoted: action === "added",
        };
      });
      queryClient.setQueryData(
        [
          "resources",
          queryClient.getQueryData<Filters>(["debouncedTab"]) ?? debouncedTab,
        ],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              resources: page.resources.map((resource: any) => {
                if (resource.id === resourceId) {
                  return {
                    ...resource,
                    upvoteCount: count,
                    hasUpvoted: action === "added",
                  };
                }
                return resource;
              }),
            })),
          };
        }
      );
    },
  });
  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    upvoteMutation.mutate(resource.id);
  };
  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    bookmarkMutation.mutate(resource.id);
  };
  const getTypeIcon = () => {
    switch (resource.resourceType) {
      case "video":
        return <Video size={16} className="mr-1" />;
      case "article":
        return <FileText size={16} className="mr-1" />;
      default:
        return null;
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <Link href={`/resources/${resource.id}`} className="block">
        <Card className="bg-card flex flex-col overflow-hidden border-none p-0 shadow-lg">
          {/* Only show image if exists */}
          {resource.image && (
            <div className="relative overflow-hidden">
              <img
                src={resource.image}
                alt={resource.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-2 left-2 flex space-x-2">
                <Badge
                  variant="outline"
                  className="dark:text-primary flex items-center bg-white/80 text-xs backdrop-blur-sm dark:bg-slate-900/80"
                >
                  {getTypeIcon()}
                  {resource.resourceType.charAt(0).toUpperCase() +
                    resource.resourceType.slice(1)}
                </Badge>
              </div>
            </div>
          )}
          {/* Main Content */}
          <div
            className={cn(
              "flex flex-1 flex-col p-4 pt-0",
              !resource.image && "pt-4"
            )}
          >
            <div className="mb-2 flex items-start justify-between">
              <Badge variant="secondary" className="text-xs">
                {resource?.categoryName}
              </Badge>
              <div className="flex items-center space-x-1">
                <button
                  aria-label={
                    resource.hasUpvoted ? "Remove upvote" : "Add upvote"
                  }
                  aria-pressed={resource.hasUpvoted}
                  onClick={handleUpvote}
                  disabled={upvoteMutation.isPending}
                  className={cn(
                    "cursor-pointer rounded-lg p-1 hover:bg-amber-500/10 dark:hover:bg-amber-500/10",
                    upvoteMutation.isPending && "opacity-50"
                  )}
                >
                  {resource?.hasUpvoted ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={`${currentTheme === "dark" ? "#f59e0b" : "#f59e0b80"}`}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.0017 21.9982H10.0475C9.03149 21.9982 7.32508 22.1082 7.32508 20.6026V13.5667C7.32508 13.0684 7.01695 12.7268 6.43689 12.7268H2.59948C1.43841 12.7268 2.24946 11.8116 2.66039 11.4193C3.07133 11.027 6.69819 7.22967 6.69819 7.22967C6.69819 7.22967 10.941 2.78849 11.4091 2.34169C11.8772 1.8949 12.1044 1.87739 12.5909 2.34169C13.0774 2.806 17.3018 7.22967 17.3018 7.22967C17.3018 7.22967 20.9287 11.027 21.3396 11.4193C21.7505 11.8116 22.5616 12.7268 21.4005 12.7268H17.5631C16.983 12.7268 16.6749 13.0684 16.6749 13.5667V20.6026C16.6749 22.1082 14.9685 21.9982 13.9525 21.9982H12.0017Z"
                        stroke="#d97706"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.0017 21.9982H10.0475C9.03149 21.9982 7.32508 22.1082 7.32508 20.6026V13.5667C7.32508 13.0684 7.01695 12.7268 6.43689 12.7268H2.59948C1.43841 12.7268 2.24946 11.8116 2.66039 11.4193C3.07133 11.027 6.69819 7.22967 6.69819 7.22967C6.69819 7.22967 10.941 2.78849 11.4091 2.34169C11.8772 1.8949 12.1044 1.87739 12.5909 2.34169C13.0774 2.806 17.3018 7.22967 17.3018 7.22967C17.3018 7.22967 20.9287 11.027 21.3396 11.4193C21.7505 11.8116 22.5616 12.7268 21.4005 12.7268H17.5631C16.983 12.7268 16.6749 13.0684 16.6749 13.5667V20.6026C16.6749 22.1082 14.9685 21.9982 13.9525 21.9982H12.0017Z"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      ></path>
                    </svg>
                  )}
                </button>
                <button
                  onClick={handleBookmark}
                  aria-label={
                    resource.isBookmarked ? "Remove bookmark" : "Add bookmark"
                  }
                  aria-pressed={resource.isBookmarked}
                  disabled={bookmarkMutation.isPending}
                  className={cn(
                    "cursor-pointer rounded-lg p-1 hover:bg-amber-500/10 dark:hover:bg-amber-500/10",
                    bookmarkMutation.isPending &&
                      "cursor-not-allowed opacity-50"
                  )}
                >
                  {resource.isBookmarked ? (
                    <svg
                      className=""
                      width="18"
                      height={"18"}
                      viewBox="0 0 24 24"
                      fill={`${currentTheme === "dark" ? "#f59e0b" : "#f59e0b4d"}`}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 17.9808V9.70753C4 6.07416 4 4.25748 5.17157 3.12874C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.12874C20 4.25748 20 6.07416 20 9.70753V17.9808C20 20.2867 20 21.4396 19.2272 21.8523C17.7305 22.6514 14.9232 19.9852 13.59 19.1824C12.8168 18.7168 12.4302 18.484 12 18.484C11.5698 18.484 11.1832 18.7168 10.41 19.1824C9.0768 19.9852 6.26947 22.6514 4.77285 21.8523C4 21.4396 4 20.2867 4 17.9808Z"
                        stroke="#d97706"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 17.9808V9.70753C4 6.07416 4 4.25748 5.17157 3.12874C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.12874C20 4.25748 20 6.07416 20 9.70753V17.9808C20 20.2867 20 21.4396 19.2272 21.8523C17.7305 22.6514 14.9232 19.9852 13.59 19.1824C12.8168 18.7168 12.4302 18.484 12 18.484C11.5698 18.484 11.1832 18.7168 10.41 19.1824C9.0768 19.9852 6.26947 22.6514 4.77285 21.8523C4 21.4396 4 20.2867 4 17.9808Z"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      ></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Title and Description */}
            <div className="flex-1">
              <h3 className="mb-2 line-clamp-2 min-h-[40px] text-base font-semibold text-slate-900 dark:text-white">
                {resource.title}
              </h3>
              <div className="mb-3 line-clamp-2 min-h-[36px] text-xs text-slate-600 dark:text-slate-300">
                {parse(
                  DOMPurify.sanitize(resource.description || "", {
                    USE_PROFILES: { html: true },
                  })
                )}
              </div>

              {/* Tags */}
              <div className="mb-3 flex flex-wrap gap-1.5">
                {resource?.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="flex items-center bg-slate-50 px-1.5 py-0 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <Tag size={10} className="mr-1 opacity-70" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* View Button */}
            <div className="mt-auto flex items-center justify-between">
              <div className="text-primary inline-flex items-center justify-start gap-1 rounded-2xl bg-amber-500/10 px-3 py-0.5 text-base font-bold">
                {resource?.hasUpvoted ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={`${currentTheme === "dark" ? "#f59e0b" : "#f59e0b80"}`}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.0017 21.9982H10.0475C9.03149 21.9982 7.32508 22.1082 7.32508 20.6026V13.5667C7.32508 13.0684 7.01695 12.7268 6.43689 12.7268H2.59948C1.43841 12.7268 2.24946 11.8116 2.66039 11.4193C3.07133 11.027 6.69819 7.22967 6.69819 7.22967C6.69819 7.22967 10.941 2.78849 11.4091 2.34169C11.8772 1.8949 12.1044 1.87739 12.5909 2.34169C13.0774 2.806 17.3018 7.22967 17.3018 7.22967C17.3018 7.22967 20.9287 11.027 21.3396 11.4193C21.7505 11.8116 22.5616 12.7268 21.4005 12.7268H17.5631C16.983 12.7268 16.6749 13.0684 16.6749 13.5667V20.6026C16.6749 22.1082 14.9685 21.9982 13.9525 21.9982H12.0017Z"
                      stroke="#d97706"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.0017 21.9982H10.0475C9.03149 21.9982 7.32508 22.1082 7.32508 20.6026V13.5667C7.32508 13.0684 7.01695 12.7268 6.43689 12.7268H2.59948C1.43841 12.7268 2.24946 11.8116 2.66039 11.4193C3.07133 11.027 6.69819 7.22967 6.69819 7.22967C6.69819 7.22967 10.941 2.78849 11.4091 2.34169C11.8772 1.8949 12.1044 1.87739 12.5909 2.34169C13.0774 2.806 17.3018 7.22967 17.3018 7.22967C17.3018 7.22967 20.9287 11.027 21.3396 11.4193C21.7505 11.8116 22.5616 12.7268 21.4005 12.7268H17.5631C16.983 12.7268 16.6749 13.0684 16.6749 13.5667V20.6026C16.6749 22.1082 14.9685 21.9982 13.9525 21.9982H12.0017Z"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    ></path>
                  </svg>
                )}
                <span>{resource.upvoteCount}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary dark:text-primary flex h-auto items-center text-xs"
              >
                <span>View</span>
                <ArrowUpRight size={12} className="ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};
