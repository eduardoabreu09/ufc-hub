"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { parseWithFallback } from "@/lib/utils";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";

export default function PaginationComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const defaultPage = Math.max(
    parseWithFallback(searchParams.get("page") ?? "", 1),
    1
  );

  useEffect(() => {
    let cancelled = false;
    const poll = () => {
      const nextPage = defaultPage + 1;
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", nextPage.toString());
      if (!cancelled) {
        router.prefetch(pathname + "?" + params.toString(), {
          onInvalidate: poll,
          kind: PrefetchKind.AUTO,
        });
      }
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [router, defaultPage, pathname, searchParams]);

  const [currentPage, setCurrentPage] = useState<number>(defaultPage);

  const handlePageChange = useCallback(
    (type: "increase" | "decrease") => {
      const newPage = currentPage + (type === "increase" ? 1 : -1);
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());

      router.push(pathname + "?" + params.toString());
      setCurrentPage(newPage);
    },
    [searchParams, pathname, router, currentPage]
  );

  return (
    <Pagination className="mt-6">
      <PaginationContent className="w-full justify-between gap-3">
        <PaginationItem>
          <Button
            variant="outline"
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-disabled={currentPage === 1 ? true : undefined}
            role={currentPage === 1 ? "link" : undefined}
            asChild
            onClick={() => handlePageChange("decrease")}
          >
            <span>
              <ChevronLeftIcon
                className="-ms-1 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Anterior
            </span>
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            variant="outline"
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            asChild
            onClick={() => handlePageChange("increase")}
          >
            <span>
              Próximo
              <ChevronRightIcon
                className="-me-1 opacity-60"
                size={16}
                aria-hidden="true"
              />
            </span>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
