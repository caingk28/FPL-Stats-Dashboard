import type { Express } from "express";
import { z } from "zod";

interface LeagueStanding {
  total: number;
}

interface TeamStatsResponse {
  averagePoints: number;
  highestScore: number;
  totalTeams: number;
  totalTransfers: number;
  bestGameweekScore: number;
  overallRank: number;
  teamValue: number;
}

interface ManagerHistoryResponse {
  history: Array<{
    event: number;
    points: number;
    rank: number;
  }>;
  chips?: Array<{
    id: number;
    event: number;
    playerIn: string;
    playerOut: string;
  }>;
}
const paramsSchema = z.object({
  leagueId: z.string().regex(/^\d+$/),
});

import cors from 'cors';

const FPL_API_BASE = "https://fantasy.premierleague.com/api";

export function registerRoutes(app: Express) {
  // Enable CORS for all routes
  app.use(cors());

  // Proxy route for league standings
  app.get("/api/leagues/:leagueId/standings", async (req, res) => {
    try {
      const { leagueId } = paramsSchema.parse(req.params);
      const response = await fetch(`${FPL_API_BASE}/leagues-classic/${leagueId}/standings/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch from FPL API');
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: "Invalid league ID or API error" });
    }
  });

  // Team stats endpoint
  app.get("/api/team-stats/:leagueId", async (req, res) => {
    try {
      const { leagueId } = paramsSchema.parse(req.params);
      const [leagueResponse, historyResponse] = await Promise.all([
        fetch(`${FPL_API_BASE}/leagues-classic/${leagueId}/standings/`),
        fetch(`${FPL_API_BASE}/entry/${leagueId}/history/`)
      ]);
      
      if (!leagueResponse.ok || !historyResponse.ok) {
        throw new Error('Failed to fetch from FPL API');
      }

      const [leagueData, historyData] = await Promise.all([
        leagueResponse.json(),
        historyResponse.json()
      ]);

      const standings = leagueData.standings.results;
      const history = historyData.current;
      
      const totalPoints = standings.reduce((sum: number, entry: any) => sum + entry.total, 0);
      const averagePoints = Math.round(totalPoints / standings.length);
      const highestScore = Math.max(...standings.map((entry: any) => entry.total));
      const bestGameweekScore = Math.max(...history.map((gw: any) => gw.points));
      const lastGw = history[history.length - 1];
      
      res.json({
        averagePoints,
        highestScore,
        totalTeams: standings.length,
        totalTransfers: history.reduce((sum: number, gw: any) => sum + gw.event_transfers, 0),
        bestGameweekScore,
        overallRank: lastGw.overall_rank,
        teamValue: lastGw.value / 10, // Convert to actual value
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid league ID or API error" });
    }
  });

  app.get("/api/manager-history/:leagueId", async (req, res) => {
    try {
      const { leagueId } = paramsSchema.parse(req.params);
      const [historyResponse, transfersResponse, picksResponse] = await Promise.all([
        fetch(`${FPL_API_BASE}/entry/${leagueId}/history/`),
        fetch(`${FPL_API_BASE}/entry/${leagueId}/transfers/`),
        fetch(`${FPL_API_BASE}/entry/${leagueId}/event/1/picks/`) // We'll need to fetch each gameweek's picks for captain history
      ]);
      
      if (!historyResponse.ok || !transfersResponse.ok || !picksResponse.ok) {
        throw new Error('Failed to fetch from FPL API');
      }

      const [historyData, transfersData, picksData] = await Promise.all([
        historyResponse.json(),
        transfersResponse.json(),
        picksResponse.json()
      ]);
      
      // Process transfers to include points impact
      const transfers = transfersData.map((transfer: any) => ({
        id: transfer.id,
        event: transfer.event,
        playerIn: transfer.element_in_name,
        playerOut: transfer.element_out_name,
        pointsImpact: transfer.points_hit || 0
      }));

      // Process captain picks (simplified for now, we'd need to fetch each gameweek's picks for complete data)
      const captains = [{
        event: 1,
        playerName: picksData.picks.find((pick: any) => pick.is_captain).element_name,
        points: 0 // We'd need additional API calls to get the points
      }];

      res.json({
        history: historyData.current,
        chips: historyData.chips.map((chip: any) => ({
          name: chip.name,
          event: chip.event,
          time: chip.time
        })),
        transfers,
        captains
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid manager ID or API error" });
    }
  });
}
