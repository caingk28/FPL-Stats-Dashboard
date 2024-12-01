import express, { Express } from "express";

const FPL_API = "https://fantasy.premierleague.com/api";

// Helper function for FPL API requests
async function fplFetch(url: string) {
  console.log(`[FPL] Requesting: ${url}`);
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    console.error(`[FPL] Error ${response.status}:`, await response.text());
    throw new Error(`FPL API request failed: ${response.status}`);
  }

  return response.json();
}

export function registerRoutes(app: Express) {
  // Get manager's leagues
  app.get("/api/manager/:managerId/leagues", async (req, res) => {
    try {
      const managerId = req.params.managerId;
      console.log(`[Leagues] Fetching for manager ${managerId}`);

      const data = await fplFetch(`${FPL_API}/entry/${managerId}`);
      
      if (!data.leagues?.classic) {
        return res.json([]);
      }

      const leagues = data.leagues.classic.map((league: any) => ({
        id: league.id,
        name: league.name,
        entry_rank: league.entry_rank,
        entry_last_rank: league.entry_last_rank,
        total_teams: league.num_teams
      }));

      console.log(`[Leagues] Found ${leagues.length} leagues`);
      return res.json(leagues);

    } catch (error) {
      console.error('[Leagues] Error:', error);
      return res.status(500).json({ error: "Failed to fetch leagues" });
    }
  });

  // Get league standings
  app.get("/api/leagues/:leagueId/standings", async (req, res) => {
    try {
      const leagueId = req.params.leagueId;
      console.log(`[Standings] Fetching for league ${leagueId}`);

      const data = await fplFetch(`${FPL_API}/leagues-classic/${leagueId}/standings/`);
      
      return res.json({
        league: {
          id: data.league.id,
          name: data.league.name,
          created: data.league.created,
          closed: data.league.closed
        },
        standings: {
          has_next: data.standings.has_next,
          page: data.standings.page,
          results: data.standings.results
        }
      });

    } catch (error) {
      console.error('[Standings] Error:', error);
      return res.status(500).json({ error: "Failed to fetch standings" });
    }
  });

  // Get team stats
  app.get("/api/team-stats/:managerId", async (req, res) => {
    try {
      const managerId = req.params.managerId;
      console.log(`[Stats] Fetching for manager ${managerId}`);

      const data = await fplFetch(`${FPL_API}/entry/${managerId}`);
      
      return res.json({
        averagePoints: Math.round(data.summary_overall_points / data.current_event),
        highestScore: data.max_points,
        totalTeams: data.leagues?.classic?.length || 0,
        totalTransfers: data.total_transfers,
        bestGameweekScore: data.max_points,
        overallRank: data.summary_overall_rank,
        teamValue: data.last_deadline_value / 10
      });

    } catch (error) {
      console.error('[Stats] Error:', error);
      return res.status(500).json({ error: "Failed to fetch team stats" });
    }
  });

  // Get manager history
  app.get("/api/manager-history/:managerId", async (req, res) => {
    try {
      const managerId = req.params.managerId;
      console.log(`[History] Fetching for manager ${managerId}`);

      const data = await fplFetch(`${FPL_API}/entry/${managerId}/history/`);
      
      return res.json({
        history: data.current || [],
        chips: data.chips || [],
        transfers: [],
        captains: []
      });

    } catch (error) {
      console.error('[History] Error:', error);
      return res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  // Get squad
  app.get("/api/squad/:managerId", async (req, res) => {
    try {
      const managerId = req.params.managerId;
      console.log(`[Squad] Fetching for manager ${managerId}`);

      // Get bootstrap data first
      const bootstrap = await fplFetch(`${FPL_API}/bootstrap-static/`);
      const currentEvent = bootstrap.events.find((e: any) => e.is_current)?.id || 1;

      // Get picks for current gameweek
      const picks = await fplFetch(`${FPL_API}/entry/${managerId}/event/${currentEvent}/picks/`);

      // Map player data
      const players = bootstrap.elements;
      const teams = bootstrap.teams;

      const mappedPicks = picks.picks.map((pick: any) => {
        const player = players.find((p: any) => p.id === pick.element);
        const team = teams.find((t: any) => t.id === player.team);
        
        return {
          id: player.id,
          name: `${player.first_name} ${player.second_name}`,
          position: getPosition(player.element_type),
          team: team.short_name,
          points: pick.points,
          price: player.now_cost / 10,
          form: player.form,
          selected_by: player.selected_by_percent,
          isPlayed: pick.position <= 11,
          isCaptain: pick.is_captain,
          multiplier: pick.multiplier,
          stats: {}
        };
      });

      return res.json({
        picks: mappedPicks,
        totalPoints: picks.entry_history?.points || 0,
        bank: picks.entry_history?.bank / 10 || 0,
        event: currentEvent
      });

    } catch (error) {
      console.error('[Squad] Error:', error);
      return res.status(500).json({ error: "Failed to fetch squad" });
    }
  });
}

// Helper function to convert element_type to position name
function getPosition(elementType: number): string {
  switch (elementType) {
    case 1: return 'GKP';
    case 2: return 'DEF';
    case 3: return 'MID';
    case 4: return 'FWD';
    default: return 'Unknown';
  }
}