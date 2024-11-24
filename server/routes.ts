import type { Express } from "express";
import { z } from "zod";

interface LeagueStanding {
  total: number;
}

interface TeamStatsResponse {
  averagePoints: number;
  highestScore: number;
  totalTeams: number;
}

interface ManagerHistoryResponse {
  history: Array<{
    event: number;
    points: number;
    rank: number;
  }>;
  transfers: Array<{
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
      const response = await fetch(`${FPL_API_BASE}/leagues-classic/${leagueId}/standings/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch from FPL API');
      }

      const data = await response.json();
      const standings = data.standings.results;
      const totalPoints = standings.reduce((sum: number, entry: any) => sum + entry.total, 0);
      const averagePoints = Math.round(totalPoints / standings.length);
      const highestScore = Math.max(...standings.map((entry: any) => entry.total));

      res.json({
        averagePoints,
        highestScore,
        totalTeams: standings.length,
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid league ID or API error" });
    }
  });

  app.get("/api/manager-history/:leagueId", async (req, res) => {
    try {
      const { leagueId } = paramsSchema.parse(req.params);
      const response = await fetch(`https://fantasy.premierleague.com/api/entry/${leagueId}/history/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch from FPL API');
      }

      const data = await response.json();
      
      res.json({
        history: data.current,
        transfers: data.chips,
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid manager ID or API error" });
    }
  });
}
