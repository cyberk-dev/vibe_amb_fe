"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { toast } from "sonner";
import { GAME_MODULE, APTOS_NETWORK, GameStatus } from "./config";

// Initialize Aptos client
const aptosConfig = new AptosConfig({
  network: (APTOS_NETWORK === "mainnet" ? Network.MAINNET : Network.TESTNET) as Network,
});
const aptos = new Aptos(aptosConfig);

/**
 * Hook to get game status
 */
export const useGameStatus = () => {
  return useQuery({
    queryKey: ["game", "status"],
    queryFn: async () => {
      const response = await aptos.view({
        payload: {
          function: `${GAME_MODULE}::get_status`,
          typeArguments: [],
          functionArguments: [],
        },
      });
      return response[0] as number as GameStatus;
    },
    refetchInterval: 3000, // Poll every 3 seconds
  });
};

/**
 * Hook to get players count
 */
export const usePlayersCount = () => {
  return useQuery({
    queryKey: ["game", "players_count"],
    queryFn: async () => {
      const response = await aptos.view({
        payload: {
          function: `${GAME_MODULE}::get_players_count`,
          typeArguments: [],
          functionArguments: [],
        },
      });
      return response[0] as number;
    },
    refetchInterval: 3000, // Poll every 3 seconds
  });
};

/**
 * Hook to join the game
 */
export const useJoinGame = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (transactionHash: string) => void;
  onError?: (error: Error) => void;
} = {}) => {
  const { account, signAndSubmitTransaction } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      if (!signAndSubmitTransaction) {
        throw new Error("Wallet does not support transaction signing");
      }

      const response = await signAndSubmitTransaction({
        sender: account.address.toString(),
        data: {
          function: `${GAME_MODULE}::join_game`,
          typeArguments: [],
          functionArguments: [],
        },
      });

      // Wait for transaction confirmation
      await aptos.waitForTransaction({
        transactionHash: response.hash,
      });

      return response.hash;
    },
    onSuccess: (transactionHash) => {
      toast.success("Successfully joined the game!", {
        description: `Transaction: ${transactionHash}`,
      });
      // Invalidate queries to refetch game state
      queryClient.invalidateQueries({ queryKey: ["game"] });
      onSuccess?.(transactionHash);
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Failed to join game";

      // Map common error codes to user-friendly messages
      let userMessage = errorMessage;
      if (errorMessage.includes("2001")) {
        userMessage = "Cannot join - game has already started";
      } else if (errorMessage.includes("2002")) {
        userMessage = "You have already joined this game";
      } else if (errorMessage.includes("E_GAME_NOT_PENDING")) {
        userMessage = "Cannot join - game has already started";
      } else if (errorMessage.includes("E_PLAYER_ALREADY_JOINED")) {
        userMessage = "You have already joined this game";
      }

      toast.error("Failed to join game", {
        description: userMessage,
      });
      onError?.(error);
    },
  });
};
