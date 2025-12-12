"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Typography2XL, TypographyBase } from "@/components/typography";
import { LoginContainer } from "./login-container";
import { RegisterContainer } from "./register-container";
import { useRouter } from "next/navigation";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { setSiweLoginCallback } from "@/integrations/reown-appkit/siwe";

type AuthMode = "login" | "register";

export const AuthFormContainer = () => {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const toggleAuthMode = () => {
    setAuthMode((prev) => (prev === "login" ? "register" : "login"));
  };

  const registerCallback = () => {
    setAuthMode("login");
  };

  const loginCallback = () => {
    router.push("/protected");
  };

  // Set SIWE login callback when component mounts
  useEffect(() => {
    setSiweLoginCallback(loginCallback);

    // Cleanup: remove callback when component unmounts
    return () => {
      setSiweLoginCallback(null);
    };
  }, [router]);

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-3">
          <CardTitle>
            <Typography2XL as="h1" variant="medium">
              {authMode === "login" ? "Welcome Back" : "Create Account"}
            </Typography2XL>
          </CardTitle>
          <CardDescription>
            <TypographyBase>
              {authMode === "login"
                ? "Enter your credentials to access your account"
                : "Fill in the details to create your new account"}
            </TypographyBase>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <ConnectWalletButton isFullWidth />

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-card px-2">
                <TypographyBase className="text-muted-foreground">or</TypographyBase>
              </span>
            </div>
          </div>

          {authMode === "login" ? (
            <LoginContainer onSuccess={loginCallback} />
          ) : (
            <RegisterContainer onSuccess={registerCallback} />
          )}

          <div className="text-center space-y-2">
            <TypographyBase className="text-muted-foreground">
              {authMode === "login" ? "Don't have an account?" : "Already have an account?"}
            </TypographyBase>
            <Button type="button" variant="link" onClick={toggleAuthMode} className="p-0 h-auto">
              <TypographyBase variant="medium">{authMode === "login" ? "Sign up here" : "Log in here"}</TypographyBase>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
