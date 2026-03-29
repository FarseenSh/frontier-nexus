import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "./glass-card";
import { cn } from "../../lib/cn";

const colorMap = {
  cyan: "text-cyan",
  amber: "text-amber",
  danger: "text-danger",
  success: "text-success",
};

function useCountUp(target: number, duration = 800): number {
  const [current, setCurrent] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    if (target === prevTarget.current) return;
    prevTarget.current = target;

    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCurrent(Math.round(from + (target - from) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, duration]);

  return current;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  color?: keyof typeof colorMap;
}

export const StatCard = ({
  label,
  value,
  icon: Icon,
  color = "cyan",
}: StatCardProps) => {
  const isNumeric = typeof value === "number";
  const animatedValue = useCountUp(isNumeric ? value : 0);

  return (
    <GlassCard>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-secondary uppercase tracking-wider mb-2">
            {label}
          </p>
          <p className={cn("text-2xl font-jetbrains font-bold", colorMap[color])}>
            {isNumeric ? animatedValue.toLocaleString() : value}
          </p>
        </div>
        {Icon && <Icon size={20} className="text-muted" />}
      </div>
    </GlassCard>
  );
};
