"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { FooterProps } from "../model/types";

export const Footer: React.FC<FooterProps> = ({ copyright, className }) => {
  const currentYear = new Date().getFullYear();
  const copyrightText = copyright || `${currentYear} All rights reserved.`;

  return (
    <footer className={cn("w-full border-t bg-background px-4 py-12", className)}>
      <p className="text-center text-sm text-muted-foreground">{copyrightText}</p>
    </footer>
  );
};
