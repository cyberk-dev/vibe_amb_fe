import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { GasStationClient, GasStationTransactionSubmitter } from "@aptos-labs/gas-station-client";

const NETWORK = process.env.NEXT_PUBLIC_APTOS_NETWORK === "mainnet" ? Network.MAINNET : Network.TESTNET;

// API key for rate limit bypass
const API_KEY = process.env.NEXT_PUBLIC_APTOS_API_KEY;

function createAptosClient(): Aptos {
  const gasStationApiKey = process.env.NEXT_PUBLIC_APTOS_GAS_STATION_API_KEY;

  // Base client config with API key for rate limiting
  // Add Origin header for server-side requests (Aptos API requires it)
  // Use localhost for development, production URL for production
  const getOrigin = () => {
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL;
    }
    // Development: use localhost
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3000";
    }
    // Production fallback
    return "https://vibe-amb-fe.vercel.app";
  };

  const origin = getOrigin();
  const clientConfig = API_KEY
    ? {
        API_KEY,
        HEADERS: {
          Origin: origin,
        },
      }
    : {
        HEADERS: {
          Origin: origin,
        },
      };

  if (gasStationApiKey) {
    const gasStationClient = new GasStationClient({
      network: NETWORK,
      apiKey: gasStationApiKey,
    });

    const config = new AptosConfig({
      network: NETWORK,
      clientConfig,
      pluginSettings: {
        TRANSACTION_SUBMITTER: new GasStationTransactionSubmitter(gasStationClient),
      },
    });

    return new Aptos(config);
  }

  // Fallback without Gas Station
  if (!API_KEY) {
    console.warn("Aptos API key not set. Requests may be rate limited.");
  }

  return new Aptos(
    new AptosConfig({
      network: NETWORK,
      clientConfig,
    }),
  );
}

// Singleton instance
export const aptosClient = createAptosClient();

export function getAptosClient(): Aptos {
  return aptosClient;
}

export { NETWORK };
