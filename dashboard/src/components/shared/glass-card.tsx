import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <div className={cn("glass-card p-4 transition-all duration-200", className)}>
      {children}
    </div>
  );
};
