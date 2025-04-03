"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SearchBarProps {
  onSearch?: (e: React.FormEvent) => void;
  placeholder?: string;
  className?: string;
  searchTerm?: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}
export const ResourceSearchBar = ({
  onSearch,
  placeholder = "Search for resources...",
  className = "",
  searchTerm,
  setSearchTerm,
}: SearchBarProps) => {
  return (
    <motion.form
      onSubmit={onSearch}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="relative">
        <Search
          size={18}
          className="absolute top-1/2 left-3 -translate-y-1/2 transform text-slate-400"
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border-slate-200 bg-white py-6 pl-10 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
        />
        <Button
          type="submit"
          className="absolute top-1/2 right-2 -translate-y-1/2 transform bg-blue-600 text-white hover:bg-blue-700"
        >
          Search
        </Button>
      </div>
    </motion.form>
  );
};
