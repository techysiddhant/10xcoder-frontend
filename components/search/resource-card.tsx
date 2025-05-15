"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { ArrowUpRight, FileText, Video } from "lucide-react";

import { ResourceType } from "@/lib/types";
import { cn } from "@/lib/utils";

import { CustomImage } from "../custom-image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const ResourceCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-card flex flex-col overflow-hidden border-none p-0 shadow-lg">
        <div className="relative overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <div className="absolute top-2 left-2">
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-start justify-between">
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="flex-1">
            <Skeleton className="mb-2 h-[40px] w-full" />
            <Skeleton className="mb-3 h-[36px] w-full" />
          </div>
          <div className="mt-auto flex items-center justify-between">
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const ResourceCard = ({ resource }: { resource: ResourceType }) => {
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
              <CustomImage
                src={resource.image}
                alt={resource.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                width={300}
                height={300}
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
                {resource.categoryName}
              </Badge>
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
            </div>

            {/* View Button */}
            <div className="mt-auto flex items-center justify-between">
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
