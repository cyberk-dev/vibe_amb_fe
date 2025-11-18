import SocialCallbackContainer from "./_container/social-callback-container";

/**
 * OAuth Callback Page
 *
 * Dynamic route that handles OAuth callbacks from various providers
 * Route: /auth/[provider]/callback
 *
 * Examples:
 * - /auth/google/callback
 * - /auth/facebook/callback
 * - /auth/github/callback
 */
const SocialCallbackPage = () => {
  return <SocialCallbackContainer />;
};

export default SocialCallbackPage;
