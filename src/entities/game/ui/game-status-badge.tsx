import { GameStatus } from "@/integrations/aptos";
import { STATUS_LABELS, STATUS_COLORS } from "../model/constants";
import { cn } from "@/shared/lib/utils";

interface GameStatusBadgeProps {
  status: GameStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

const colorClasses: Record<string, string> = {
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  gray: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const dotColorClasses: Record<string, string> = {
  yellow: "bg-yellow-400",
  blue: "bg-blue-400",
  orange: "bg-orange-400",
  purple: "bg-purple-400",
  gray: "bg-gray-400",
};

export function GameStatusBadge({ status, size = "md", showLabel = true }: GameStatusBadgeProps) {
  const color = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-medium",
        sizeClasses[size],
        colorClasses[color],
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", dotColorClasses[color])} />
      {showLabel && label}
    </span>
  );
}
