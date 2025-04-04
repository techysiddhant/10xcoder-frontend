"use client";

import { motion } from "framer-motion";

import { SubmitResourceForm } from "./submit-resource-form";

export const SubmitMain = () => {
  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-12 text-center">
          <h1 className="font-display mb-4 text-4xl font-bold md:text-5xl">
            Submit a Resource
          </h1>
          <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
            Share your favorite free developer resources with the community
          </p>
        </div>

        <SubmitResourceForm />
      </motion.div>
    </div>
  );
};
