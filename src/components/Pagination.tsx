"use client";
import React, { JSX } from "react";
import { TfiControlBackward, TfiControlForward } from "react-icons/tfi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

/**
 * @interface PaginationProps
 * @property {number} currentPage - The current page number
 * @property {number} totalPages - The total number of pages
 * @property {boolean} hasNextPage - Whether there is a next page
 * @property {boolean} hasPrevPage - Whether there is a previous page
 * @property {(page: number) => void} onPageChange - Function to handle page change
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

/**
 * Pagination Component
 *
 * A pagination component that displays a list of page numbers and navigation buttons.
 * Implements smart page number calculation to show relevant pages based on current position.
 *
 * @component
 * @param {PaginationProps} props - Component props
 * @param {number} props.currentPage - The current page number
 * @param {number} props.totalPages - The total number of pages
 * @param {boolean} props.hasNextPage - Whether there is a next page
 * @param {boolean} props.hasPrevPage - Whether there is a previous page
 * @param {(page: number) => void} props.onPageChange - Function to handle page change
 *
 * @example
 * // Usage in parent component:
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   hasNextPage={hasNextPage}
 *   hasPrevPage={hasPrevPage}
 *   onPageChange={onPageChange}
 * />
 *
 * @returns {JSX.Element} Pagination component with page numbers and navigation buttons.
 */
export default function Pagination({
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
  onPageChange,
}: PaginationProps): JSX.Element {
  // Determine how many page numbers to show (max 3, or fewer if total pages is less)
  const maxVisiblePages = 3;
  const visiblePageCount = Math.min(maxVisiblePages, totalPages);

  /**
   * Generate an array of page numbers to display in the pagination
   * Uses a logic to show relevant pages based on current position
   */
  const visiblePages = Array.from({ length: visiblePageCount }, (_, index) => {
    let pageNumber: number;

    // Case 1: Few total pages - show all pages sequentially
    if (totalPages <= maxVisiblePages) {
      pageNumber = index + 1;
    }
    // Case 2: Near the beginning - show first 3 pages
    else if (currentPage <= 2) {
      pageNumber = index + 1;
    }
    // Case 3: Near the end - show last 3 pages
    else if (currentPage >= totalPages - 2) {
      pageNumber = totalPages - maxVisiblePages + index + 1;
    }
    // Case 4: In the middle - show 1 page before and after current page
    else {
      pageNumber = currentPage - 2 + index;
    }

    return pageNumber;
  })
    // Ensure all page numbers are within valid range (1 to totalPages)
    .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages);

  return (
    <div
      className="flex items-center justify-center space-x-4 mt-12"
      role="navigation"
      aria-label="Pagination"
    >
      {/* First Page Button */}
      <button
        aria-label="First page"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          currentPage !== 1 && "cursor-pointer"
        }`}
      >
        <TfiControlBackward className="w-3 h-5 mr-1" />
      </button>
      {/* Previous Page Button */}
      <button
        aria-label="Previous page"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          hasPrevPage && "cursor-pointer"
        }`}
      >
        <IoIosArrowBack className="w-3 h-5 mr-1" />
      </button>

      {/* Page Number Buttons */}
      <div className="flex items-center space-x-2">
        {visiblePages.map((pageNumber) => (
          <button
            aria-current={currentPage === pageNumber ? "page" : undefined}
            aria-label={`Go to page ${pageNumber}`}
            key={pageNumber}
            onClick={() =>
              currentPage !== pageNumber && onPageChange(pageNumber)
            }
            className={`
              w-9 h-10 rounded-lg transition-colors
              ${
                currentPage === pageNumber
                  ? "bg-blue-600 text-white" // Active page styling
                  : "border border-gray-300 hover:bg-gray-50 cursor-pointer" // Inactive page styling
              }
            `}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {/* Next Page Button */}
      <button
        aria-label="Next page"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          hasNextPage && "cursor-pointer"
        }`}
      >
        <IoIosArrowForward className="w-3 h-5 mr-1" />
      </button>
      {/* Last Page Button */}
      <button
        aria-label="Last page"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`"flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          currentPage !== totalPages && "cursor-pointer"
        }`}
      >
        <TfiControlForward className="w-3 h-5 mr-1" />
      </button>
    </div>
  );
}
