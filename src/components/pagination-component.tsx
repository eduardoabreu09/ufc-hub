"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { parseWithFallback } from "@/lib/utils";
import Link from "next/link";

export default function PaginationComponent() {
  const searchParams = useSearchParams();
  const defaultPage = Math.max(
    parseWithFallback(searchParams.get("page") ?? "", 1),
    1
  );

  const [currentPage, setCurrentPage] = useState<number>(defaultPage);

  const nextPage = useMemo(() => currentPage + 1, [currentPage]);
  const previousPage = useMemo(
    () => Math.max(currentPage - 1, 1),
    [currentPage]
  );
  const nextHref = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", nextPage.toString());
    return "?" + params.toString();
  }, [nextPage, searchParams]);
  const previousHref = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", previousPage.toString());
    return "?" + params.toString();
  }, [searchParams, previousPage]);

  const handlePageChange = useCallback(
    (type: "increase" | "decrease") => {
      const newPage = type === "increase" ? nextPage : previousPage;
      setCurrentPage(newPage);
    },
    [nextPage, previousPage]
  );

  return (
    <Pagination className="mt-6">
      <PaginationContent className="w-full justify-between gap-3">
        <PaginationItem>
          <Link
            href={`/home/event${previousHref}`}
            className="flex items-center justify-center gap-2 px-2 py-2 rounded-md text-sm font-medium
            border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50
            aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-disabled={currentPage === 1 ? true : undefined}
            role={currentPage === 1 ? "link" : undefined}
            onClick={() => handlePageChange("decrease")}
          >
            <ChevronLeftIcon
              className="-ms-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Anterior
          </Link>
        </PaginationItem>
        <PaginationItem>
          <Link
            href={`/home/event${nextHref}`}
            className="flex items-center justify-center gap-2 px-2 py-2 rounded-md text-sm font-medium
            border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
            onClick={() => handlePageChange("increase")}
          >
            Próximo
            <ChevronRightIcon
              className="-me-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
          </Link>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
