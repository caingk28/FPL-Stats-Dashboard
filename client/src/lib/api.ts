const API_BASE = "/api";

export interface StandingsEntry {
  entry: number;
  entry_name: string;
  player_name: string;
  rank: number;
  total: number;
  last_rank: number;
  event_total: number;
}

export interface LeagueStandingsResponse {
  league: {
    id: number;
    name: string;
    created: string;
    closed: boolean;
  };
  standings: {
    has_next: boolean;
    page: number;
    results: StandingsEntry[];
  };
}

export interface TeamStatsResponse {
  averagePoints: number;
  highestScore: number;
  totalTeams: number;
  totalTransfers: number;
  bestGameweekScore: number;
  overallRank: number;
  teamValue: number;
}

export interface ManagerHistoryEntry {
  event: number;
  points: number;
  total_points: number;
  rank: number;
  rank_sort: number;
  overall_rank: number;
  bank: number;
  value: number;
  event_transfers: number;
  event_transfers_cost: number;
  points_on_bench: number;
}

export interface ManagerHistoryResponse {
  history: ManagerHistoryEntry[];
  chips: Array<{
    name: string;
    event: number;
    time: string;
  }>;
  transfers: Array<{
    id: number;
    event: number;
    playerIn: string;
    playerOut: string;
    pointsImpact: number;
  }>;
  captains: Array<{
    event: number;
    playerName: string;
    points: number;
  }>;
}

async function handleApiResponse<T>(response: Response, errorMessage: string): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: errorMessage }));
    throw new Error(error.error || errorMessage);
  }
  return response.json();
}

export async function fetchLeagueStandings(leagueId: string): Promise<LeagueStandingsResponse> {
  const response = await fetch(`${API_BASE}/leagues/${leagueId}/standings`);
  return handleApiResponse<LeagueStandingsResponse>(response, 'Failed to fetch league standings');
}

export async function fetchTeamStats(leagueId: string): Promise<TeamStatsResponse> {
  const response = await fetch(`${API_BASE}/team-stats/${leagueId}`);
  return handleApiResponse<TeamStatsResponse>(response, 'Failed to fetch team stats');
}

export async function fetchManagerHistory(leagueId: string): Promise<ManagerHistoryResponse> {
  const response = await fetch(`${API_BASE}/manager-history/${leagueId}`);
  return handleApiResponse<ManagerHistoryResponse>(response, 'Failed to fetch manager history');
}
export interface PlayerScore {
  id: number;
  name: string;
  position: string;
  team: string;
  points: number;
  price: number;
  form: string;
  selected_by: string;
  isPlayed: boolean;
  isCaptain?: boolean;
}

export interface SquadResponse {
  picks: PlayerScore[];
  totalPoints: number;
  bank: number;
}

export async function fetchSquad(managerId: string): Promise<SquadResponse> {
  const response = await fetch(`${API_BASE}/squad/${managerId}`);
  return handleApiResponse<SquadResponse>(response, 'Failed to fetch squad data');
}
