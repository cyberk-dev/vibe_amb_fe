import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { gameViewService } from "./game-views";
import {
  mapAllPlayers,
  mapAllPlayersWithSeats,
  mapAllPlayersWithVotes,
  mapVotingState,
  mapRoundPrizes,
  mapVictimsWithSeats,
  mapAllPlayersWithPrizes,
  mapAllPlayersWithTargets,
  type Victim,
} from "../lib/mappers";
import type {
  AdminGameState,
  Player,
  PlayerWithVote,
  PlayerWithTarget,
  VotingState,
  RoundPrizes,
  GameOverview,
  LeaderboardPlayer,
} from "../model/types";
import { GameStatus, Vote } from "@/integrations/aptos";

// Staggered polling to avoid thundering herd with concurrent users
// Returns a fixed interval with jitter (3-6s range)
const POLLING_BASE = 3000;
const POLLING_JITTER = 1500;
const pollingInterval = POLLING_BASE + Math.floor(Math.random() * POLLING_JITTER * 2 - POLLING_JITTER);

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

  // Player list with polling for waiting room and pass screen
  players: () =>
    queryOptions({
      queryKey: [...gameQueries.all(), "players"],
      queryFn: async (): Promise<Player[]> => {
        const dto = await gameViewService.getAllPlayers();
        return mapAllPlayers(dto);
      },
      staleTime: 1_000, // 1s - must be less than refetchInterval to actually poll
      refetchInterval: pollingInterval, // 1.5-4.5s jittered interval
      placeholderData: keepPreviousData,
    }),

  // Player list with target status (for pass screen - shows who has been selected)
  playersWithTargets: () =>
    queryOptions({
      queryKey: [...gameQueries.all(), "playersWithTargets"],
      queryFn: async (): Promise<PlayerWithTarget[]> => {
        const dto = await gameViewService.getAllPlayersWithTargets();
        return mapAllPlayersWithTargets(dto);
      },
      staleTime: 2_000,
      refetchInterval: 3_000, // Poll every 3s for real-time updates
      placeholderData: keepPreviousData,
    }),

  // Player list with seats (for reveal screen)
  playersWithSeats: () =>
    queryOptions({
      queryKey: [...gameQueries.all(), "playersWithSeats"],
      queryFn: async (): Promise<Player[]> => {
        const dto = await gameViewService.getAllPlayersWithSeats();
        return mapAllPlayersWithSeats(dto);
      },
      staleTime: 5_000,
    }),

  // Player list with votes (for decision screen)
  playersWithVotes: () =>
    queryOptions({
      queryKey: [...gameQueries.all(), "playersWithVotes"],
      queryFn: async (): Promise<PlayerWithVote[]> => {
        const dto = await gameViewService.getAllPlayersWithVotes();
        return mapAllPlayersWithVotes(dto);
      },
      staleTime: 3_000,
      refetchInterval: 5_000,
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

  // Current user's vote
  myVote: (address: string) =>
    queryOptions({
      queryKey: [...gameQueries.all(), "myVote", address],
      queryFn: async () => {
        const dto = await gameViewService.getVote(address);
        return {
          hasVoted: dto[0],
          vote: dto[1] as Vote,
        };
      },
      enabled: !!address,
      staleTime: 3_000,
      refetchInterval: 5_000,
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

  // Round victims with seats (optimized single call)
  victimsWithNames: () =>
    queryOptions({
      queryKey: [...gameQueries.all(), "victimsWithSeats"], // Changed key to bust cache
      queryFn: async (): Promise<Victim[]> => {
        const dto = await gameViewService.getRoundVictimsWithSeats();
        return mapVictimsWithSeats(dto);
      },
      staleTime: 5_000, // Allow refetch after 5s
    }),

  // Check if player has joined current game
  hasJoined: (address: string) =>
    queryOptions({
      queryKey: [...gameQueries.all(), "hasJoined", address],
      queryFn: () => {
        if (!address) throw new Error("Address required");
        return gameViewService.hasJoined(address);
      },
      enabled: !!address,
    }),

  // Check if player has set pending name
  hasPendingName: (address: string) =>
    queryOptions({
      queryKey: [...gameQueries.all(), "hasPendingName", address],
      queryFn: () => {
        if (!address) throw new Error("Address required");
        return gameViewService.hasPendingName(address);
      },
      enabled: !!address,
      retry: false,
    }),

  // Get player's pending name
  pendingName: (address: string) =>
    queryOptions({
      queryKey: [...gameQueries.all(), "pendingName", address],
      queryFn: () => {
        if (!address) throw new Error("Address required");
        return gameViewService.getPendingName(address);
      },
      enabled: !!address,
      retry: false,
    }),

  // Check if player has selected (acted) this round
  hasSelected: (address: string) =>
    queryOptions({
      queryKey: [...gameQueries.all(), "hasSelected", address],
      queryFn: () => {
        if (!address) throw new Error("Address required");
        return gameViewService.hasSelected(address);
      },
      enabled: !!address,
      staleTime: 3_000,
    }),

  // Check if player was eliminated (in fixed_players but not in players)
  isEliminated: (address: string) =>
    queryOptions({
      queryKey: [...gameQueries.all(), "isEliminated", address],
      queryFn: () => {
        if (!address) throw new Error("Address required");
        return gameViewService.isEliminated(address);
      },
      enabled: !!address,
      staleTime: 5_000,
      refetchInterval: 5_000,
    }),

  // Selection progress (how many players have chosen)
  selectionProgress: () =>
    queryOptions({
      queryKey: [...gameQueries.all(), "selectionProgress"],
      queryFn: async (): Promise<{ selected: number; total: number }> => {
        const dto = await gameViewService.getAllPlayers();
        const players = mapAllPlayers(dto);
        const selected = players.filter((p) => p.hasActed).length;
        return { selected, total: players.length };
      },
      staleTime: 3_000,
      refetchInterval: pollingInterval, // Jittered polling
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

  // All players with prizes (for game over leaderboard)
  leaderboard: () =>
    queryOptions({
      queryKey: [...gameQueries.all(), "leaderboard"],
      queryFn: async (): Promise<LeaderboardPlayer[]> => {
        const dto = await gameViewService.getAllPlayersWithPrizes();
        return mapAllPlayersWithPrizes(dto);
      },
      staleTime: 30_000,
    }),
};
