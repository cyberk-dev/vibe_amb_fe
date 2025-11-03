import { LucideIcon } from "lucide-react";

export interface MenuItem {
  text: string;
  icon?: LucideIcon;
  href: string;
  onClick?: () => void;
}

export interface HeaderProps {
  logo?: React.ReactNode;
  menuItems: MenuItem[];
  className?: string;
}

export interface FooterProps {
  logo?: React.ReactNode;
  description?: string;
  links?: {
    title: string;
    items: Array<{
      label: string;
      href: string;
    }>;
  }[];
  socialLinks?: Array<{
    icon: LucideIcon;
    href: string;
    label: string;
  }>;
  copyright?: string;
  className?: string;
}
