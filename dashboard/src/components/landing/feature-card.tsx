import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  stat: string;
  label: string;
  delay?: number;
}

export const FeatureCard = ({ icon: Icon, stat, label, delay = 0 }: FeatureCardProps) => {
  return (
    <div
      className="glass-card p-6 text-center animate-fade-in flex-1 min-w-[200px]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Icon size={28} className="text-cyan mx-auto mb-3" />
      <p className="font-jetbrains text-2xl font-bold text-primary">{stat}</p>
      <p className="text-secondary text-sm mt-1">{label}</p>
    </div>
  );
};
