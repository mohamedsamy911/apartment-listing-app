"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Apartment } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * @interface PaginationInfo
 * @property {number} currentPage - The current page number
 * @property {number} totalPages - The total number of pages
 * @property {number} totalCount - The total number of apartments
 * @property {boolean} hasNextPage - Whether there is a next page
 * @property {boolean} hasPrevPage - Whether there is a previous page
 * @property {number} limit - The limit for the current page
 */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface UseApartmentsReturn {
  apartments: Apartment[];
  initialQuery: string;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  currentPage: number;
  limit: number;
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;
  fetchApartments: (page?: number, searchQuery?: string) => Promise<void>;
  goToPage: (page: number) => void;
  submitSearch: (searchQuery: string) => void;
  clearSearch: () => void;
}
/**
 * useApartments Hook
 *
 * Custom hook for fetching apartments with pagination and search.
 *
 * @hook
 * @param initialLimit - The initial limit for the pagination
 *
 * @returns {UseApartmentsReturn} An object containing the state and helpers for the apartments fetching
 * @returns {Apartment[]} apartments - The list of apartments
 * @returns {string} initialQuery - The initial search query
 * @returns {number} search - The current search query
 * @returns {number} currentPage - The current page number
 * @returns {number} limit - The limit for the current page
 * @returns {PaginationInfo | null} pagination - The pagination information
 * @returns {boolean} isLoading - Whether the apartments are being fetched
 * @returns {string | null} error - The error message if any
 * @returns {function} fetchApartments - A function to fetch apartments
 * @returns {function} goToPage - A function to navigate to a specific page
 * @returns {function} submitSearch - A function to submit a search query
 * @returns {function} clearSearch - A function to clear the search query
 */
export function useApartments(initialLimit = 8): UseApartmentsReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage =
    Number(searchParams.get("page")) >= 1
      ? Number(searchParams.get("page"))
      : 1;
  const initialQuery = searchParams.get("search") ?? "";
  const initialLimitQuery =
    Number(searchParams.get("limit")) >= 1
      ? Number(searchParams.get("limit"))
      : initialLimit;

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [search, setSearch] = useState<string>(initialQuery);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [limit] = useState<number>(initialLimitQuery);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // track latest fetch to avoid race conditions
  const abortRef = useRef<AbortController | null>(null);

  /**
   * Build the URL parameters for the fetch request.
   * @param {number} page - The page number
   * @param {string} searchQuery - The search query
   * @returns {URLSearchParams} The URL parameters
   */
  const buildParams = useCallback(
    (page: number, searchQuery: string) => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (searchQuery) params.set("search", searchQuery);
      return params;
    },
    [limit]
  );

  /**
   * Fetch apartments from the server.
   * @param {number} page - The page number to fetch
   * @param {string} searchQuery - The search query
   */
  const fetchApartments = useCallback(
    async (page = 1, searchQuery = "") => {
      setIsLoading(true);
      setError(null);

      // abort previous
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const params = buildParams(page, searchQuery);
        // Update URL without reload
        router.replace(`?${params.toString()}`);

        const res = await fetch(`/api/apartments?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch");
        }
        const data = await res.json();

        setApartments(data.apartments ?? []);
        setPagination(data.pagination ?? null);
        setCurrentPage(data.pagination?.currentPage ?? page);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // Request was aborted — safe ignore
          console.log("Fetch aborted (new request started)");
          return;
        }
        if (err instanceof Error) {
          console.error("Failed to fetch apartments:", err);
          setError(err.message);
        } else {
          console.error("Unknown error while fetching apartments:", err);
          setError("Failed to fetch");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [buildParams, router]
  );

  // keep URL-derived query as source-of-truth on mount
  useEffect(() => {
    fetchApartments(currentPage, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once to respect server-provided search params

  // helpers
  /**
   * Navigate to a specific page.
   * @param {number} page - The page number to navigate to
   */
  const goToPage = useCallback(
    (page: number) => {
      if (page < 1) return;
      if (pagination && page > pagination.totalPages) return;
      setCurrentPage(page);
      // trigger fetch
      fetchApartments(page, search);
    },
    [fetchApartments, pagination, search]
  );

  /**
   * Submit a search query and reset to the first page.
   * @param {string} q - The search query
   */
  const submitSearch = useCallback(
    (q: string) => {
      setSearch(q);
      // reset to first page on new search
      fetchApartments(1, q);
    },
    [fetchApartments]
  );

  /**
   * Clear the search query and reset to the first page.
   */
  const clearSearch = useCallback(() => {
    setSearch("");
    fetchApartments(1, "");
  }, [fetchApartments]);

  return {
    apartments,
    initialQuery,
    search,
    setSearch,
    currentPage,
    limit,
    pagination,
    isLoading,
    error,
    fetchApartments,
    goToPage,
    submitSearch,
    clearSearch,
  };
}
export default useApartments;
