"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import { Button } from "../ui/button";

export const Cta = () => {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-3xl font-bold">
            Ready to level up your skills?
          </h2>
          <p className="mb-8 text-purple-100">
            Join thousands of developers who are improving their skills with our
            curated resources.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-700 hover:bg-blue-50"
          >
            <Link href="/resources">Explore Resources</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
