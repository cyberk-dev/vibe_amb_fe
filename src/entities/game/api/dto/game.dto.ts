// Raw response types from contract view functions

export interface PlayerStatusesDto {
  0: string[]; // vector<address> - players
  1: boolean[]; // vector<bool> - hasActed statuses
}

export interface VotingStateDto {
  0: string; // u64 - stopCount
  1: string; // u64 - continueCount
  2: string; // u64 - missingCount
}

export interface RoundPrizesDto {
  0: string; // u64 - consolationPrize
  1: string; // u64 - remainingPool
}

export interface VoteDto {
  0: boolean; // hasVoted
  1: number; // vote (0 or 1)
}
