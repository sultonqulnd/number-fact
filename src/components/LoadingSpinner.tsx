import { cn } from "@/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        className
      )}
    />
  );
}

export function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-current" />
    </div>
  );
}

export function LoadingPulse() {
  return (
    <div className="flex space-x-1">
      <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
      <div className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:0.2s]" />
      <div className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:0.4s]" />
    </div>
  );
}
