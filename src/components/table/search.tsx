"use client";

import { useCallback, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  // Get the current search term from URL
  const currentSearch = searchParams.get("search") || "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  // Debounced search function
  const handleSearch = useCallback(
    async (searchTerm: string) => {
      try {
        setIsLoading(true);

        router.push(`${pathname}?${createQueryString("search", searchTerm)}`);

        // Only fetch if search term is not empty
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },

    [router, pathname, createQueryString]
  );

  // Initial load from URL search param
  useEffect(() => {
    if (currentSearch) {
      handleSearch(currentSearch);
    }
    // eslint-disable-next-line
  }, [currentSearch]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-2xl">
        <input
          type="text"
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search..."
          className={cn(
            "w-72 p-1.5 text-gray-100 bg-gray-900 border border-blue-700 rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            isLoading && " text-black bg-red-900"
          )}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
