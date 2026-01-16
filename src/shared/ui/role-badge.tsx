import { UserRole, ROLE_LABELS, ROLE_COLORS } from "@/entities/user";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export const RoleBadge = ({ role, className }: RoleBadgeProps) => {
  return <Badge className={cn(ROLE_COLORS[role], className)}>{ROLE_LABELS[role]}</Badge>;
};
