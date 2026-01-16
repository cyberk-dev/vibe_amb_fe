import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const InfoCard = ({ title, description, children }: InfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        {description && <CardDescription className="text-sm">{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
