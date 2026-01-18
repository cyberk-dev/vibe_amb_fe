import { getAptosClient, GAME_MODULE, GameStatus } from "@/integrations/aptos";
import type { PlayerStatusesDto, VotingStateDto, RoundPrizesDto, VoteDto } from "./dto/game.dto";

class GameViewService {
  private get aptos() {
    return getAptosClient();
  }

  async getStatus(): Promise<GameStatus> {
    const [status] = await this.aptos.view<[number]>({
      payload: {
        function: `${GAME_MODULE}::get_status`,
        typeArguments: [],
        functionArguments: [],
      },
    });
    return status as GameStatus;
  }

  async getRound(): Promise<number> {
    const [round] = await this.aptos.view<[number]>({
      payload: {
        function: `${GAME_MODULE}::get_round`,
        typeArguments: [],
        functionArguments: [],
      },
    });
    return round;
  }

  async getPlayersCount(): Promise<number> {
    const [count] = await this.aptos.view<[string]>({
      payload: {
        function: `${GAME_MODULE}::get_players_count`,
        typeArguments: [],
        functionArguments: [],
      },
    });
    return Number(count);
  }

  async getEliminationCount(): Promise<number> {
    const [count] = await this.aptos.view<[string]>({
      payload: {
        function: `${GAME_MODULE}::get_elimination_count`,
        typeArguments: [],
        functionArguments: [],
      },
    });
    return Number(count);
  }

  async getPlayerStatuses(): Promise<PlayerStatusesDto> {
    const result = await this.aptos.view<[string[], boolean[]]>({
      payload: {
        function: `${GAME_MODULE}::get_player_statuses`,
        typeArguments: [],
        functionArguments: [],
      },
    });
    return { 0: result[0], 1: result[1] };
  }

  async getPlayerStatus(playerAddress: string): Promise<boolean> {
    const [hasActed] = await this.aptos.view<[boolean]>({
      payload: {
        function: `${GAME_MODULE}::get_player_status`,
        typeArguments: [],
        functionArguments: [playerAddress],
      },
    });
    return hasActed;
  }

  async getVotingState(): Promise<VotingStateDto> {
    const result = await this.aptos.view<[string, string, string]>({
      payload: {
        function: `${GAME_MODULE}::get_voting_state`,
        typeArguments: [],
        functionArguments: [],
      },
    });
    return { 0: result[0], 1: result[1], 2: result[2] };
  }

  async getRoundPrizes(): Promise<RoundPrizesDto> {
    const result = await this.aptos.view<[string, string]>({
      payload: {
        function: `${GAME_MODULE}::get_round_prizes`,
        typeArguments: [],
        functionArguments: [],
      },
    });
    return { 0: result[0], 1: result[1] };
  }

  async getRoundVictims(): Promise<string[]> {
    const [victims] = await this.aptos.view<[string[]]>({
      payload: {
        function: `${GAME_MODULE}::get_round_victims`,
        typeArguments: [],
        functionArguments: [],
      },
    });
    return victims;
  }

  async getVote(playerAddress: string): Promise<VoteDto> {
    const result = await this.aptos.view<[boolean, number]>({
      payload: {
        function: `${GAME_MODULE}::get_vote`,
        typeArguments: [],
        functionArguments: [playerAddress],
      },
    });
    return { 0: result[0], 1: result[1] };
  }
}

export const gameViewService = new GameViewService();
