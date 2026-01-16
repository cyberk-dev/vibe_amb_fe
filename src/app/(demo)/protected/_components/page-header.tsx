import { Typography2XL, TypographyBase } from "@/shared/ui/typography";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const PageHeader = ({ title, description, actions }: PageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-1">
        <Typography2XL as="h2" className="text-xl sm:text-2xl">
          {title}
        </Typography2XL>
        {description && (
          <TypographyBase className="text-sm sm:text-base text-muted-foreground">{description}</TypographyBase>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};
