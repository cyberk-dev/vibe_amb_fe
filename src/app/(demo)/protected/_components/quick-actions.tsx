import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ReactNode } from "react";

interface QuickActionsProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export const QuickActions = ({
  title = "Quick Actions",
  description = "Manage your system and users",
  children,
}: QuickActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">{children}</CardContent>
    </Card>
  );
};
