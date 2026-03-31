import { Skull, ArrowRightLeft, ShoppingCart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { SuiEvent } from "../../lib/types";
import { cn } from "../../lib/cn";

interface EventItemProps {
  event: SuiEvent;
  type: "kill" | "jump" | "trade";
  compact?: boolean;
  index?: number;
}

function abbreviate(str: string, front = 6, back = 4): string {
  if (str.length <= front + back + 3) return str;
  return `${str.slice(0, front)}...${str.slice(-back)}`;
}

export const EventItem = ({ event, type, compact, index = 0 }: EventItemProps) => {
  const Icon = type === "kill" ? Skull : type === "trade" ? ShoppingCart : ArrowRightLeft;
  const borderColor = type === "kill" ? "border-danger" : type === "trade" ? "border-amber" : "border-cyan";
  const accentColor = type === "kill" ? "text-danger" : type === "trade" ? "text-amber" : "text-cyan";
  const label = type === "kill" ? "KILL" : type === "trade" ? "TRADE" : "GATE JUMP";

  const timestamp = formatDistanceToNow(
    new Date(Number(event.timestampMs)),
    { addSuffix: true },
  );

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-l-2 pl-3 animate-slide-in-right",
        borderColor,
        compact ? "py-1.5" : "py-2.5",
      )}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <Icon size={compact ? 14 : 16} className={cn(accentColor, "shrink-0")} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-jetbrains font-bold uppercase",
              accentColor,
              compact ? "text-[10px]" : "text-xs",
            )}
          >
            {label}
          </span>
          <span className="font-jetbrains text-muted text-[10px] truncate">
            {abbreviate(event.id.txDigest)}
          </span>
        </div>
        {!compact && (
          <p className="font-jetbrains text-[10px] text-muted mt-0.5 truncate">
            {abbreviate(event.sender, 8, 4)}
          </p>
        )}
      </div>

      <span className="text-muted text-[10px] font-outfit shrink-0 whitespace-nowrap">
        {timestamp}
      </span>
    </div>
  );
};
