"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shield, Users, FileText, Menu } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { RoleBadge } from "@/shared/ui/role-badge";
import { useUser } from "@/stores/auth-store";
import { UserRole } from "@/lib/types/auth.types";
import { TypographyBase } from "@/shared/ui/typography";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/ui/sheet";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole?: UserRole | UserRole[];
}

const navItems: NavItem[] = [
  {
    href: "/protected",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/protected/admin",
    label: "Admin Panel",
    icon: Shield,
    requiredRole: [UserRole.ADMIN, UserRole.SUPERADMIN],
  },
  {
    href: "/protected/rbac-demo",
    label: "RBAC Demo",
    icon: FileText,
  },
  {
    href: "/protected/users",
    label: "User Management",
    icon: Users,
    requiredRole: UserRole.SUPERADMIN,
  },
];

// Sidebar content component (reusable for both mobile and desktop)
const SidebarContent = ({
  user,
  pathname,
  hasRequiredRole,
  onNavigate,
}: {
  user: ReturnType<typeof useUser>;
  pathname: string;
  hasRequiredRole: (role?: UserRole | UserRole[]) => boolean;
  onNavigate?: () => void;
}) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <TypographyBase variant="medium" className="text-sm text-muted-foreground">
        Welcome back
      </TypographyBase>
      <div className="space-y-1">
        <TypographyBase variant="medium" className="truncate">
          {user?.username || "User"}
        </TypographyBase>
        {user?.role && <RoleBadge role={user.role} />}
      </div>
    </div>

    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        const hasAccess = hasRequiredRole(item.requiredRole);

        if (!hasAccess) return null;

        return (
          <Link key={item.href} href={item.href} onClick={onNavigate}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive && "bg-secondary font-medium")}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  </div>
);

export const ProtectedSidebar = () => {
  const pathname = usePathname() ?? "";
  const user = useUser();
  const [open, setOpen] = useState(false);

  const hasRequiredRole = (requiredRole?: UserRole | UserRole[]): boolean => {
    if (!requiredRole) return true;
    if (!user?.role) return false;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }

    // Check role hierarchy
    const roleHierarchy = {
      [UserRole.USER]: 1,
      [UserRole.ADMIN]: 2,
      [UserRole.SUPERADMIN]: 3,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const closeMobileMenu = () => setOpen(false);

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <TypographyBase variant="medium">Protected Area</TypographyBase>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <SidebarContent
                  user={user}
                  pathname={pathname}
                  hasRequiredRole={hasRequiredRole}
                  onNavigate={closeMobileMenu}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r bg-muted/40 p-6 flex-col">
        <SidebarContent user={user} pathname={pathname} hasRequiredRole={hasRequiredRole} />
      </aside>
    </>
  );
};
