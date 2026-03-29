import { cn } from "../../lib/cn";

interface PulsingDotProps {
  color?: string;
}

export const PulsingDot = ({ color = "bg-success" }: PulsingDotProps) => {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          color,
        )}
      />
      <span
        className={cn("relative inline-flex rounded-full h-2 w-2", color)}
      />
    </span>
  );
};
