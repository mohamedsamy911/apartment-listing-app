"use client";

import { JSX, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaPlus, FaHome } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import Image from "next/image";
import { DEFAULT_PAGE, DEFAULT_LIMIT } from "@/lib/constants";

/**
 * @interface NavbarProps
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setOpen - Function to set the open state of the AddApartmentModal
 */
interface NavbarProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
/**
 * Navbar Component
 *
 * A navigation bar component that displays a logo, navigation links, and a list property button.
 *
 * @component
 * @param {NavbarProps} props - Component props
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setOpen - Function to set the open state of the AddApartmentModal
 *
 * @example
 * // Usage in parent component:
 * <Navbar setOpen={setOpen} />
 *
 * @returns {JSX.Element} Navbar component with logo, navigation links, and list property button.
 */
export default function Navbar({ setOpen }: NavbarProps): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActivePath = (path: string) => pathname === path;

  const navButtonClass =
    "flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer";

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={`/?page=${DEFAULT_PAGE}&limit=${DEFAULT_LIMIT}`}
            className="flex items-center space-x-2 group"
          >
            <div className="p-2 rounded-xl group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={50}
                height={50}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActivePath("/")
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <FaHome className="w-4 h-4" />
              <span className="font-medium">Browse</span>
            </Link>
            <button onClick={() => setOpen(true)} className={navButtonClass}>
              <FaPlus className="w-4 h-4" />
              <span className="font-medium">List Property</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <IoCloseSharp className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActivePath("/")
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaHome className="w-5 h-5" />
                <span className="font-medium">Browse</span>
              </Link>
              <button
                onClick={() => {
                  setOpen(true);
                  setIsMenuOpen(false);
                }}
                className={navButtonClass}
              >
                <FaPlus className="w-4 h-4" />
                <span className="font-medium">List Property</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
