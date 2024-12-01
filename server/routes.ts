import express, { Express } from "express";

const FPL_API_BASE = "https://fantasy.premierleague.com/api";

export function registerRoutes(app: Express) {
  // Squad data endpoint
  app.get("/api/squad/:managerId", async ({ params }, res) => {
    try {
      const managerId = parseInt(params.managerId);
      
      if (isNaN(managerId) || managerId <= 0) {
        console.error(`Invalid manager ID format: ${params.managerId}`);
        return res.status(400).json({ error: "Invalid manager ID format. Please provide a valid positive number." });
      }

      console.log(`Fetching squad data for manager ID: ${managerId}`);
      
      const [picksResponse, playersResponse, eventResponse] = await Promise.all([
        fetch(`${FPL_API_BASE}/entry/${managerId}/event/current/picks/`),
        fetch(`${FPL_API_BASE}/bootstrap-static/`),
        fetch(`${FPL_API_BASE}/entry/${managerId}/`)
      ]);
      
      if (!picksResponse.ok || !playersResponse.ok || !eventResponse.ok) {
        throw new Error('Failed to fetch data from FPL API');
      }

      const [picksData, playersData, eventData] = await Promise.all([
        picksResponse.json(),
        playersResponse.json(),
        eventResponse.json()
      ]);

      // Map player IDs to their full data
      interface FPLPlayer {
  id: number;
  web_name: string;
  element_type: number;
  team: number;
  event_points: number;
  now_cost: number;
  form: string;
  selected_by_percent: string;
}

const playerMap = new Map<number, FPLPlayer>(
  playersData.elements.map((p: FPLPlayer) => [p.id, p])
);
      
      const positions = ['GKP', 'DEF', 'MID', 'FWD'];
      const teams = playersData.teams;

      const picks = picksData.picks.map((pick: any) => {
        const player = playerMap.get(pick.element);
        if (!player) {
          throw new Error(`Player data not found for ID: ${pick.element}`);
        }
        
        return {
          id: player.id,
          name: player.web_name,
          position: positions[player.element_type - 1],
          team: teams[player.team - 1].short_name,
          points: player.event_points,
          price: player.now_cost / 10,
          form: player.form,
          selected_by: player.selected_by_percent,
          isPlayed: player.event_points > 0,
          isCaptain: pick.is_captain,
          multiplier: pick.multiplier || 1
        };
      });

      return res.json({
        picks,
        totalPoints: picksData.entry_history.points,
        bank: picksData.entry_history.bank / 10
      });
    } catch (error) {
      console.error('Error processing squad data:', error);
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to process squad data"
      });
    }
  });
}