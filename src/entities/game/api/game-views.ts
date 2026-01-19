import { GAME_MODULE, GameStatus } from "@/integrations/aptos";
import { viewProxy } from "@/integrations/aptos/utils/view-proxy";
import type {
  AllPlayersDto,
  VotingStateDto,
  RoundPrizesDto,
  VoteDto,
  VictimsWithNamesDto,
  VictimsWithSeatsDto,
  AllPlayersWithSeatsDto,
  AllPlayersWithVotesDto,
  AllPlayersWithPrizesDto,
} from "./dto/game.dto";

class GameViewService {
  async getStatus(): Promise<GameStatus> {
    const [status] = await viewProxy<[number]>({
      function: `${GAME_MODULE}::get_status`,
      typeArguments: [],
      functionArguments: [],
    });
    return status as GameStatus;
  }

  async getRound(): Promise<number> {
    const [round] = await viewProxy<[number]>({
      function: `${GAME_MODULE}::get_round`,
      typeArguments: [],
      functionArguments: [],
    });
    return round;
  }

  async getPlayersCount(): Promise<number> {
    const [count] = await viewProxy<[string]>({
      function: `${GAME_MODULE}::get_players_count`,
      typeArguments: [],
      functionArguments: [],
    });
    return Number(count);
  }

  async getEliminationCount(): Promise<number> {
    const [count] = await viewProxy<[string]>({
      function: `${GAME_MODULE}::get_elimination_count`,
      typeArguments: [],
      functionArguments: [],
    });
    return Number(count);
  }

  async getAllPlayers(): Promise<AllPlayersDto> {
    const result = await viewProxy<[string[], string[], boolean[]]>({
      function: `${GAME_MODULE}::get_all_players`,
      typeArguments: [],
      functionArguments: [],
    });
    return { 0: result[0], 1: result[1], 2: result[2] };
  }

  async getAllPlayersWithSeats(): Promise<AllPlayersWithSeatsDto> {
    const result = await viewProxy<[string[], string[], boolean[], string[]]>({
      function: `${GAME_MODULE}::get_all_players_with_seats`,
      typeArguments: [],
      functionArguments: [],
    });
    return { 0: result[0], 1: result[1], 2: result[2], 3: result[3] };
  }

  async getAllPlayersWithVotes(): Promise<AllPlayersWithVotesDto> {
    const result = await viewProxy<[string[], string[], string[], boolean[], string]>({
      function: `${GAME_MODULE}::get_all_players_with_votes`,
      typeArguments: [],
      functionArguments: [],
    });
    return { 0: result[0], 1: result[1], 2: result[2], 3: result[3], 4: result[4] };
  }

  async hasSelected(playerAddress: string): Promise<boolean> {
    const [hasActed] = await viewProxy<[boolean]>({
      function: `${GAME_MODULE}::has_selected`,
      typeArguments: [],
      functionArguments: [playerAddress],
    });
    return hasActed;
  }

  async hasJoined(playerAddress: string): Promise<boolean> {
    const [hasJoined] = await viewProxy<[boolean]>({
      function: `${GAME_MODULE}::has_joined`,
      typeArguments: [],
      functionArguments: [playerAddress],
    });
    return hasJoined;
  }

  async hasPendingName(playerAddress: string): Promise<boolean> {
    const [has] = await viewProxy<[boolean]>({
      function: `${GAME_MODULE}::has_pending_name`,
      typeArguments: [],
      functionArguments: [playerAddress],
    });
    return has;
  }

  async getPendingName(playerAddress: string): Promise<string> {
    const [name] = await viewProxy<[string]>({
      function: `${GAME_MODULE}::get_pending_name`,
      typeArguments: [],
      functionArguments: [playerAddress],
    });
    return name;
  }

  async getVotingState(): Promise<VotingStateDto> {
    const result = await viewProxy<[string, string, string]>({
      function: `${GAME_MODULE}::get_voting_state`,
      typeArguments: [],
      functionArguments: [],
    });
    return { 0: result[0], 1: result[1], 2: result[2] };
  }

  async getRoundPrizes(): Promise<RoundPrizesDto> {
    const result = await viewProxy<[string, string]>({
      function: `${GAME_MODULE}::get_round_prizes`,
      typeArguments: [],
      functionArguments: [],
    });
    return { 0: result[0], 1: result[1] };
  }

  async getRoundVictims(): Promise<string[]> {
    const [victims] = await viewProxy<[string[]]>({
      function: `${GAME_MODULE}::get_round_victims`,
      typeArguments: [],
      functionArguments: [],
    });
    return victims;
  }

  async getRoundVictimsWithNames(): Promise<VictimsWithNamesDto> {
    const result = await viewProxy<[string[], string[]]>({
      function: `${GAME_MODULE}::get_round_victims_with_names`,
      typeArguments: [],
      functionArguments: [],
    });
    return { 0: result[0], 1: result[1] };
  }

  async getRoundVictimsWithSeats(): Promise<VictimsWithSeatsDto> {
    const result = await viewProxy<[string[], string[], string[]]>({
      function: `${GAME_MODULE}::get_round_victims_with_seats`,
      typeArguments: [],
      functionArguments: [],
    });
    return { 0: result[0], 1: result[1], 2: result[2] };
  }

  async getPlayerInfo(playerAddress: string): Promise<{ name: string; acted: boolean }> {
    const result = await viewProxy<[string, boolean, { vec: string[] }]>({
      function: `${GAME_MODULE}::get_player_info`,
      typeArguments: [],
      functionArguments: [playerAddress],
    });
    return { name: result[0], acted: result[1] };
  }

  async getVote(playerAddress: string): Promise<VoteDto> {
    const result = await viewProxy<[boolean, number]>({
      function: `${GAME_MODULE}::get_vote`,
      typeArguments: [],
      functionArguments: [playerAddress],
    });
    return { 0: result[0], 1: result[1] };
  }

  async getAllPlayersWithPrizes(): Promise<AllPlayersWithPrizesDto> {
    const result = await viewProxy<[string[], string[], string[], boolean[], string[]]>({
      function: `${GAME_MODULE}::get_all_players_with_prizes`,
      typeArguments: [],
      functionArguments: [],
    });
    return { 0: result[0], 1: result[1], 2: result[2], 3: result[3], 4: result[4] };
  }
}

export const gameViewService = new GameViewService();
