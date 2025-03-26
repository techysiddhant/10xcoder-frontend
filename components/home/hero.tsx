"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export const Hero = () => {
  return (
    <section className="pb-16 md:pb-36">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center space-y-8 text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.span
            className="text-primary rounded-full bg-blue-300/50 px-3 py-1 text-sm font-medium dark:bg-blue-900/20 dark:text-blue-400"
            variants={fadeInUp}
          >
            Developer Resources
          </motion.span>

          <motion.h1
            className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl"
            variants={fadeInUp}
          >
            Discover the best{" "}
            <span className="text-blue-600 dark:text-blue-400">
              free resources
            </span>{" "}
            for developers
          </motion.h1>

          <motion.p
            className="text-muted-foreground max-w-2xl text-lg md:text-xl"
            variants={fadeInUp}
          >
            A curated collection of high-quality tutorials, courses, and tools
            to help you level up your coding skills.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-4 sm:flex-row"
            variants={fadeInUp}
          >
            <Button asChild size="lg" className="text-white">
              <Link href="/resources">Explore Resources</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
