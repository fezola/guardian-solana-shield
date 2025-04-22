
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "secondary";
}

export function LoadingState({
  text = "Loading...",
  size = "md",
  variant = "default",
  className,
  ...props
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full gap-2",
        size === "sm" && "py-2",
        size === "md" && "py-6",
        size === "lg" && "py-12",
        className
      )}
      {...props}
    >
      <Loader
        className={cn(
          "animate-spin",
          size === "sm" && "h-4 w-4",
          size === "md" && "h-8 w-8",
          size === "lg" && "h-12 w-12",
          variant === "default" && "text-muted-foreground",
          variant === "primary" && "text-primary",
          variant === "secondary" && "text-secondary"
        )}
      />
      {text && (
        <span
          className={cn(
            "text-sm",
            variant === "default" && "text-muted-foreground",
            variant === "primary" && "text-primary",
            variant === "secondary" && "text-secondary"
          )}
        >
          {text}
        </span>
      )}
    </div>
  );
}
