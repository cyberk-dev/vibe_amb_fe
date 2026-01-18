import Decimal from "decimal.js";
import type { AllPlayersDto, VotingStateDto, RoundPrizesDto } from "../api/dto/game.dto";
import type { Player, VotingState, RoundPrizes } from "../model/types";

export function mapAllPlayers(dto: AllPlayersDto): Player[] {
  return dto[0].map((address, index) => ({
    address,
    name: dto[1][index],
    hasActed: dto[2][index],
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
