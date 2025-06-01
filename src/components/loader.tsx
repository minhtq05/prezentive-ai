import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export type LoaderSize = "xl" | "sm" | "md" | "lg";

interface LoaderProps {
  size?: LoaderSize;
  className?: string;
}

export default function Loader({ size = "md", className }: LoaderProps) {
  // Define size mappings for the spinner
  const sizeMap = {
    sm: {
      container: "h-8 w-8",
      spinner: "h-5 w-5",
    },
    md: {
      container: "h-12 w-12",
      spinner: "h-8 w-8",
    },
    lg: {
      container: "h-16 w-16",
      spinner: "h-12 w-12",
    },
    xl: {
      container: "h-24 w-24",
      spinner: "h-16 w-16",
    },
  };

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 font-semibold",
          sizeMap[size].container
        )}
      >
        <Loader2
          className={cn(
            "animate-spin text-primary/10 stroke-2",
            sizeMap[size].spinner
          )}
        />
        Loading...
      </div>
    </div>
  );
}
