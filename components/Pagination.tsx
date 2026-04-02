"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PER_PAGE } from "@/constants";
import { useUser } from "@/contexts/UserProvider";
import { useEffect, useState } from "react";
import { CategoryType } from "@/types/api/category";

export function PaginationSimple({
  page,
  categoryFilter,
  className,
}: {
  page: number;
  categoryFilter: CategoryType | null;
  className?: string;
}) {
  const { user } = useUser();
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    const fetchTotalPages = async () => {
      if (!user?.id) return;

      const params = new URLSearchParams({ userId: String(user.id) });
      if (categoryFilter) {
        params.set("categoryFilter", categoryFilter);
      }

      const response = await fetch(
        `/api/activity/total-pages?${params.toString()}`,
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Failed to fetch total pages: ${response.status} ${text}`,
        );
      }
      const count = await response.json();
      setTotalPages(Math.ceil(count / PER_PAGE));
    };
    fetchTotalPages();
  }, [user?.id, categoryFilter]);

  return (
    <Pagination className={className}>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={
                categoryFilter
                  ? `/activity?page=${page - 1}&category=${categoryFilter}`
                  : `/activity?page=${page - 1}`
              }
            />
          </PaginationItem>
        )}
        {page > 3 && (
          <PaginationItem>
            <PaginationLink
              href={
                categoryFilter
                  ? `/activity?page=1&category=${categoryFilter}`
                  : `/activity?page=1`
              }
            >
              1
            </PaginationLink>
          </PaginationItem>
        )}
        {page > 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {Array.from({ length: totalPages }).map((_, index) =>
          -3 < page - (index + 1) && page - (index + 1) < 3 ? (
            <PaginationItem key={index}>
              <PaginationLink
                href={
                  categoryFilter
                    ? `/activity?page=${index + 1}&category=${categoryFilter}`
                    : `/activity?page=${index + 1}`
                }
                isActive={page === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ) : null,
        )}
        {page + 3 < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {page + 2 < totalPages && (
          <PaginationItem>
            <PaginationLink
              href={
                categoryFilter
                  ? `/activity?page=${totalPages}&category=${categoryFilter}`
                  : `/activity?page=${totalPages}`
              }
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        {page < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={
                categoryFilter
                  ? `/activity?page=${page + 1}&category=${categoryFilter}`
                  : `/activity?page=${page + 1}`
              }
              data-testid="my-activity-pagination-next"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
