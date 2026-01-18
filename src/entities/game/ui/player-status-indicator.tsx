import { Check, Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface PlayerStatusIndicatorProps {
  hasActed: boolean;
  size?: "sm" | "md";
}

export function PlayerStatusIndicator({ hasActed, size = "md" }: PlayerStatusIndicatorProps) {
  const iconSize = size === "sm" ? 14 : 18;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5",
        hasActed ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400",
      )}
    >
      {hasActed ? (
        <>
          <Check size={iconSize} />
          <span className="text-xs">Done</span>
        </>
      ) : (
        <>
          <Clock size={iconSize} />
          <span className="text-xs">Waiting</span>
        </>
      )}
    </span>
  );
}
