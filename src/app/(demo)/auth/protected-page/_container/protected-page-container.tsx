"use client";

import { useAuthProtected } from "@/hooks/use-auth-protected";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography2XL, TypographyBase } from "@/components/typography";
import { signOut, useAccessToken, useUser } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

const ProtectedPageContainer = () => {
  const { isLoading } = useAuthProtected();
  const user = useUser();
  const accessToken = useAccessToken();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push("/auth");
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
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

  // This will only render if user is authenticated (otherwise redirected)
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <Typography2XL as="h1" variant="medium">
              Protected Page
            </Typography2XL>
          </CardTitle>
          <CardDescription>
            <TypographyBase>This page is only accessible to authenticated users.</TypographyBase>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <TypographyBase variant="medium">Authentication Status:</TypographyBase>
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md p-3">
              <TypographyBase className="text-green-700 dark:text-green-300">✓ Authenticated</TypographyBase>
            </div>
          </div>

          {user?.profileId && (
            <div className="space-y-2">
              <TypographyBase variant="medium">Profile ID:</TypographyBase>
              <div className="bg-muted rounded-md p-3">
                <TypographyBase className="font-mono">{user.profileId}</TypographyBase>
              </div>
            </div>
          )}

          {accessToken && (
            <div className="space-y-2">
              <TypographyBase variant="medium">Access Token:</TypographyBase>
              <div className="bg-muted rounded-md p-3">
                <TypographyBase className="font-mono text-xs break-all">
                  {accessToken.substring(0, 50)}...
                </TypographyBase>
              </div>
            </div>
          )}

          <Button onClick={handleSignOut} variant="destructive" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProtectedPageContainer;
