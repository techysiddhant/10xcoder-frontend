"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { MenuIcon, X } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@/hooks/use-session";

import Logo from "./logo";
import { ProfileMenu } from "./profile-menu";
import { ThemeToggler } from "./theme-toggler";
import { Button } from "./ui/button";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Resources", path: "/resources" },
  { name: "Create", path: "/submit" },
  { name: "About", path: "/about" },
];
export const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navbarVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };
  return (
    <motion.nav
      className={`fixed top-0 right-0 left-0 z-50 ${
        isScrolled
          ? "border-secondary border-b shadow-sm backdrop-blur-md"
          : "bg-transparent"
      } inset-x-0 transition-all duration-300`}
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
              <span className="font-display text-xl font-bold text-slate-900 dark:text-white">
                no-name
              </span>
            </Link>
          </div>
          {!isMobile ? (
            <motion.div
              className="hidden md:items-center md:space-x-4 lg:flex"
              variants={listVariants}
            >
              <motion.div className="flex items-center space-x-1">
                {navLinks.map((link) => (
                  <motion.div key={link.path} variants={itemVariants}>
                    <Link
                      href={link.path}
                      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        pathname === link.path
                          ? "text-primary"
                          : "hover:text-primary dark:hover:text-yellow-400"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
              <div className="flex items-center space-x-2">
                <ThemeToggler />
              </div>
              {!user ? (
                <div className="flex items-center space-x-4">
                  <Button asChild variant={"outline"}>
                    <Link href="/signin">Sign in</Link>
                  </Button>
                  <Button asChild className="text-secondary">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              ) : (
                <ProfileMenu />
              )}
            </motion.div>
          ) : (
            <div className="flex items-center space-x-2 lg:hidden">
              <ThemeToggler />
              {!user ? (
                <Button asChild size={"sm"} className="text-secondary">
                  <Link href="/signup">Get Started</Link>
                </Button>
              ) : (
                <ProfileMenu />
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* mobile menu */}
      {isMobile && (
        <motion.div
          className={"overflow-hidden lg:hidden"}
          initial="hidden"
          animate={mobileMenuOpen ? "visible" : "hidden"}
          variants={mobileMenuVariants}
        >
          <div className="bg-card dark:bg-card space-y-1 px-2 pt-2 pb-3 shadow-lg backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-md px-3 py-3 text-base font-medium ${
                  pathname === link.path
                    ? "text-primary dark:text-primary bg-amber-100/50 dark:bg-amber-900/20"
                    : "text-primary-foreground dark:text-secondary-foreground dark:hover:text-yellow-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
