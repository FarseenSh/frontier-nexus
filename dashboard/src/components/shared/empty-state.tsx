import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  subtitle,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Icon size={48} className="text-muted mb-4" />
      <p className="text-primary text-sm font-outfit">{title}</p>
      {subtitle && (
        <p className="text-secondary text-xs mt-1">{subtitle}</p>
      )}
    </div>
  );
};
