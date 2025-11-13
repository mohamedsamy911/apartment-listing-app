"use client";
import React, { JSX, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoMdSearch, IoIosHome } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import AddApartmentButton from "./AddApartmentButton";
import AddApartmentModal from "./AddApartmentModal";
import useApartments from "../hooks/useApartments";
import Pagination from "./Pagination";

/**
 * ApartmentListClient Component
 *
 * Client-side component for displaying apartment listings
 *
 * This component fetches apartment data from the server, displays it in a paginated list, and provides search and pagination functionality.
 *
 * @component
 *
 * @example
 * // Usage in parent component:
 * <ApartmentListClient />
 *
 * @returns {JSX.Element} Apartment listing component
 */
export default function ApartmentListClient(): JSX.Element {
  // Hook for fetching apartments
  const {
    apartments,
    initialQuery,
    search,
    setSearch,
    currentPage,
    pagination,
    isLoading,
    error,
    goToPage,
    submitSearch,
    clearSearch,
  } = useApartments(8);

  // State for modal open/close
  const [open, setOpen] = useState<boolean>(false);

  /**
   * Handle form submission for apartment search
   * 
   * @param e - Form event object
   */
  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    submitSearch(search);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-end sm:items-center gap-4 mb-8">
          <div className="w-full sm:w-96">
            <form
              onSubmit={handleSubmit}
              className="relative"
              role="search"
              aria-label="Search apartments"
            >
              <div className="flex items-center w-full bg-white border border-gray-200 rounded-full shadow-md focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
                <IoMdSearch
                  className="absolute left-4 text-gray-400 h-5 w-5 pointer-events-none"
                  aria-hidden
                />
                <input
                  id="search-apartments"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-none rounded-full focus:outline-none placeholder-gray-500 text-gray-900"
                  placeholder="Search by name, unit, or project..."
                  aria-label="Search apartments by name, unit or project"
                />
                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="shrink-0 text-gray-500 hover:text-gray-700 p-2 mr-1 transition-colors duration-200 rounded-full"
                    title="Clear search"
                  >
                    <IoCloseSharp className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="cursor-pointer shrink-0 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors duration-200 m-1"
                  aria-label="Search"
                >
                  <IoMdSearch className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* count / status */}
        <div className="mb-6">
          {isLoading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : (
            <p className="text-gray-600">
              {pagination?.totalCount ?? 0}{" "}
              {(pagination?.totalCount ?? 0) === 1 ? "apartment" : "apartments"}{" "}
              found
              {pagination && pagination.totalPages > 1 && (
                <span className="text-gray-500 ml-2">
                  (Page {currentPage} of {pagination.totalPages})
                </span>
              )}
            </p>
          )}
        </div>

        {/* grid / empty / skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : apartments.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {apartments.map((apt) => (
                <Link
                  key={apt.id}
                  href={`/apartments/${apt.id}`}
                  className="group"
                >
                  <div className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                      {apt.imageUrls?.length ? (
                        <Image
                          width={400}
                          height={400}
                          src={apt.imageUrls[0]}
                          alt={apt.name ?? "Apartment image"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                          <div className="text-gray-400 text-center">
                            <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                              <IoIosHome className="text-2xl" />
                            </div>
                            <p className="text-sm">No Image</p>
                          </div>
                        </div>
                      )}

                      <div className="absolute top-3 right-3">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                          EGP {apt.price?.toLocaleString()}
                        </span>
                      </div>
                      {apt.imageUrls && apt.imageUrls.length > 1 && (
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                            +{apt.imageUrls.length - 1} more
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {apt.name}
                        </h3>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {apt.project}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          Unit {apt.unitNumber}
                        </span>
                        <span className="text-xs text-gray-400">
                          Click to view details
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                hasPrevPage={pagination.hasPrevPage}
                hasNextPage={pagination.hasNextPage}
                onPageChange={goToPage}
              />
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <IoIosHome className="text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No apartments found
            </h3>
            <p className="text-gray-600 mb-6">
              {search
                ? `No results for "${initialQuery}". Try adjusting your search terms.`
                : "No apartments available at the moment."}
            </p>
            {search && (
              <button
                onClick={clearSearch}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        <AddApartmentButton setOpen={setOpen} />
        <AddApartmentModal open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}
