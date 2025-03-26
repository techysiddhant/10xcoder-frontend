"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight, BookMarked, Code, Users, Zap } from "lucide-react";

import { fadeIn, staggerContainer } from "@/lib/animations";

import { Button } from "../ui/button";

export const Categories = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-3xl font-bold">Popular Categories</h2>
            <p className="text-muted-foreground mt-2">
              Browse resources by your area of interest
            </p>
          </div>
          <Button asChild variant="ghost" className="mt-4 md:mt-0">
            <Link href="/categories" className="flex items-center gap-2">
              View all categories <ArrowRight size={16} />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-6 md:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { icon: <Code />, name: "Web Development", count: 120 },
            { icon: <BookMarked />, name: "Data Science", count: 85 },
            { icon: <Zap />, name: "Mobile Apps", count: 64 },
            { icon: <Users />, name: "UI/UX Design", count: 42 },
          ].map((category, i) => (
            <motion.div
              key={i}
              className="glass-card p-5 transition-all hover:-translate-y-1 hover:shadow-md"
              variants={fadeIn}
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                {category.icon}
              </div>
              <h3 className="font-semibold">{category.name}</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {category.count} resources
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
