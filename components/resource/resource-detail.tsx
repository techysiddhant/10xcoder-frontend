"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, FileText, Video } from "lucide-react";

import { ResourceType } from "@/lib/types";

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-4xl"
    >
      <motion.div className="mb-8" variants={itemVariants}>
        <div className="mb-4 flex items-center space-x-3">
          <Badge
            variant="outline"
            className="flex items-center rounded-full px-3 py-1 text-sm"
          >
            {getTypeIcon()}
            {resource.resourceType}
          </Badge>

          <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
            {resource.categoryName}
          </Badge>
        </div>
        <h1 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
          {resource.title}
        </h1>

        <div className="mb-6 flex items-center text-sm text-slate-600 dark:text-slate-300">
          <Calendar size={16} className="mr-1" />
          <span>Added on {getFormattedDate(resource.createdAt)}</span>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <motion.div className="space-y-6 md:col-span-2" variants={itemVariants}>
          <Card className="glass-card overflow-hidden py-0">
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
                // onClick={handleVisit}
                className="group flex w-full items-center justify-center bg-blue-600 text-white hover:bg-blue-700"
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
          <Card className="glass-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Resource Actions</h2>

            <div className="space-y-4">
              {/* <div className="flex items-center space-x-3">
                                <Button
                                    variant={upvoted ? "default" : "outline"}
                                    className={`flex-1 flex items-center justify-center ${upvoted ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                                        }`}
                                    onClick={handleUpvote}
                                >
                                    <ArrowUp size={18} className="mr-2" />
                                    <span>Upvote ({upvotes})</span>
                                </Button>
                                <Button
                                    variant={downvoted ? "default" : "outline"}
                                    className={`flex-1 flex items-center justify-center ${downvoted ? "bg-red-600 hover:bg-red-700 text-white" : ""
                                        }`}
                                    onClick={handleDownvote}
                                >
                                    <ThumbsDown size={18} className="mr-2" />
                                    <span>Downvote</span>
                                </Button>
                            </div> */}

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

          <Card className="glass-card p-6">
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
                  Upvotes:
                </span>
                <span className="font-medium">{resource.upvoteCount}</span>
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
