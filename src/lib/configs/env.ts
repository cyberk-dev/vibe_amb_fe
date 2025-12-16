const requiredEnvVars = {
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_IS_TESTNET: process.env.NEXT_PUBLIC_IS_TESTNET,
} as const;

const validateEnvVars = () => {
  const missing = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` + "Please check your .env.local file.",
    );
  }
};

validateEnvVars();

export const env = requiredEnvVars;
