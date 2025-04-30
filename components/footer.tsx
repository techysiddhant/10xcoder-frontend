"use client";

import Link from "next/link";

import ScrollToTop from "react-scroll-to-top";

import { Button } from "./ui/button";

export const Footer = () => {
  return (
    <footer className="mb-4 pt-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-sm">
          10xCoder.club &copy; 2025 Made with ❤️ by{" "}
          <Link className="underline" href="https://github.com/techysiddhant">
            techysiddhant
          </Link>
        </p>
        <div className="text-muted-foreground space-x-4 text-sm">
          <Link href="/resources" className="">
            Resources
          </Link>
          <Link href="/submit" className="">
            Create
          </Link>
          <Link href="/about" className="">
            About
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild size={"sm"}>
            <ScrollToTop smooth color="#f59e0b" />
          </Button>
        </div>
      </div>
    </footer>
  );
};
