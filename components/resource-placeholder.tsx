"use client";

import { FileText, Image, Video } from "lucide-react";

export const ResourcePlaceholder = ({ type }: { type: string }) => {
  const getPlaceholderImage = () => {
    switch (type) {
      case "video":
        return (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800">
            <Video size={64} className="text-slate-400 dark:text-slate-500" />
          </div>
        );
      case "article":
        return (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800">
            <FileText
              size={64}
              className="text-slate-400 dark:text-slate-500"
            />
          </div>
        );
      default:
        return (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800">
            <Image size={64} className="text-slate-400 dark:text-slate-500" />
          </div>
        );
    }
  };
  return <>{getPlaceholderImage()}</>;
};
