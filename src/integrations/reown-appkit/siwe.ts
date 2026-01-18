import {
  SIWECreateMessageArgs,
  SIWESession,
  SIWEVerifyMessageArgs,
  createSIWEConfig,
  formatMessage,
} from "@reown/appkit-siwe";
import {
  getAccessToken,
  getUser,
  setTokens,
  setUser,
  signOut,
  getNonce,
  initProfile,
  signout as signoutApi,
  verifySiwe,
} from "@/entities/auth";
import { mainnet } from "@reown/appkit/networks";

const defaultChainId = mainnet.id;

// Callback function to be called after successful login
let onLoginSuccess: (() => void) | null = null;

export function setSiweLoginCallback(callback: (() => void) | null) {
  onLoginSuccess = callback;
}

async function getSession() {
  const user = getUser();
  const accessToken = getAccessToken();

  if (!user || !accessToken) {
    return null;
  }

  return {
    address: user?.walletAddress,
    chainId: defaultChainId,
  } as SIWESession;
}

async function verifyMessage({ message, signature }: SIWEVerifyMessageArgs) {
  try {
    let res = await verifySiwe({ message, signature });

    if (res.jwt && res.user) {
      if (!res.user.profileId) {
        res = await initProfile(res.jwt);
        setTokens(res.jwt ?? "", res.jwtRefresh ?? "");
        setUser({ profileId: res.user?.profileId, walletAddress: res.user?.walletAddress });
      } else {
        setTokens(res.jwt ?? "", res.jwtRefresh ?? "");
        setUser({ profileId: res.user?.profileId, walletAddress: res.user?.walletAddress });
      }

      // Call the login callback if it exists
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
}

export const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: window.location.host,
    uri: window.location.origin,
    chains: [defaultChainId],
    statement: "Please sign with your account",
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) => {
    return formatMessage(args, address);
  },
  getNonce: async (address?: string) => {
    const res = await getNonce(address);
    if (!res.nonce) {
      throw new Error("Failed to get nonce!");
    }
    return res.nonce;
  },
  getSession,
  verifyMessage,
  signOut: async () => {
    try {
      await signoutApi();
    } catch (error) {
      console.error("Signout error:", error);
    }

    signOut();
    return true;
  },
});
