"use client";

import { motion } from "framer-motion";
import Masonry from "react-masonry-css";

import { ResourceType } from "@/lib/types";

import { ResourceCard } from "./resource-card";

interface ResourcesListProps {
  resources: ResourceType[];
}

export const ResourcesList = ({ resources }: ResourcesListProps) => {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };
  return (
    <div className="mt-10">
      {resources && resources.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto gap-6"
          columnClassName="masonry-column"
        >
          {resources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.05, // <-- This staggers cards by 50ms each
              }}
            >
              <ResourceCard resource={resource} />
            </motion.div>
            // <ResourceCard key={resource.id} resource={resource} />
          ))}
        </Masonry>
      ) : (
        <motion.div
          className="py-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="mb-2 text-xl font-medium">No resources found</h3>
        </motion.div>
      )}
    </div>
  );
};
