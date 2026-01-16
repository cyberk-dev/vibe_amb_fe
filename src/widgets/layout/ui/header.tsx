"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, MonitorPlay, Newspaper, X, Shield } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { ThemeToggleButton } from "@/shared/ui/theme-toggle-button";
import { LanguageToggleButton } from "@/shared/ui/language-toggle-button";
import { useTheme } from "next-themes";
import { ConnectWalletButton } from "@/features/wallet";
import { useMinimumRole } from "@/hooks/use-minimum-role";
import { UserRole } from "@/lib/types/auth.types";

interface MenuItem {
  text: string;
  icon?: React.ReactNode;
  href: string;
}

interface HeaderProps {
  logo?: React.ReactNode;
  menuItems?: MenuItem[];
  className?: string;
}

const MENU_ITEMS = [
  {
    text: "Demos",
    icon: <MonitorPlay />,
    href: "/",
  },
  {
    text: "Docs",
    icon: <Newspaper />,
    href: "/docs",
  },
];

export const MenuItem: React.FC<MenuItem> = ({ text, icon, href }) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-accent-foreground"
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};

export const Header: React.FC<HeaderProps> = ({ logo, menuItems = MENU_ITEMS, className }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isAdmin = useMinimumRole(UserRole.ADMIN);

  // Add admin panel link if user is admin or superadmin
  const allMenuItems = React.useMemo(() => {
    if (isAdmin) {
      return [
        ...menuItems,
        {
          text: "Admin Panel",
          icon: <Shield />,
          href: "/admin",
        },
      ];
    }
    return menuItems;
  }, [menuItems, isAdmin]);

  // Close menu when switching from mobile to desktop
  React.useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isMenuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen, isMobile]);

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background",
          className,
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between md:justify-start gap-5">
            {/* Logo */}
            <div className="flex items-center">
              {logo ? (
                <Link href="/" className="flex items-center space-x-2">
                  {logo}
                </Link>
              ) : (
                <Link href="/" className="text-xl font-bold">
                  <Image
                    width={200}
                    height={48}
                    src="/icons/cyberk-logo.svg"
                    alt="cyberk-logo"
                    className={cn("transition-all duration-200", theme === "dark" && "brightness-0 invert")}
                  />
                </Link>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:items-center md:gap-6">
              {allMenuItems.map((item) => (
                <MenuItem key={item.href} text={item.text} icon={item?.icon} href={item.href} />
              ))}
            </nav>

            {/* Desktop Right Side: Theme, Language, Connect Wallet */}
            <div className="hidden md:flex md:ml-auto md:items-center md:gap-2">
              <LanguageToggleButton />
              <ThemeToggleButton />
              <ConnectWalletButton />
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden ml-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu - Absolute Positioned */}
      {isMobile && (
        <>
          {/* Backdrop/Overlay */}
          <div
            className={cn(
              "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
              isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
            )}
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile Menu */}
          <nav
            className={cn(
              "fixed top-16 left-0 right-0 z-40 bg-background border-b shadow-lg transition-transform duration-300 ease-in-out md:hidden",
              isMenuOpen ? "translate-y-0" : "-translate-y-full",
            )}
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col space-y-4">
                {/* Menu Items */}
                <div className="flex flex-col space-y-1">
                  {allMenuItems.map((item) => (
                    <div key={item.href} onClick={handleMenuItemClick}>
                      <MenuItem text={item.text} icon={item.icon} href={item.href} />
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t" />

                {/* Connect Wallet, Theme & Language Toggle */}
                <div className="flex flex-col space-y-3">
                  <ConnectWalletButton isFullWidth />
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium">Settings</span>
                    <div className="flex gap-2">
                      <LanguageToggleButton />
                      <ThemeToggleButton />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
};
