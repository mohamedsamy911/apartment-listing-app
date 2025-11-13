import { JSX, Suspense } from "react";
import ApartmentList from "@/components/ApartmentList";
import Loading from "@/components/Loading";

/**
 * Home Component
 *
 * The main application component that renders the ApartmentList component.
 * @component
 * @returns {JSX.Element} The main application component
 */
export default async function Home(): Promise<JSX.Element> {
  return (
    <Suspense fallback={<Loading message="Loading apartments..." />}>
      <ApartmentList />
    </Suspense>
  );
}
