"use client";

import { Button } from "@/components/ui/button";
import { TypographyBase } from "@/components/typography";
import { signOut, useAccessToken, useUser } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { Shield, Users, FileText, LogOut } from "lucide-react";
import { UserRole } from "@/lib/types/auth.types";
import { PageHeader } from "./_components/page-header";
import { InfoCard } from "./_components/info-card";
import { QuickActions } from "./_components/quick-actions";
import { PermissionsList } from "./_components/permissions-list";
import { ActionLink } from "./_components/action-link";
import { useMemo } from "react";

export default function ProtectedDashboardPage() {
  const user = useUser();
  const accessToken = useAccessToken();
  const router = useRouter();

  // Business logic: Check access levels
  const hasAdminAccess = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPERADMIN;
  const hasSuperAdminAccess = user?.role === UserRole.SUPERADMIN;

  // Business logic: Handle sign out
  const handleSignOut = () => {
    signOut();
    router.push("/auth");
  };

  // Business logic: Prepare permissions list
  const permissions = useMemo(
    () => [
      { label: "Access protected dashboard", granted: true },
      { label: "View RBAC demo", granted: true },
      { label: "Access admin panel", granted: hasAdminAccess },
      { label: "View system statistics", granted: hasAdminAccess },
      { label: "Manage users (promote/demote)", granted: hasSuperAdminAccess },
      { label: "Full system access", granted: hasSuperAdminAccess },
    ],
    [hasAdminAccess, hasSuperAdminAccess],
  );

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-4xl mx-auto">
      <PageHeader
        title="Protected Dashboard"
        description="Welcome to your protected area. This page is only accessible to authenticated users."
      />

      <InfoCard title="Authentication Status" description="Your current authentication information">
        <div className="space-y-4">
          <div className="space-y-2">
            <TypographyBase variant="medium">Status:</TypographyBase>
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md p-3">
              <TypographyBase className="text-green-700 dark:text-green-300">✓ Authenticated</TypographyBase>
            </div>
          </div>

          <div className="space-y-2">
            <TypographyBase variant="medium">Username:</TypographyBase>
            <div className="bg-muted rounded-md p-3">
              <TypographyBase className="font-mono">{user?.username || "N/A"}</TypographyBase>
            </div>
          </div>

          {user?.profileId && (
            <div className="space-y-2">
              <TypographyBase variant="medium">Profile ID:</TypographyBase>
              <div className="bg-muted rounded-md p-3">
                <TypographyBase className="font-mono">{user.profileId}</TypographyBase>
              </div>
            </div>
          )}

          {accessToken && (
            <div className="space-y-2">
              <TypographyBase variant="medium">Access Token:</TypographyBase>
              <div className="bg-muted rounded-md p-3">
                <TypographyBase className="font-mono text-xs break-all">
                  {accessToken.substring(0, 50)}...
                </TypographyBase>
              </div>
            </div>
          )}
        </div>
      </InfoCard>

      <QuickActions description="Navigate to different sections based on your permissions">
        {hasAdminAccess && <ActionLink href="/protected/admin" icon={Shield} label="Admin Panel" />}
        <ActionLink href="/protected/rbac-demo" icon={FileText} label="RBAC Demo" variant="outline" />
        {hasSuperAdminAccess && (
          <ActionLink href="/protected/users" icon={Users} label="User Management" variant="outline" />
        )}
        <Button onClick={handleSignOut} variant="destructive" className="w-full sm:w-auto">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </QuickActions>

      <PermissionsList
        title="Your Permissions"
        description="What you can access with your current role"
        permissions={permissions}
      />
    </div>
  );
}
