"use client";
import { Apartment } from "@prisma/client";
import { useParams } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FiMapPin, FiPhoneCall } from "react-icons/fi";
import { IoIosHome } from "react-icons/io";
import { FaBuilding, FaHashtag, FaWhatsapp } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import Loading from "@/components/Loading";

/**
 * ApartmentDetails Component
 *
 * A page component that displays detailed information about a specific apartment.
 * It fetches apartment data from the server based on the provided ID parameter.
 *
 * @component
 * @param props - The props object containing the apartment ID parameter
 * @param props.params - The parameter object containing the apartment ID
 * @param props.params.id - The ID of the apartment to display details for
 * @returns {JSX.Element} The apartment details page component
 */
export default function ApartmentDetails(): JSX.Element {
  const params = useParams();
  const id = params?.id;
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      fetch(`/api/apartments/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch apartment");
          return res.json();
        })
        .then((data) => {
          setApartment(data);
          document.title = `${data.name} - Apartment Details`;
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return <Loading message="Loading apartment details..." />;
  }

  if (!apartment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoCloseOutline className="text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Apartment Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            The apartment you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MdKeyboardArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = apartment.imageUrls?.[selectedImageIndex] || null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Back Button */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <MdKeyboardArrowLeft className="w-5 h-5 mr-2" />
            Back to Listings
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              {mainImage ? (
                <Image
                  width={400}
                  height={400}
                  src={mainImage}
                  alt={apartment.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                  <div className="text-center text-gray-400">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                      <IoIosHome className="text-4xl" />
                    </div>
                    <p>No Image Available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {apartment.imageUrls && apartment.imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {apartment.imageUrls.map((url: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      width={400}
                      height={400}
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:pl-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {apartment.name}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <FiMapPin className="w-5 h-5 mr-1" />
                <span>{apartment.project}</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-4xl font-bold text-blue-600">
                  EGP {apartment.price?.toLocaleString()}
                </div>
                <p className="text-gray-500 text-sm">Total Price</p>
              </div>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-1">
                  <FaBuilding className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Project</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {apartment.project}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-1">
                  <FaHashtag className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Unit Number</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {apartment.unitNumber}
                </p>
              </div>
            </div>

            {/* Description */}
            {apartment.description && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {apartment.description}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 bg-[#25D366] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#1da851] transition-colors shadow-sm cursor-pointer">
                <a
                  href={`https://wa.me/${apartment.contactNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-row items-center justify-center transition-colors duration-200"
                  title="WhatsApp"
                >
                  <FaWhatsapp className="w-5 h-5 mr-2" />
                  <span>WhatsApp</span>
                </a>
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer">
                <a
                  href={`tel:${apartment.contactNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-row items-center justify-center transition-colors duration-200"
                  title="Call"
                >
                  <FiPhoneCall className="w-5 h-5 mr-2" />
                  <span>Call</span>
                </a>
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                Interested in this property?
              </h4>
              <p className="text-blue-800 text-sm">
                Contact us today to schedule a viewing or get more information
                about this apartment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
