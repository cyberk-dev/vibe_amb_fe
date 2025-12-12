"use client";

import { useUser } from "@/stores/auth-store";
import { Users, Shield, Settings, FileText } from "lucide-react";
import { UserRole } from "@/lib/types/auth.types";
import { RoleBadge } from "@/components/ui/role-badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/page-header";
import { StatCard } from "../_components/stat-card";
import { QuickActions } from "../_components/quick-actions";
import { PermissionsList } from "../_components/permissions-list";
import { ActionLink } from "../_components/action-link";
import { useMemo } from "react";

export const AdminDashboardContainer = () => {
  const user = useUser();
  const isSuperAdmin = user?.role === UserRole.SUPERADMIN;

  // Business logic: Calculate stats (in real app, this would come from API)
  const stats = useMemo(
    () => [
      { title: "Total Users", value: 245, description: "+20% from last month", icon: Users },
      { title: "Admin Users", value: 12, description: "+2 from last month", icon: Shield },
      { title: "Active Sessions", value: 127, description: "+10% from yesterday", icon: FileText },
    ],
    [],
  );

  // Business logic: Determine permissions based on role
  const permissions = useMemo(
    () => [
      { label: "Access admin dashboard", granted: true },
      { label: "View system statistics", granted: true },
      { label: "Manage user roles (promote/demote)", granted: isSuperAdmin },
      { label: "Full system access", granted: isSuperAdmin },
    ],
    [isSuperAdmin],
  );

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-6xl mx-auto">
      <PageHeader
        title="Admin Dashboard"
        description={`Welcome back, ${user?.username || "Admin"}`}
        actions={user?.role && <RoleBadge role={user.role} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <QuickActions>
        {isSuperAdmin && <ActionLink href="/protected/users" icon={Users} label="Manage Users" />}
        <ActionLink href="/protected/rbac-demo" icon={Shield} label="RBAC Demo" variant="outline" />
        <Button variant="outline" className="w-full sm:w-auto">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </QuickActions>

      <PermissionsList permissions={permissions} />
    </div>
  );
};
