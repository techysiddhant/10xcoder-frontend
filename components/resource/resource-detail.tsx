"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  FileText,
  ShieldAlert,
  Video,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { upvoteResource } from "@/lib/http";
import { ResourceType } from "@/lib/types";
import { cn } from "@/lib/utils";

import { LazyIFrame } from "../lazy-iframe";
import { ResourcePlaceholder } from "../resource-placeholder";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};
export const ResourceDetail = ({ resource }: { resource: ResourceType }) => {
  const queryClient = useQueryClient();
  const upvoteMutation = useMutation({
    mutationFn: async (resourceId: string) => {
      return (await upvoteResource(resourceId)).data;
    },
    onSuccess: ({ resourceId, action, count }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(["resource", resourceId], (oldResource: any) => {
        if (!oldResource) return oldResource;

        return {
          ...oldResource,
          upvoteCount: count,
          hasUpvoted: action === "added",
        };
      });
    },
  });
  const getTypeIcon = () => {
    switch (resource.resourceType) {
      case "video":
        return <Video className="mr-2" size={20} />;
      case "article":
        return <FileText className="mr-2" size={20} />;
      default:
        return null;
    }
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const handleUpvote = () => {
    upvoteMutation.mutate(resource.id);
  };
  const handleVisit = () => {
    window.open(resource.url, "_blank");
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-5xl"
    >
      <motion.div className="mb-8" variants={itemVariants}>
        {!resource.isPublished && (
          <Alert className="mb-4 border-orange-500 bg-transparent">
            <ShieldAlert className="h-4 w-4" color="#f97316" />
            <AlertTitle className="text-orange-700">
              Private Resource
            </AlertTitle>
            <AlertDescription className="text-orange-600">
              This resource is not published yet. Only you can view it; other
              users cannot see this.
            </AlertDescription>
          </Alert>
        )}
        <div className="mb-4 flex items-center space-x-3">
          <Badge
            variant="outline"
            className="border-primary flex items-center rounded-full border px-3 py-1 text-sm capitalize"
          >
            {getTypeIcon()}
            {resource.resourceType}
          </Badge>

          <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
            {resource.categoryName}
          </Badge>
        </div>
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl dark:text-white">
          {resource.title}
        </h1>

        <div className="mb-6 flex items-center text-sm text-slate-600 dark:text-slate-300">
          <Calendar size={16} className="mr-1" />
          <span>Added on {getFormattedDate(resource.createdAt)}</span>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <motion.div className="space-y-6 md:col-span-2" variants={itemVariants}>
          <Card className="bg-card overflow-hidden py-0">
            {resource.resourceType !== "video" ? (
              <div className="aspect-video w-full">
                {resource.image ? (
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ResourcePlaceholder type={resource.resourceType} />
                )}
              </div>
            ) : (
              <LazyIFrame url={resource.url} title={resource.title} />
            )}

            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Description</h2>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                {resource.description}
              </p>

              <Separator className="my-6" />

              <div className="mb-6 flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button
                onClick={handleVisit}
                className="group bg-primary flex w-full items-center justify-center text-white hover:bg-amber-600"
              >
                <span>Visit Resource</span>
                <ArrowUpRight
                  size={18}
                  className="ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Button>
            </div>
          </Card>
        </motion.div>
        <motion.div className="space-y-6" variants={itemVariants}>
          <Card className="bg-card border p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-xl">
            <h2 className="text-lg font-semibold">Resource Actions</h2>

            <div className="">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleUpvote}
                  className={cn(
                    "shadow-primary/20 border-primary/20 text-primary inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2 py-1 font-semibold shadow-sm",
                    resource?.hasUpvoted && "bg-amber-500/10"
                  )}
                >
                  {resource?.hasUpvoted ? (
                    <svg
                      viewBox="0 0 24 24"
                      width={24}
                      height={24}
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
                      width={24}
                      height={24}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z"
                        fill="#f59e0b"
                        className="fill-#f59e0b"
                      ></path>
                    </svg>
                  )}
                  <span className="text-lg">{resource?.upvoteCount}</span>
                  <span>{resource?.hasUpvoted ? "Upvoted" : "Upvote"}</span>
                </button>
              </div>

              {/* <Button
                                variant={bookmarked ? "default" : "outline"}
                                className={`w-full flex items-center justify-center ${bookmarked ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                                    }`}
                                onClick={handleBookmark}
                            >
                                <Bookmark size={18} className="mr-2" />
                                <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
                            </Button> */}
            </div>
          </Card>

          <Card className="bg-card border p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">
              About this {resource.resourceType}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">
                  Type:
                </span>
                <span className="font-medium capitalize">
                  {resource.resourceType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">
                  Category:
                </span>
                <span className="font-medium capitalize">
                  {resource.categoryName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">
                  Added:
                </span>
                <span className="font-medium">
                  {getFormattedDate(resource.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">
                  Added By
                </span>
                <span className="font-medium">
                  {resource?.creator?.username
                    ? `@${resource.creator.username}`
                    : resource?.creator?.name}
                </span>
              </div>
              {/* <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-300">Bookmarks:</span>
                                <span className="font-medium">{resource.bookmarks}</span>
                            </div> */}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
