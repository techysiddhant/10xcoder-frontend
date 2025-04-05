"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Github,
  Heart,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const AboutMain = () => {
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
            About no-name
          </h1>
          <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
            Curating the best free resources for developers to learn, grow, and
            build amazing projects.
          </p>
        </div>

        <div className="glass-card mb-12 p-8">
          <h2 className="mb-6 text-2xl font-bold">Our Mission</h2>
          <p className="mb-6 text-lg">
            no-name was created with a simple mission: to help developers at all
            levels find the highest quality free resources across the web. We
            believe that knowledge should be accessible to everyone, regardless
            of their financial situation.
          </p>
          <p className="mb-6 text-lg">
            The internet is filled with incredible learning materials, but
            finding the gems among the noise can be challenging. That&lsquo;s
            why we built no-name as a community-driven platform where developers
            can discover, share, and upvote the best resources they&lsquo;ve
            found helpful in their journey.
          </p>
          <p className="text-lg">
            Whether you&lsquo;re just starting out or you&lsquo;re a seasoned
            professional looking to learn something new, no-name aims to be your
            go-to hub for finding the best free learning materials in the
            programming world.
          </p>
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="glass-card p-6">
            <div className="mb-4 flex items-center">
              <div className="mr-4 rounded-lg bg-blue-500/10 p-3">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold">Community-Driven</h3>
            </div>
            <p className="text-muted-foreground">
              Our platform thrives on community contributions. Every resource is
              submitted, upvoted, and vetted by real developers like you.
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="mb-4 flex items-center">
              <div className="mr-4 rounded-lg bg-blue-500/10 p-3">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold">Quality Focus</h3>
            </div>
            <p className="text-muted-foreground">
              We emphasize quality over quantity. Each resource is categorized
              and tagged to help you find exactly what you need.
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="mb-4 flex items-center">
              <div className="mr-4 rounded-lg bg-blue-500/10 p-3">
                <Heart className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold">100% Free</h3>
            </div>
            <p className="text-muted-foreground">
              no-name is committed to featuring only completely free resources.
              No paywalls, no surprises.
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="mb-4 flex items-center">
              <div className="mr-4 rounded-lg bg-blue-500/10 p-3">
                <Sparkles className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold">Always Evolving</h3>
            </div>
            <p className="text-muted-foreground">
              Technology moves fast, and so do we. Our collection of resources
              is constantly updated to stay current with the latest trends.
            </p>
          </div>
        </div>

        <div className="glass-card mb-12 p-8 text-center">
          <h2 className="mb-6 text-2xl font-bold">Join Our Community</h2>
          <p className="mb-8 text-lg">
            no-name is an open-source project, and we welcome contributions from
            developers of all skill levels. Whether you want to submit
            resources, improve the platform, or just say hello, we&lsquo;d love
            to hear from you!
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Github className="h-5 w-5" />
              <span>GitHub Repository</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              size="lg"
            >
              <span>Get Involved</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground">
            Built with 💙 by developers, for developers — no-name ©{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
