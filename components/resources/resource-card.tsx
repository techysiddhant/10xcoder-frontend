"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  Bookmark,
  FileText,
  Tag,
  Video,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResourceType } from "@/lib/types";

export const ResourceCard = ({ resource }: { resource: ResourceType }) => {
  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("upvoted");
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
      className="h-full"
    >
      <Link href={`/resources/${resource.id}`} className="block h-full">
        <Card className="h-full overflow-hidden border-none bg-white shadow-lg dark:bg-slate-900">
          <div className="relative aspect-video overflow-hidden">
            {resource.image && (
              <img
                src={resource.image}
                alt={resource.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            )}
            <div className="absolute top-2 left-2 flex space-x-2">
              <Badge
                variant="outline"
                className="flex items-center bg-white/80 text-xs backdrop-blur-sm dark:bg-slate-900/80"
              >
                {getTypeIcon()}
                {resource.resourceType.charAt(0).toUpperCase() +
                  resource.resourceType.slice(1)}
              </Badge>
              {/* {resource.trending && (
                                <Badge className="bg-primary hover:bg-primary/90 text-white text-xs">Trending</Badge>
                            )} */}
            </div>
          </div>
          <div className="p-4">
            <div className="mb-2 flex items-start justify-between">
              <Badge variant="secondary" className="text-xs">
                {resource?.categoryName}
              </Badge>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 ${resource?.upvoteCount ? "text-primary dark:text-primary" : "text-slate-500 dark:text-slate-400"}`}
                  onClick={handleUpvote}
                >
                  <ArrowUp size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 ${true ? "text-primary dark:text-primary" : "text-slate-500 dark:text-slate-400"}`}
                  // onClick={handleBookmark}
                >
                  <Bookmark size={14} />
                </Button>
              </div>
            </div>
            <h3 className="mb-2 line-clamp-2 text-base font-semibold text-slate-900 dark:text-white">
              {resource.title}
            </h3>
            <p className="mb-3 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
              {resource.description}
            </p>

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

            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <ArrowUp size={14} className="mr-1" /> {resource.upvoteCount}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary dark:text-primary flex h-auto items-center p-0 text-xs"
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
