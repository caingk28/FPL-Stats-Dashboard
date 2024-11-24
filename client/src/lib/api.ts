const API_BASE = "/api";

export async function fetchLeagueStandings(leagueId: string) {
  const response = await fetch(`${API_BASE}/leagues/${leagueId}/standings`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch league standings' }));
    throw new Error(error.error || 'Failed to fetch league standings');
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
