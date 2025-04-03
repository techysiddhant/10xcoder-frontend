"use client";

import { motion } from "framer-motion";

import { ResourceType } from "@/lib/types";

import { ResourceCard } from "./resource-card";

interface ResourcesListProps {
  resources: ResourceType[];
}
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
export const ResourcesList = ({ resources }: ResourcesListProps) => {
  return (
    <div className="space-y-6">
      {resources && resources?.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {resources?.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </motion.div>
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
