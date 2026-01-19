// Raw response types from contract view functions

export interface AllPlayersDto {
  0: string[]; // vector<address> - addresses
  1: string[]; // vector<String> - names (NEW in v5)
  2: boolean[]; // vector<bool> - hasActed statuses
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

export interface VictimsWithNamesDto {
  0: string[]; // vector<address> - victim addresses
  1: string[]; // vector<String> - victim names
}

export interface VictimsWithSeatsDto {
  0: string[]; // vector<address> - victim addresses
  1: string[]; // vector<String> - victim names
  2: string[]; // vector<u64> - seat numbers (initial_bao_id)
}

export interface AllPlayersWithSeatsDto {
  0: string[]; // vector<address> - addresses
  1: string[]; // vector<String> - names
  2: boolean[]; // vector<bool> - hasActed statuses
  3: string[]; // vector<u64> - seat numbers (initial_bao_id)
}

export interface AllPlayersWithVotesDto {
  0: string[]; // vector<address> - addresses
  1: string[]; // vector<String> - names
  2: string[]; // vector<u64> - seats (initial_bao_id)
  3: boolean[]; // vector<bool> - hasVoted
  4: string; // vector<u8> as hex string - votes (0=STOP, 1=CONTINUE)
}

export interface AllPlayersWithPrizesDto {
  0: string[]; // vector<address> - addresses (all participants, join order)
  1: string[]; // vector<String> - names
  2: string[]; // vector<u64> - seats (initial_bao_id, 0-indexed)
  3: boolean[]; // vector<bool> - is_eliminated
  4: string[]; // vector<u64> - prizes (claimable balance)
}

export interface AllPlayersWithTargetsDto {
  0: string[]; // vector<address> - addresses
  1: string[]; // vector<String> - names
  2: string[]; // vector<u64> - seats (initial_bao_id)
  3: boolean[]; // vector<bool> - hasActed statuses
  4: boolean[]; // vector<bool> - isTarget (has been selected as target)
}
