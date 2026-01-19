import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface AdminActionButtonProps {
  onClick: () => void;
  isPending: boolean;
  disabled?: boolean;
  variant?: "default" | "danger" | "success";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const variantClasses = {
  default: "bg-blue-600 hover:bg-blue-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
};

export function AdminActionButton({
  onClick,
  isPending,
  disabled = false,
  variant = "default",
  children,
  icon,
}: AdminActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isPending || disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors",
        // "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
      )}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}
