import { useState } from "react";
import { toast } from "sonner";

/**
 * Hook for handling Google OAuth login with redirect flow
 *
 * This hook redirects the user to Google OAuth, and Google redirects back
 * to /auth/google/callback which handles the token exchange
 *
 * Setup instructions:
 * 1. Get Google OAuth credentials at https://console.cloud.google.com
 * 2. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env files
 * 3. Configure authorized redirect URIs in Google Console:
 *    - http://localhost:3000/auth/google/callback (development)
 *    - https://yourdomain.com/auth/google/callback (production)
 * 4. Your backend should implement: GET /auth/google/callback?access_token={token}
 */
export const useGoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      if (!clientId) {
        toast.error(
          "Google OAuth is not configured. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your environment variables.",
        );
        return;
      }

      setIsLoading(true);

      // Build the Google OAuth URL with redirect to our callback page
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const scope = "openid email profile";
      const responseType = "token"; // Use implicit flow for direct access token
      const state = Math.random().toString(36).substring(7);

      // Store state for CSRF protection (optional)
      sessionStorage.setItem("google_oauth_state", state);

      // Build OAuth URL
      const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      googleAuthUrl.searchParams.append("client_id", clientId);
      googleAuthUrl.searchParams.append("redirect_uri", redirectUri);
      googleAuthUrl.searchParams.append("response_type", responseType);
      googleAuthUrl.searchParams.append("scope", scope);
      googleAuthUrl.searchParams.append("state", state);
      googleAuthUrl.searchParams.append("prompt", "select_account");

      // Redirect to Google OAuth
      window.location.href = googleAuthUrl.toString();
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Failed to initiate Google login");
      setIsLoading(false);
    }
  };

  return {
    handleGoogleLogin,
    isLoading,
  };
};
