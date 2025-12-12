"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Typography3XL, TypographyBase } from "@/components/typography";
import { authCallback, initProfile } from "@/integrations/api";
import { setAuthData, signOut } from "@/stores/auth-store";
import { Card, CardContent } from "@/components/ui/card";

const SocialCallbackContainer = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const promiseRef = useRef<Promise<void> | null>(null);

  const provider = params?.provider as string;

  const handleCallback = async () => {
    // Prevent duplicate execution
    if (promiseRef.current) {
      return promiseRef.current;
    }

    const promise = (async () => {
      try {
        if (typeof window === "undefined") return;

        // Try to get access_token from URL hash first (for implicit flow)
        const fragment = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(fragment);
        let oauthAccessToken = hashParams.get("access_token");

        // If not in hash, try query params (for authorization code flow)
        if (!oauthAccessToken) {
          oauthAccessToken = searchParams.get("access_token");
        }

        // Check for OAuth errors
        const error = hashParams.get("error") || searchParams.get("error");
        if (error) {
          const errorDescription =
            hashParams.get("error_description") || searchParams.get("error_description") || error;
          throw new Error(errorDescription);
        }

        if (!oauthAccessToken) {
          throw new Error("No access token found in callback URL");
        }

        if (!provider) {
          throw new Error("Provider not specified");
        }

        // Exchange OAuth token for app tokens via backend
        const authResponse = await authCallback({
          provider: provider,
          accessToken: oauthAccessToken,
        });

        let jwt = authResponse.jwt;
        let jwtRefresh = authResponse.jwtRefresh;
        let { user } = authResponse;

        // Initialize profile if not exists
        if (!authResponse.user?.profileId && jwt) {
          const initProfileResponse = await initProfile(jwt);
          const { jwt: newJwt, jwtRefresh: newJwtRefresh, user: newUser } = initProfileResponse;

          if (!newJwt || !newJwtRefresh || !newUser) {
            throw new Error("Failed to initialize user profile");
          }

          jwt = newJwt;
          jwtRefresh = newJwtRefresh;
          user = newUser;
        }

        if (!jwt || !jwtRefresh) {
          throw new Error("Authentication failed: Missing tokens");
        }

        // Save authentication data
        setAuthData({
          accessToken: jwt,
          refreshToken: jwtRefresh,
          user,
        });

        toast.success(`Successfully logged in with ${provider}!`);

        // Small delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Redirect to protected page
        router.push("/protected");
      } catch (error) {
        console.error(`${provider} OAuth callback error:`, error);
        signOut();

        const errorMessage = error instanceof Error ? error.message : "Authentication failed";
        toast.error(errorMessage);

        // Redirect back to login
        setTimeout(() => {
          router.push("/auth");
        }, 1500);
      } finally {
        promiseRef.current = null;
      }
    })();

    promiseRef.current = promise;
    return promise;
  };

  useEffect(() => {
    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center space-y-2">
              <Typography3XL as="h1">Signing In...</Typography3XL>
              <TypographyBase className="text-muted-foreground">Completing {provider} authentication</TypographyBase>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialCallbackContainer;
