"use client";

import { JSX, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddApartmentModal from "@/components/AddApartmentModal";
import { Toaster } from "react-hot-toast";

/**
 * ClientLayout Component
 *
 * A client-side layout wrapper that provides the main application structure
 * including navigation, footer, modal management, and notification system.
 *
 * This component handles:
 * - Global layout structure
 * - Modal state management for adding apartments
 * - Toast notifications configuration
 * - Consistent styling and behavior across the application
 *
 * @component
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to be rendered within the layout
 *
 * @example
 * // Usage in your app:
 * <ClientLayout>
 *   <YourPageComponent />
 * </ClientLayout>
 *
 * @example
 * // With multiple children:
 * <ClientLayout>
 *   <div>
 *     <Header />
 *     <MainContent />
 *   </div>
 * </ClientLayout>
 *
 * @returns {JSX.Element} The complete client-side layout structure
 *
 * @remarks
 * This component uses client-side state management for the apartment modal.
 * The Toaster component is configured for global notification handling.
 */
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  /**
   * State to manage the visibility of the Add Apartment modal
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Navbar setOpen={setOpen} />
      {children}
      <AddApartmentModal open={open} setOpen={setOpen} />
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #4ade80",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #ef4444",
            },
          },
        }}
      />
    </>
  );
}
