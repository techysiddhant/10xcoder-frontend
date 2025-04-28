"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  limit: number;
  totalCount: number;
}
export const SubmissionPagination = ({
  page,
  limit,
  totalCount,
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalCount / limit);
  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }
    router.push(`?${params.toString()}`);
  };
  const getVisiblePages = () => {
    const group = Math.floor((page - 1) / 10); // Group of 10 pages
    const start = group * 10 + 1;
    const end = Math.min(start + 9, totalPages);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  return (
    <div className="mt-4 flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => updatePage(page - 1)}
        disabled={page === 1}
      >
        Prev
      </Button>

      {getVisiblePages().map((p) => (
        <Button
          key={p}
          disabled={p === page}
          variant={p === page ? "default" : "outline"}
          size="sm"
          onClick={() => updatePage(p)}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => updatePage(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </Button>
    </div>
  );
};
