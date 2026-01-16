"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { RoleBadge } from "@/shared/ui/role-badge";
import { useUsersQuery } from "@/integrations/api/hooks/user/use-users-query";
import { usePromoteAdminMutation } from "@/integrations/api/hooks/user/use-promote-admin.mutation";
import { useDemoteAdminMutation } from "@/integrations/api/hooks/user/use-demote-admin.mutation";
import { UserRole } from "@/entities/user";
import { Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { useRequireRole } from "@/hooks/use-require-role";
import { Typography2XL, TypographyBase } from "@/shared/ui/typography";
import { useGlobalDialogActions } from "@/shared/lib/stores";

export const UserManagementContainer = () => {
  const { isLoading: isCheckingPermissions } = useRequireRole(UserRole.SUPERADMIN);
  const { data: users, isLoading: isLoadingUsers } = useUsersQuery();
  const promoteMutation = usePromoteAdminMutation();
  const demoteMutation = useDemoteAdminMutation();
  const { showConfirm } = useGlobalDialogActions();

  const handlePromote = async (userId: number, username: string) => {
    const confirmed = await showConfirm({
      title: "Promote to Admin",
      description: `Are you sure you want to promote ${username} to Admin? This will give them elevated privileges.`,
    });

    if (confirmed) {
      promoteMutation.mutate(userId);
    }
  };

  const handleDemote = async (userId: number, username: string) => {
    const confirmed = await showConfirm({
      title: "Demote to User",
      description: `Are you sure you want to demote ${username} to regular User? This will remove their admin privileges.`,
    });

    if (confirmed) {
      demoteMutation.mutate(userId);
    }
  };

  if (isCheckingPermissions || isLoadingUsers) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Typography2XL as="h2">User Management</Typography2XL>
        <TypographyBase className="text-muted-foreground">
          Manage user roles and permissions (SUPERADMIN only)
        </TypographyBase>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Promote or demote users between roles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm ${user.confirmed ? "text-green-600" : "text-yellow-600"}`}>
                      {user.confirmed ? "Confirmed" : "Pending"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {user.role === UserRole.USER && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePromote(user.id, user.username)}
                          disabled={promoteMutation.isPending}
                        >
                          <ArrowUp className="mr-2 h-4 w-4" />
                          Promote to Admin
                        </Button>
                      )}
                      {user.role === UserRole.ADMIN && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDemote(user.id, user.username)}
                          disabled={demoteMutation.isPending}
                        >
                          <ArrowDown className="mr-2 h-4 w-4" />
                          Demote to User
                        </Button>
                      )}
                      {user.role === UserRole.SUPERADMIN && (
                        <span className="text-sm text-muted-foreground">No actions</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
