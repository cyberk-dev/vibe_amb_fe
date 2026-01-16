"use client";

import { useAuthProtected } from "@/hooks/use-auth-protected";
import { ProtectedSidebar } from "@/widgets/layout";
import { Card, CardContent } from "@/shared/ui/card";
import { TypographyBase } from "@/shared/ui/typography";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuthProtected();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <TypographyBase className="text-muted-foreground">Checking authentication...</TypographyBase>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // This will only render if user is authenticated (otherwise redirected by useAuthProtected)
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <ProtectedSidebar />
      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
