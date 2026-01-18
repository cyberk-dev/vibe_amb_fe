import Decimal from "decimal.js";
import type {
  AllPlayersDto,
  VotingStateDto,
  RoundPrizesDto,
  VictimsWithNamesDto,
  VictimsWithSeatsDto,
  AllPlayersWithSeatsDto,
  AllPlayersWithVotesDto,
  AllPlayersWithPrizesDto,
} from "../api/dto/game.dto";
import type { Player, PlayerWithVote, VotingState, RoundPrizes, Vote, LeaderboardPlayer } from "../model/types";

export interface Victim {
  address: string;
  name: string;
  seat: number;
}

export function mapAllPlayers(dto: AllPlayersDto): Player[] {
  return dto[0].map((address, index) => ({
    address,
    name: dto[1][index],
    hasActed: dto[2][index],
  }));
}

export function mapAllPlayersWithSeats(dto: AllPlayersWithSeatsDto): Player[] {
  return dto[0].map((address, index) => ({
    address,
    name: dto[1][index],
    hasActed: dto[2][index],
    seat: Number(dto[3][index]),
  }));
}

export function mapAllPlayersWithVotes(dto: AllPlayersWithVotesDto): PlayerWithVote[] {
  // Parse hex string votes (0x0001010101) to number array
  const votesHex = dto[4].slice(2); // Remove 0x prefix
  const votes: number[] = [];
  for (let i = 0; i < votesHex.length; i += 2) {
    votes.push(parseInt(votesHex.substring(i, i + 2), 16));
  }

  return dto[0].map((address, index) => ({
    address,
    name: dto[1][index],
    hasActed: false, // Not returned in this view
    seat: Number(dto[2][index]),
    hasVoted: dto[3][index],
    vote: dto[3][index] ? (votes[index] as Vote) : undefined,
  }));
}

export function mapVotingState(dto: VotingStateDto): VotingState {
  const stopCount = Number(dto[0]);
  const continueCount = Number(dto[1]);
  const missingCount = Number(dto[2]);

  return {
    stopCount,
    continueCount,
    missingCount,
    total: stopCount + continueCount + missingCount,
  };
}

export function mapRoundPrizes(dto: RoundPrizesDto): RoundPrizes {
  return {
    consolationPrize: BigInt(dto[0]),
    remainingPool: BigInt(dto[1]),
  };
}

export function mapVictimsWithNames(dto: VictimsWithNamesDto): Victim[] {
  return dto[0].map((address, index) => ({
    address,
    name: dto[1][index],
    seat: 0, // deprecated - use mapVictimsWithSeats
  }));
}

export function mapVictimsWithSeats(dto: VictimsWithSeatsDto): Victim[] {
  return dto[0].map((address, index) => ({
    address,
    name: dto[1][index],
    seat: Number(dto[2][index]),
  }));
}

export function mapAllPlayersWithPrizes(dto: AllPlayersWithPrizesDto): LeaderboardPlayer[] {
  return dto[0].map((address, index) => ({
    address,
    name: dto[1][index],
    seat: Number(dto[2][index]),
    isEliminated: dto[3][index],
    prize: BigInt(dto[4][index]),
  }));
}

// Format APT amount (8 decimals) for display
export function formatAptAmount(amount: bigint): string {
  const decimal = new Decimal(amount.toString()).div(1e8);
  const formatted = decimal.toFixed();

  // Remove trailing zeros after decimal point, but keep at least one decimal if needed
  const cleaned = formatted.includes(".") ? formatted.replace(/\.?0+$/, "") : formatted;

  return `${cleaned || "0"} APT`;
}

// Truncate address for display
export function truncateAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
