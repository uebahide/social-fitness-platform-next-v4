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

export function PaginationSimple({
  page,
  className,
}: {
  page: number;
  className?: string;
}) {
  const { user } = useUser();
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    const fetchTotalPages = async () => {
      const response = await fetch(
        `/api/activity/total-pages?userId=${user?.id}`,
      );
      const count = await response.json();
      setTotalPages(Math.ceil(count / PER_PAGE));
    };
    fetchTotalPages();
  }, [user?.id]);

  return (
    <Pagination className={className}>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious href={`/activity?page=${page - 1}`} />
          </PaginationItem>
        )}
        {page > 3 && (
          <PaginationItem>
            <PaginationLink href={"/activity?page=1"}>1</PaginationLink>
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
                href={`/activity?page=${index + 1}`}
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
            <PaginationLink href={`/activity?page=${totalPages}`}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        {page < totalPages && (
          <PaginationItem>
            <PaginationNext href={`/activity?page=${page + 1}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
