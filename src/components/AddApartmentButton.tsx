"use client";
import { JSX } from "react";
import { FaPlus } from "react-icons/fa";

/**
 * Props interface for the AddApartmentButton component
 * @interface AddApartmentButtonProps
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setOpen - Function to control the modal open state
 */
interface AddApartmentButtonProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * AddApartmentButton Component
 * 
 * Floating Action Button (FAB) for adding new apartments
 *
 * This component renders a prominent floating button that triggers the apartment creation modal.
 * It features smooth animations and hover effects for enhanced user experience.
 *
 * @component
 * @param {AddApartmentButtonProps} props - Component props
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setOpen - Function to open the apartment creation modal
 *
 * @example
 * // Usage in parent component:
 * const [isModalOpen, setModalOpen] = useState(false);
 *
 * return (
 *   <div>
 *     <AddApartmentButton setOpen={setModalOpen} />
 *     <AddApartmentModal open={open} setOpen={setOpen} />
 *   </div>
 * );
 *
 * @returns {JSX.Element} Floating action button with plus icon
 */
export default function AddApartmentButton({
  setOpen,
}: AddApartmentButtonProps): JSX.Element {
  return (
    <button
      aria-label="Add new apartment"
      title="Add New Apartment"
      onClick={() => setOpen(true)}
      className="fixed cursor-pointer bottom-6 right-6 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group z-40"
    >
      <FaPlus className="w-8 h-8 transition-transform duration-300 group-hover:rotate-90" />
    </button>
  );
}
