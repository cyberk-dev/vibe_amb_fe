import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { gameViewService } from "./game-views";
import { mapAllPlayers, mapVotingState, mapRoundPrizes } from "../lib/mappers";
import type { AdminGameState, Player, VotingState, RoundPrizes, GameOverview } from "../model/types";
import { GameStatus } from "@/integrations/aptos";

// Staggered polling to avoid thundering herd with 20 concurrent users
const getPlayersPollingInterval = () => {
  const BASE_INTERVAL = 5000; // 5s base
  const JITTER = 1500; // ±1.5s random
  return BASE_INTERVAL + (Math.random() * JITTER * 2 - JITTER);
};

export const gameQueries = {
  // Base key
  all: () => ["game"] as const,

  // Game status (lightweight, frequent polling)
  status: () =>
    queryOptions({
      queryKey: [...gameQueries.all(), "status"],
      queryFn: async (): Promise<AdminGameState> => {
        const [status, round, playersCount, eliminationCount] = await Promise.all([
          gameViewService.getStatus(),
          gameViewService.getRound(),
          gameViewService.getPlayersCount(),
          gameViewService.getEliminationCount(),
        ]);
        return { status, round, playersCount, eliminationCount };
      },
      staleTime: 5_000, // 5s stale
      refetchInterval: 5_000, // Auto-refresh every 10s
    }),

  // Player list with staggered polling for waiting room
  players: () =>
    queryOptions({
      queryKey: [...gameQueries.all(), "players"],
      queryFn: async (): Promise<Player[]> => {
        const dto = await gameViewService.getAllPlayers();
        return mapAllPlayers(dto);
      },
      staleTime: 3_000, // Consider fresh for 3s (prevents rapid refetches)
      refetchInterval: getPlayersPollingInterval, // 3.5-6.5s random interval
      placeholderData: keepPreviousData,
    }),

  // Voting state (only relevant in VOTING phase)
  voting: () =>
    queryOptions({
      queryKey: [...gameQueries.all(), "voting"],
      queryFn: async (): Promise<VotingState> => {
        const dto = await gameViewService.getVotingState();
        return mapVotingState(dto);
      },
      staleTime: 5_000,
    }),

  // Prize info
  prizes: () =>
    queryOptions({
      queryKey: [...gameQueries.all(), "prizes"],
      queryFn: async (): Promise<RoundPrizes> => {
        const dto = await gameViewService.getRoundPrizes();
        return mapRoundPrizes(dto);
      },
      staleTime: 10_000,
    }),

  // Round victims (after reveal)
  victims: () =>
    queryOptions({
      queryKey: [...gameQueries.all(), "victims"],
      queryFn: async (): Promise<string[]> => {
        return gameViewService.getRoundVictims();
      },
      staleTime: 30_000,
    }),

  // Check if player has joined current game
  hasJoined: (address: string) =>
    queryOptions({
      queryKey: [...gameQueries.all(), "hasJoined", address],
      queryFn: () => gameViewService.hasJoined(address),
      enabled: !!address,
    }),

  // Full overview (for dashboard)
  overview: () =>
    queryOptions({
      queryKey: [...gameQueries.all(), "overview"],
      queryFn: async (): Promise<GameOverview> => {
        const [status, round, playersCount, eliminationCount, playersDto, prizesDto] = await Promise.all([
          gameViewService.getStatus(),
          gameViewService.getRound(),
          gameViewService.getPlayersCount(),
          gameViewService.getEliminationCount(),
          gameViewService.getAllPlayers(),
          gameViewService.getRoundPrizes(),
        ]);

        const base: GameOverview = {
          status,
          round,
          playersCount,
          eliminationCount,
          players: mapAllPlayers(playersDto),
          prizes: mapRoundPrizes(prizesDto),
        };

        // Fetch additional data based on status
        if (status === GameStatus.VOTING) {
          const votingDto = await gameViewService.getVotingState();
          base.voting = mapVotingState(votingDto);
        }

        if (status === GameStatus.REVEALING || status === GameStatus.VOTING) {
          base.victims = await gameViewService.getRoundVictims();
        }

        return base;
      },
      staleTime: 5_000,
      refetchInterval: 10_000,
    }),
};
