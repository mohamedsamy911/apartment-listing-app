"use client";
import Link from "next/link";
import { FiMapPin, FiPhoneCall } from "react-icons/fi";
import { IoMail } from "react-icons/io5";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Image from "next/image";
import { JSX } from "react";

/**
 * Footer Component
 *
 * A footer component that displays the company's contact information, social media links, and copyright information.
 *
 * @component
 *
 * @example
 * // Usage in parent component:
 * <Footer />
 *
 * @returns {JSX.Element} Footer component with contact information, social media links, and copyright information.
 */
export default function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-br from-gray-900 to-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <Image src="/logo.png" alt="logo" width={50} height={50} />
              <div>
                <span className="text-2xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Nawy
                </span>
                <p className="text-gray-300 text-sm">Find Your Dream Home</p>
              </div>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Discover the perfect apartment that matches your lifestyle. From
              luxury penthouses to cozy studios, we help you find your next
              home.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <a
              href="https://maps.app.goo.gl/8hrcYG9iyCFLakox7"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-gray-300"
            >
              <FiMapPin className="w-4 h-4" />
              <span className="text-sm">
                ABC Bank, South 90th, New Cairo 1, Egypt
              </span>
            </a>
            <a
              className="flex items-center space-x-3 text-gray-300"
              href="tel:+201065888849"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiPhoneCall className="w-4 h-4" />
              <span className="text-sm">+201065888849</span>
            </a>
            <a
              href="mailto:info@nawy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-gray-300"
            >
              <IoMail className="w-4 h-4" />
              <span className="text-sm">info@nawy.com</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © Copyright {currentYear} - Nawy.
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://www.facebook.com/nawyrealestate/"
              target="_blank"
              className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-4 h-4 text-gray-400 group-hover:text-white" />
            </a>
            <a
              href="https://x.com/nawyegypt"
              target="_blank"
              className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
              aria-label="Twitter"
            >
              <FaTwitter className="w-4 h-4 text-gray-400 group-hover:text-white" />
            </a>
            <a
              href="https://www.instagram.com/nawyrealestate/"
              target="_blank"
              className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
              aria-label="Instagram"
            >
              <FaInstagram className="w-4 h-4 text-gray-400 group-hover:text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
