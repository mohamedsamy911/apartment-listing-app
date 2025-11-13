"use client";

import dynamic from "next/dynamic";
import { JSX } from "react";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

/**
 * ApiDocsPage Component
 *
 * A page component that renders the Swagger UI component.
 *
 * @component
 * @returns {JSX.Element} The Swagger UI component
 */
export default function ApiDocsPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white p-4">
      <SwaggerUI url="/api/docs" />
    </div>
  );
}
