const API_BASE = "/api";

export interface League {
  id: number;
  name: string;
  entry_rank: number;
  entry_last_rank: number;
  total_teams: number;
}

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
  isCaptain: boolean;
  multiplier?: number;
  stats: Partial<PlayerStats>;
}

export interface PlayerStats {
  minutes: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  goals_conceded: number;
  own_goals: number;
  penalties_saved: number;
  penalties_missed: number;
  yellow_cards: number;
  red_cards: number;
  saves: number;
  bonus: number;
  bps: number;
  total_points: number;
}

export interface SquadResponse {
  picks: PlayerScore[];
  totalPoints: number;
  bank: number;
  event: number;
}

async function handleApiResponse<T>(response: Response, errorMessage: string): Promise<T> {
  if (!response.ok) {
    console.error(`API Error (${response.status}):`, await response.text());
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function fetchManagerLeagues(managerId: string): Promise<League[]> {
  const response = await fetch(`${API_BASE}/manager/${managerId}/leagues`);
  return handleApiResponse<League[]>(response, 'Failed to fetch manager leagues');
}

export async function fetchLeagueStandings(leagueId: string): Promise<LeagueStandingsResponse> {
  const response = await fetch(`${API_BASE}/leagues/${leagueId}/standings`);
  return handleApiResponse<LeagueStandingsResponse>(response, 'Failed to fetch league standings');
}

export async function fetchTeamStats(managerId: string): Promise<TeamStatsResponse> {
  const response = await fetch(`${API_BASE}/team-stats/${managerId}`);
  return handleApiResponse<TeamStatsResponse>(response, 'Failed to fetch team stats');
}

export async function fetchManagerHistory(managerId: string): Promise<ManagerHistoryResponse> {
  const response = await fetch(`${API_BASE}/manager-history/${managerId}`);
  return handleApiResponse<ManagerHistoryResponse>(response, 'Failed to fetch manager history');
}

export async function fetchSquad(managerId: string): Promise<SquadResponse> {
  const response = await fetch(`${API_BASE}/squad/${managerId}`);
  return handleApiResponse<SquadResponse>(response, 'Failed to fetch squad data');
}
