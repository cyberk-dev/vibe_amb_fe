import type { ElementType, FC, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends PropsWithChildren {
  className?: string;
  as?: ElementType;
}

const Typography3XL: FC<TypographyProps> = ({ children, className, as }) => {
  const Component = as || "span";
  return (
    <Component className={cn("text-[1.75rem] font-medium", className)}>
      {children}
    </Component>
  );
};
Typography3XL.displayName = "Typography3XL";

const Typography2XL: FC<
  TypographyProps & {
    variant?: "regular" | "medium";
  }
> = ({ children, className, as, variant = "regular" }) => {
  const Component = as || "span";
  return (
    <Component
      className={cn(
        "text-2xl",
        {
          "font-medium": variant === "medium",
          "font-normal": variant === "regular",
        },
        className,
      )}
    >
      {children}
    </Component>
  );
};
Typography2XL.displayName = "Typography2XL";

const TypographyXL: FC<TypographyProps> = ({ children, className, as }) => {
  const Component = as || "span";
  return (
    <Component className={cn("text-xl font-bold", className)}>
      {children}
    </Component>
  );
};
TypographyXL.displayName = "TypographyXL";

const TypographyLG: FC<
  TypographyProps & {
    variant?: "regular" | "medium";
  }
> = ({ children, className, as, variant = "regular" }) => {
  const Component = as || "span";
  return (
    <Component
      className={cn(
        "text-lg",
        {
          "font-medium": variant === "medium",
          "font-normal": variant === "regular",
        },
        className,
      )}
    >
      {children}
    </Component>
  );
};
TypographyLG.displayName = "TypographyLG";

const TypographyMD: FC<
  TypographyProps & {
    variant?: "regular" | "medium";
  }
> = ({ children, className, as, variant = "regular" }) => {
  const Component = as || "span";
  return (
    <Component
      className={cn(
        "text-base",
        {
          "font-medium": variant === "medium",
          "font-normal": variant === "regular",
        },
        className,
      )}
    >
      {children}
    </Component>
  );
};
TypographyMD.displayName = "TypographyMD";

const TypographyBase: FC<
  TypographyProps & {
    variant?: "regular" | "medium";
  }
> = ({ children, className, as, variant = "regular" }) => {
  const Component = as || "span";
  return (
    <Component
      className={cn(
        "text-sm",
        {
          "font-medium": variant === "medium",
          "font-normal": variant === "regular",
        },
        className,
      )}
    >
      {children}
    </Component>
  );
};
TypographyBase.displayName = "TypographyBase";

const TypographySM: FC<
  TypographyProps & {
    variant?: "regular" | "medium";
  }
> = ({ children, className, as, variant = "regular" }) => {
  const Component = as || "span";
  return (
    <Component
      className={cn(
        "text-xs",
        {
          "font-medium": variant === "medium",
          "font-normal": variant === "regular",
        },
        className,
      )}
    >
      {children}
    </Component>
  );
};
TypographySM.displayName = "TypographySM";

const TypographyXS: FC<
  TypographyProps & {
    variant?: "regular" | "medium";
  }
> = ({ children, className, as, variant = "regular" }) => {
  const Component = as || "span";
  return (
    <Component
      className={cn(
        "text-[0.5625rem]",
        {
          "font-medium": variant === "medium",
          "font-normal": variant === "regular",
        },
        className,
      )}
    >
      {children}
    </Component>
  );
};
TypographyXS.displayName = "TypographyXS";

export {
  Typography3XL,
  Typography2XL,
  TypographyXL,
  TypographyLG,
  TypographyMD,
  TypographyBase,
  TypographySM,
  TypographyXS,
};
