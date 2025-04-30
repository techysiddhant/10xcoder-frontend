"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export const Hero = () => {
  return (
    <section className="relative isolate pb-16 md:pb-36">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center space-y-8 text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.span
            className="text-primary dark:bg-primary dark:text-primary-foreground rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium"
            variants={fadeInUp}
          >
            Developer Resources
          </motion.span>

          <motion.h1
            className="dark:text-secondary-foreground max-w-3xl text-4xl font-bold tracking-tight text-gray-900 md:text-6xl"
            variants={fadeInUp}
          >
            Discover the top{" "}
            <span className="text-primary dark:text-primary">
              free resources
            </span>{" "}
            for developers
          </motion.h1>

          <motion.p
            className="max-w-2xl text-lg font-light text-pretty md:text-xl"
            variants={fadeInUp}
          >
            A curated collection of high-quality tutorials, courses, and tools
            to help you level up your coding skills.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-4 sm:flex-row"
            variants={fadeInUp}
          >
            <Button asChild size="lg" className="text-secondary">
              <Link href="/resources">Explore Resources</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/submit">Add a Resource</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
