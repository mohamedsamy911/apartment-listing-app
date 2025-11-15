"use client";

import { JSX, useState } from "react";
import {
  FaPlus,
  FaHome,
  FaHashtag,
  FaBuilding,
  FaCamera,
} from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";
import { FiDollarSign, FiFileText } from "react-icons/fi";
import { FaPhone } from "react-icons/fa6";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  ApartmentSchema,
  ApartmentFormInput,
} from "@/lib/validations/Apartment";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

/**
 * Props interface for the AddApartmentButton component
 * @interface AddApartmentModalProps
 * @property {boolean} open - Modal open state
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setOpen - Function to control the modal open state
 */
interface ApartmentModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * AddApartmentModal Component
 * 
 * Modal for creating new apartments
 *
 * This component renders a modal form for creating new apartments.
 * It features a form with input fields for name, unit number, project, description, price, and contact number.
 * It also includes a file upload section for images.
 *
 * The component uses React Hook Form for form handling and validation. It also uses the zod library for schema validation.
 *
 * @component
 * @param {ApartmentModalProps} props - Component props
 * @param {boolean} props.open - Modal open state
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setOpen - Function to control the modal open state
 *
 * @example
 * // Usage in parent component:
 * const [isModalOpen, setModalOpen] = useState(false);
 *
 * return (
 *   <AddApartmentModal open={isModalOpen} setOpen={setModalOpen} />
 * );
 * 
 * @returns {JSX.Element} Modal component
 */
export default function AddApartmentModal({
  open,
  setOpen,
}: ApartmentModalProps): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ApartmentFormInput>({
    resolver: zodResolver(ApartmentSchema),
    defaultValues: {
      name: "",
      unitNumber: "",
      project: "",
      description: "",
      price: "",
      contactNumber: "",
      imageUrls: [],
    },
  });
  // Watch for imageUrls
  // eslint-disable-next-line react-hooks/incompatible-library
  const images = watch("imageUrls");

  /**
   * Handle file upload for apartment images
   * @param e - Change event from file input
   * @returns Promise<void>
   */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentImages = images || [];
    if (currentImages.length + files.length > 8) {
      toast.error("You can upload a maximum of 8 images per apartment.");
      return;
    }

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.imageUrl) uploaded.push(data.imageUrl);
    }

    setValue("imageUrls", [...currentImages, ...uploaded]);
    setUploading(false);
  };

  /**
   * Remove an image from the list of uploaded images
   * @param index - Index of the image to remove
   */
  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setValue("imageUrls", updated);
  };

  /**
   * Submit the form data to the server
   * @param data - Form data
   * @returns Promise<void>
   */
  const onSubmit = async (data: ApartmentFormInput) => {
    const res = await fetch("/api/apartments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        unitNumber: data.unitNumber,
        project: data.project,
        description: data.description,
        price: data.price,
        imageUrls: data.imageUrls,
        contactNumber: data.contactNumber,
      }),
    });

    if (res.ok) {
      toast.success("Apartment added successfully!");
      setOpen(false);
      reset();
      const timeout = setTimeout(() => {
        if (pathname === "/") {
          window.location.reload();
        } else {
          router.push("/");
        }
      }, 3000);
      return () => clearTimeout(timeout);
    } else {
      toast.error("Failed to add apartment");
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gray-400/90 p-6 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FaHome className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Add New Apartment</h2>
                  <p className="text-blue-100 text-sm">List your property</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)}>
                <IoCloseSharp className="w-5 h-5 hover:text-gray-500 cursor-pointer" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FaHome className="w-4 h-4 mr-2 text-gray-500" />
                    Apartment Name
                  </label>
                  <input
                    {...register("name")}
                    placeholder="e.g., Luxury Downtown Suite"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Unit Number */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <FaHashtag className="w-4 h-4 mr-2 text-gray-500" />
                      Unit Number
                    </label>
                    <input
                      {...register("unitNumber")}
                      placeholder="e.g., 301"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.unitNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.unitNumber.message}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <FiDollarSign className="w-4 h-4 mr-2 text-gray-500" />
                      Price
                    </label>
                    <input
                      {...register("price")}
                      type="number"
                      placeholder="e.g., 250000"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Project */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FaBuilding className="w-4 h-4 mr-2 text-gray-500" />
                    Project
                  </label>
                  <input
                    {...register("project")}
                    placeholder="e.g., Skyline Towers"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.project && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.project.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FiFileText className="w-4 h-4 mr-2 text-gray-500" />
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    placeholder="Describe apartment features..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Contact */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="w-4 h-4 mr-2 text-gray-500" />
                    Phone Number
                  </label>
                  <input
                    {...register("contactNumber")}
                    placeholder="e.g., +201101029668"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.contactNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactNumber.message}
                    </p>
                  )}
                </div>

                {/* Images */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FaCamera className="w-4 h-4 mr-2 text-gray-500" />
                    Photos
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition">
                    <MdOutlineFileUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drop images here or click to upload
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute w-full h-full inset-0 opacity-0 cursor-pointer"
                    />
                    <button
                      type="button"
                      className="text-sm text-blue-600 font-medium"
                    >
                      Choose Files
                    </button>
                  </div>

                  {errors.imageUrls && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.imageUrls.message}
                    </p>
                  )}

                  {/* Previews */}
                  {images.length > 0 && (
                    <div className="mt-4">
                      <div className="grid grid-cols-4 gap-2">
                        {images.map((url, i) => (
                          <div key={i} className="relative group w-fit">
                            <Image
                              width={160}
                              height={160}
                              src={url}
                              alt={`Uploaded ${i + 1}`}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs lg:opacity-0 group-hover:opacity-100"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-blue-600/90 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center hover:bg-blue-700 cursor-pointer"
                >
                  {uploading ? (
                    <span>Uploading...</span>
                  ) : (
                    <>
                      <FaPlus className="w-5 h-5 mr-2" />
                      Add Apartment
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
