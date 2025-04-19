"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { ArrowRight, BookMarked, Code, Users, Zap } from "lucide-react";

import { fadeIn, staggerContainer } from "@/lib/animations";

import { Button } from "../ui/button";

export const Categories = () => {
  const router = useRouter();
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
            <Link href="/resources" className="flex items-center gap-2">
              View all resources <ArrowRight size={16} />
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
            {
              icon: <Code />,
              name: "Web Development",
              count: 120,
              tag: "web-development",
            },
            {
              icon: <BookMarked />,
              name: "Data Science",
              count: 85,
              tag: "data-science",
            },
            {
              icon: <Zap />,
              name: "App Development",
              count: 64,
              tag: "app-development",
            },
            { icon: <Users />, name: "UI/UX Design", count: 42, tag: "ui-ux" },
          ].map((category, i) => (
            <motion.div
              key={i}
              className="bg-card rounded-xl border p-5 transition-all hover:-translate-y-1 hover:shadow-md"
              variants={fadeIn}
              onClick={() => router.push(`/resources?category=${category.tag}`)}
            >
              <div className="bg-secondary text-primary dark:bg-secondary dark:text-primary mb-3 flex size-10 items-center justify-center rounded-md">
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
