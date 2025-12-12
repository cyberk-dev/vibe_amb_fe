"use client";

import { RoleBadge } from "@/components/ui/role-badge";
import { ShowForRole } from "@/components/auth/show-for-role";
import { useUser } from "@/stores/auth-store";
import { UserRole } from "@/lib/types/auth.types";
import { useHasRole } from "@/hooks/use-has-role";
import { useMinimumRole } from "@/hooks/use-minimum-role";
import { Shield, Users, Lock, CheckCircle } from "lucide-react";
import { TypographyBase } from "@/components/typography";
import { PageHeader } from "../_components/page-header";
import { InfoCard } from "../_components/info-card";
import { RoleCheckItem } from "../_components/role-check-item";
import { ActionLink } from "../_components/action-link";
import { useMemo } from "react";

export const RbacDemoContainer = () => {
  const user = useUser();

  // Business logic: Check roles
  const isUser = useHasRole(UserRole.USER);
  const isAdmin = useHasRole(UserRole.ADMIN);
  const isSuperAdmin = useHasRole(UserRole.SUPERADMIN);
  const hasMinimumAdmin = useMinimumRole(UserRole.ADMIN);

  // Business logic: Prepare role check data
  const roleChecks = useMemo(
    () => [
      { hookName: "useHasRole(USER)", isGranted: isUser },
      { hookName: "useHasRole(ADMIN)", isGranted: isAdmin },
      { hookName: "useHasRole(SUPERADMIN)", isGranted: isSuperAdmin },
      { hookName: "useMinimumRole(ADMIN)", isGranted: hasMinimumAdmin },
    ],
    [isUser, isAdmin, isSuperAdmin, hasMinimumAdmin],
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <PageHeader
        title="Role-Based Access Control Demo"
        description="Interactive demonstration of RBAC features and hooks"
      />

      <InfoCard title="Your Current Role" description="Information about your authenticated user">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <TypographyBase className="font-medium">Username:</TypographyBase>
              <TypographyBase className="text-muted-foreground">{user?.username || "Not available"}</TypographyBase>
            </div>
            {user?.role && <RoleBadge role={user.role} />}
          </div>
          <div>
            <TypographyBase className="font-medium">User ID:</TypographyBase>
            <TypographyBase className="text-muted-foreground">{user?.id || "N/A"}</TypographyBase>
          </div>
        </div>
      </InfoCard>

      <InfoCard title="Role Checking Hooks" description="Results from various role checking hooks">
        <div className="space-y-3">
          {roleChecks.map((check) => (
            <RoleCheckItem key={check.hookName} {...check} />
          ))}
        </div>
      </InfoCard>

      <InfoCard
        title="Conditional Component Rendering"
        description="Components that show/hide based on user role using ShowForRole component"
      >
        <div className="space-y-4">
          <ShowForRole
            role={UserRole.USER}
            fallback={<div className="p-3 border rounded-lg text-muted-foreground">Not visible for USER role</div>}
          >
            <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <TypographyBase className="font-medium">Visible for USER role</TypographyBase>
              </div>
            </div>
          </ShowForRole>

          <ShowForRole
            role={UserRole.ADMIN}
            fallback={<div className="p-3 border rounded-lg text-muted-foreground">Not visible for ADMIN role</div>}
          >
            <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <TypographyBase className="font-medium">Visible for ADMIN role</TypographyBase>
              </div>
            </div>
          </ShowForRole>

          <ShowForRole
            role={UserRole.SUPERADMIN}
            fallback={
              <div className="p-3 border rounded-lg text-muted-foreground">Not visible for SUPERADMIN role</div>
            }
          >
            <div className="p-3 border rounded-lg bg-purple-50 dark:bg-purple-950">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <TypographyBase className="font-medium">Visible for SUPERADMIN role</TypographyBase>
              </div>
            </div>
          </ShowForRole>

          <ShowForRole
            role={[UserRole.ADMIN, UserRole.SUPERADMIN]}
            fallback={<div className="p-3 border rounded-lg text-muted-foreground">Not visible for admin roles</div>}
          >
            <div className="p-3 border rounded-lg bg-indigo-50 dark:bg-indigo-950">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-indigo-600" />
                <TypographyBase className="font-medium">
                  Visible for ADMIN or SUPERADMIN (multiple roles)
                </TypographyBase>
              </div>
            </div>
          </ShowForRole>
        </div>
      </InfoCard>

      <InfoCard title="Protected Routes" description="Try accessing these pages based on your role">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
          <ActionLink href="/protected" icon={Lock} label="Protected Dashboard" />
          <ActionLink href="/protected/admin" icon={Shield} label="Admin Panel (ADMIN+)" variant="outline" />
          <ActionLink
            href="/protected/users"
            icon={Users}
            label="User Management (SUPERADMIN only)"
            variant="outline"
          />
        </div>
      </InfoCard>

      <InfoCard title="Role Hierarchy" description="Understanding the role hierarchy system">
        <div className="space-y-3">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <RoleBadge role={UserRole.USER} />
              <TypographyBase className="text-sm text-muted-foreground">Level 1 - Basic user access</TypographyBase>
            </div>
            <div className="flex items-center gap-3">
              <RoleBadge role={UserRole.ADMIN} />
              <TypographyBase className="text-sm text-muted-foreground">
                Level 2 - Admin privileges + all USER permissions
              </TypographyBase>
            </div>
            <div className="flex items-center gap-3">
              <RoleBadge role={UserRole.SUPERADMIN} />
              <TypographyBase className="text-sm text-muted-foreground">
                Level 3 - Full system access + all ADMIN permissions
              </TypographyBase>
            </div>
          </div>
        </div>
      </InfoCard>
    </div>
  );
};
