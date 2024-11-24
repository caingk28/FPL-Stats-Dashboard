const FPL_API_BASE = "https://fantasy.premierleague.com/api";

export async function fetchLeagueStandings(leagueId: string) {
  const response = await fetch(`${FPL_API_BASE}/leagues-classic/${leagueId}/standings/`);
  if (!response.ok) {
    throw new Error('Failed to fetch league standings');
  }
  return response.json();
}

export async function fetchTeamStats(leagueId: string) {
  const response = await fetch(`/api/team-stats/${leagueId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch team stats');
  }
  return response.json();
}

export async function fetchManagerHistory(leagueId: string) {
  const response = await fetch(`/api/manager-history/${leagueId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch manager history');
  }
  return response.json();
}
