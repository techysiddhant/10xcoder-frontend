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
import { cn } from "@/lib/utils";

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
                  className="h-7 w-7 text-slate-500 dark:text-slate-400"
                >
                  <Bookmark size={14} />
                </Button>
              </div>
            </div>

            {/* Title and Description */}
            <div className="flex-1">
              <h3 className="mb-2 line-clamp-2 min-h-[40px] text-base font-semibold text-slate-900 dark:text-white">
                {resource.title}
              </h3>
              <p className="mb-3 line-clamp-2 min-h-[36px] text-xs text-slate-600 dark:text-slate-300">
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
            </div>

            {/* View Button */}
            <div className="mt-auto flex items-center justify-end">
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
