import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { TypographyBase } from "@/shared/ui/typography";

interface Permission {
  label: string;
  granted: boolean;
}

interface PermissionsListProps {
  title?: string;
  description?: string;
  permissions: Permission[];
}

export const PermissionsList = ({
  title = "Your Permissions",
  description = "What you can do with your current role",
  permissions,
}: PermissionsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {permissions.map((permission, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${permission.granted ? "bg-green-500" : "bg-gray-300"}`} />
              <TypographyBase className={permission.granted ? "" : "text-muted-foreground"}>
                {permission.label}
              </TypographyBase>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
