import { UserRole } from "@/lib/types/auth.types";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/constants/roles";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export const RoleBadge = ({ role, className }: RoleBadgeProps) => {
  return <Badge className={cn(ROLE_COLORS[role], className)}>{ROLE_LABELS[role]}</Badge>;
};
