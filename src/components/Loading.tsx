import { JSX } from "react";

/**
 * @interface LoadingProps
 * @property {string} message - The message to display while the component is loading
 */
interface LoadingProps {
  message: string;
}
/**
 * Loading Component
 *
 * A loading component that displays a loading spinner and a message.
 *
 * @component
 * @param {LoadingProps} props - Component props
 * @param {string} props.message - The message to display while the component is loading
 *
 * @example
 * // Usage in parent component:
 * <Loading message="Loading..." />
 *
 * @returns {JSX.Element} Loading component with loading spinner and message.
 */
export default function Loading({ message }: LoadingProps): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
