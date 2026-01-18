import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import {
  GasStationClient,
  GasStationTransactionSubmitter,
} from "@aptos-labs/gas-station-client";

const NETWORK =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
    ? Network.MAINNET
    : Network.TESTNET;

function createAptosClient(): Aptos {
  const gasStationApiKey = process.env.NEXT_PUBLIC_APTOS_GAS_STATION_API_KEY;

  if (gasStationApiKey) {
    const gasStationClient = new GasStationClient({
      network: NETWORK,
      apiKey: gasStationApiKey,
    });

    const config = new AptosConfig({
      network: NETWORK,
      pluginSettings: {
        TRANSACTION_SUBMITTER: new GasStationTransactionSubmitter(gasStationClient),
      },
    });

    return new Aptos(config);
  }

  // Fallback without Gas Station
  console.warn("Gas Station API key not set. Transactions will not be sponsored.");
  return new Aptos(new AptosConfig({ network: NETWORK }));
}

// Singleton instance
export const aptosClient = createAptosClient();

export function getAptosClient(): Aptos {
  return aptosClient;
}

export { NETWORK };
