"use client";

import { ArrowRightIcon, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SearchFilterProps = {
  label: string;
};

export default function SearchFilter({ label }: SearchFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const defaultQuery = searchParams.get("query") ?? "";

  const [query, setQuery] = useState(defaultQuery);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const params = new URLSearchParams(searchParams.toString());
      params.set("query", query);
      params.set("page", "1"); // Reset to first page on new search

      router.push(pathname + "?" + params.toString());
    },
    [query, searchParams, pathname, router]
  );

  return (
    <div className="flex justify-between items-center mb-6">
      <form onSubmit={handleSubmit} className="*:not-first:mt-2">
        <Label htmlFor="query">{label}</Label>
        <div className="relative">
          <Input
            id="query"
            className="peer ps-9 pe-9"
            placeholder="Buscar..."
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <SearchIcon size={16} />
          </div>
          <button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Submit query"
            type="submit"
          >
            <ArrowRightIcon size={16} aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}
