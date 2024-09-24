import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link"


interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function PaginationBar({ currentPage, totalPages, basePath }: PaginationBarProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href={`${basePath}?page=${Math.max(1, currentPage - 1)}`}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? 'pointer-events-none cursor-not-allowed opacity-50' : ''} 
            tabIndex={currentPage === 1 ? -1 : undefined}
          />
        </PaginationItem>
        {pageNumbers.map((pageNumber, index) => (
          <React.Fragment key={index}>
            {pageNumber === '...' ? (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem>
                <PaginationLink 
                  href={`${basePath}?page=${pageNumber}`}
                  isActive={currentPage === pageNumber}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            )}
          </React.Fragment>
        ))}
        <PaginationItem>
          <PaginationNext
            href={`${basePath}?page=${Math.min(totalPages, currentPage + 1)}`}
            aria-disabled={totalPages === 0 || currentPage === totalPages}
            className={totalPages === 0 || currentPage === totalPages ? 'pointer-events-none cursor-not-allowed opacity-50' : ''} 
            tabIndex={totalPages === 0 || currentPage === totalPages ? -1 : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const pageNumbers: (number | string)[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  pageNumbers.push(1);

  if (currentPage > 3) {
    pageNumbers.push('...');
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  if (currentPage < totalPages - 2) {
    pageNumbers.push('...');
  }

  pageNumbers.push(totalPages);

  return pageNumbers;
}
