"use client";

import { useMemo } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import {
  ArrowUpRight,
  Calendar,
  FileText,
  ShieldAlert,
  Video,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { addOrRemoveBookmark, upvoteResource } from "@/lib/http";
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
  const { theme } = useTheme();
  const currentTheme = useMemo(() => theme, [theme]);
  const queryClient = useQueryClient();
  const upvoteMutation = useMutation({
    mutationFn: async (resourceId: string) => {
      return (await upvoteResource(resourceId)).data;
    },
    onSuccess: ({ resourceId }) => {
      queryClient.invalidateQueries({ queryKey: ["resource", resourceId] });
    },
  });
  const bookmarkMutation = useMutation({
    mutationFn: async (resourceId: string) => {
      return (await addOrRemoveBookmark(resourceId)).data;
    },
    // onSuccess: ({ resourceId }) => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["resource", resourceId],
    //   });
    // },
    //TODO: return bookmark from api
    onMutate: async (resourceId) => {
      await queryClient.cancelQueries({ queryKey: ["resource", resourceId] });
      const prev = queryClient.getQueryData<ResourceType>([
        "resource",
        resourceId,
      ]);
      if (prev) {
        queryClient.setQueryData(["resource", resourceId], {
          ...prev,
          isBookmarked: !prev.isBookmarked,
          bookmarkCount:
            (prev.bookmarkCount ?? 0) + (prev.isBookmarked ? -1 : 1),
        });
      }
      return { prev };
    },
    onError: (_e, _id, ctx) =>
      ctx?.prev && queryClient.setQueryData(["resource", _id], ctx.prev),
    // onSettled: (_d, _e, resourceId) =>
    //   queryClient.invalidateQueries({ queryKey: ["resource", resourceId] }),
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
  const handleBookmark = () => {
    bookmarkMutation.mutate(resource.id);
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
              <p className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert prose-headings:font-bold prose-headings:text-secondary-foreground prose-headings:dark:text-secondary-foreground prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-a:text-amber-500 prose-img:rounded-md prose-p:text-secondary-foreground prose-p:dark:text-secondary-foreground">
                {parse(
                  DOMPurify.sanitize(resource.description || "", {
                    USE_PROFILES: { html: true },
                  })
                )}
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
                    "shadow-primary/20 border-primary/20 text-primary inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2 py-1 font-bold shadow-sm",
                    resource?.hasUpvoted && "bg-amber-500/10"
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
                  <span className="text-xl">{resource?.upvoteCount}</span>
                </button>
                <button
                  onClick={handleBookmark}
                  disabled={bookmarkMutation.isPending}
                  className={cn(
                    "border-primary/50 ...",
                    bookmarkMutation.isPending &&
                      "cursor-not-allowed opacity-50"
                  )}
                  // className={
                  //   "border-primary/50 text-primary inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2 py-1 font-bold"
                  // }
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
                  <span className="text-xl">{resource?.bookmarkCount}</span>
                </button>
              </div>
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
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
