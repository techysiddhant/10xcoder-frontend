"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, Zap } from "lucide-react";

import { fadeIn, staggerContainer } from "@/lib/animations";

export const Features = () => {
  return (
    <section className="bg-slate-50 py-16 dark:bg-slate-900/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold">Why Noname?</h2>
          <p className="text-muted-foreground mt-4">
            Everything you need to accelerate your learning and stay up-to-date
            with the latest technologies.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              icon: (
                <BookOpen className="size-10 text-blue-600 dark:text-blue-400" />
              ),
              title: "Curated Content",
              description:
                "Hand-picked resources that are free, high-quality, and relevant to modern development.",
            },
            {
              icon: (
                <Zap className="size-10 text-blue-600 dark:text-blue-400" />
              ),
              title: "Always Updated",
              description:
                "Fresh content added regularly to keep up with the fast-evolving tech landscape.",
            },
            {
              icon: (
                <Users className="size-10 text-blue-600 dark:text-blue-400" />
              ),
              title: "Community Driven",
              description:
                "Resources recommended by developers for developers, ensuring practical value.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="glass-card p-6 text-center"
              variants={fadeIn}
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
