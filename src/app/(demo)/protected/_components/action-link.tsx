import { Button } from "@/shared/ui/button";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ActionLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  variant?: "default" | "outline" | "destructive" | "ghost";
  fullWidth?: boolean;
}

export const ActionLink = ({ href, icon: Icon, label, variant = "default", fullWidth = true }: ActionLinkProps) => {
  return (
    <Link href={href} className={fullWidth ? "w-full sm:w-auto" : ""}>
      <Button variant={variant} className={fullWidth ? "w-full sm:w-auto" : ""}>
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
};
