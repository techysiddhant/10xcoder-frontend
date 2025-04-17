"use client";

import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { getResource } from "@/lib/http";

import { SubmitResourceForm } from "./submit-resource-form";

export const SubmitMain = () => {
  const searchParams = useSearchParams();
  const resourceId = searchParams.get("resourceId");
  const { data: initailData, isLoading } = useQuery({
    queryKey: [resourceId],
    queryFn: async () => {
      return getResource(resourceId as string).then((res) => res.data);
    },
    enabled: !!resourceId,
  });
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pb-16">
        <h1 className="font-display mb-4 text-4xl font-bold md:text-5xl">
          Loading...
        </h1>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-12 text-center">
          <h1 className="font-display mb-4 text-4xl font-bold md:text-5xl">
            {resourceId ? "Update" : "Submit"} a Resource
          </h1>
          <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
            Share your favorite free developer resources with the community
          </p>
        </div>
        <SubmitResourceForm initialData={initailData} />
      </motion.div>
    </div>
  );
};
