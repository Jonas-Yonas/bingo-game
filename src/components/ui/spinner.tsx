// import { Loader2 } from "lucide-react";
// import { cn } from "@/lib/utils";

// type SpinnerProps = {
//   size?: "sm" | "md" | "lg";
//   className?: string;
//   "aria-label"?: string;
//   center?: boolean; // Optional center alignment
// };

// export function Spinner({
//   size = "md",
//   className,
//   "aria-label": ariaLabel = "Loading...",
//   center = false,
// }: SpinnerProps) {
//   const sizeClasses = {
//     sm: "h-4 w-4",
//     md: "h-6 w-6", // slightly larger by default
//     lg: "h-8 w-8",
//   };

//   return (
//     <div
//       role="status"
//       aria-label={ariaLabel}
//       className={cn(
//         "inline-flex items-center justify-center transition-opacity duration-300 ease-in-out",
//         center && "w-full h-full justify-center items-center",
//         className
//       )}
//     >
//       <Loader2
//         className={cn(
//           "animate-spin text-emerald-500 dark:text-emerald-400",
//           sizeClasses[size]
//         )}
//       />
//       <span className="sr-only">{ariaLabel}</span>
//     </div>
//   );
// }

export function Spinner() {
  return <span className="custom-loader" />;
}
