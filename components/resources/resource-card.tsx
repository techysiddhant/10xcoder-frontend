"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import { ArrowUpRight, Bookmark, FileText, Tag, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { upvoteResource } from "@/lib/http";
import { ResourceType } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Filters } from "./resource-main";

export const ResourceCard = ({
  resource,
  debouncedTab,
}: {
  resource: ResourceType;
  debouncedTab: Filters;
}) => {
  const queryClient = useQueryClient();
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
                  onClick={handleUpvote}
                  className="cursor-pointer rounded-lg p-1 hover:bg-amber-500/10 dark:hover:bg-amber-500/10"
                >
                  {resource?.hasUpvoted ? (
                    <svg
                      viewBox="0 0 24 24"
                      width={20}
                      height={20}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z"
                        fill="#f59e0b"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width={20}
                      height={20}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z"
                        fill="#f59e0b"
                      ></path>
                    </svg>
                  )}
                </button>
                <Button
                  variant="ghost"
                  className="h-7 w-7 hover:bg-amber-500/10 dark:hover:bg-amber-500/10"
                >
                  <Bookmark size={20} className="size-5 text-amber-500" />
                </Button>
              </div>
            </div>

            {/* Title and Description */}
            <div className="flex-1">
              <h3 className="mb-2 line-clamp-2 min-h-[40px] text-base font-semibold text-slate-900 dark:text-white">
                {resource.title}
              </h3>
              <div className="mb-3 line-clamp-2 min-h-[36px] text-xs text-slate-600 dark:text-slate-300">
                {parse(resource.description || "")}
              </div>

              {/* Tags */}
              <div className="mb-3 flex flex-wrap gap-1.5">
                {resource.tags.map((tag) => (
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
              <div className="text-primary inline-flex items-center justify-start gap-1 rounded-full bg-amber-500/10 px-3 py-0.5 text-sm font-semibold">
                {resource?.hasUpvoted ? (
                  <svg
                    viewBox="0 0 24 24"
                    width={12}
                    height={12}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z"
                      fill="#f59e0b"
                      className="fill-#f59e0b"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width={12}
                    height={12}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z"
                      fill="#f59e0b"
                      className="fill-#f59e0b"
                    ></path>
                  </svg>
                )}
                {resource.upvoteCount}
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
