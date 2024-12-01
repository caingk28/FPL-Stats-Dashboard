import { useQuery } from "@tanstack/react-query";
import { fetchSquad, type PlayerScore } from "../lib/api";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SquadViewProps {
  managerId: string;
}

interface FormationPlayer extends PlayerScore {
  isCaptain: boolean;
}

interface Formation {
  GKP: FormationPlayer[];
  DEF: FormationPlayer[];
  MID: FormationPlayer[];
  FWD: FormationPlayer[];
}

function PlayerCard({ player }: { player: FormationPlayer }) {
  const hasPlayed = player.stats?.minutes && player.stats.minutes > 0;
  const goalPoints = (player.stats?.goals_scored || 0) * (player.position === 'MID' ? 5 : player.position === 'FWD' ? 4 : 6);
  const assistPoints = (player.stats?.assists || 0) * 3;
  const cleanSheetPoints = (player.stats?.clean_sheets || 0) * (player.position === 'DEF' || player.position === 'GKP' ? 4 : player.position === 'MID' ? 1 : 0);
  const bonusPoints = player.stats?.bonus || 0;

  return (
    <div className="flex flex-col items-center gap-1 p-2 text-center group relative">
      <div className="relative">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
          ${hasPlayed ? 'bg-green-600' : 'bg-gray-600'} 
          ${player.isCaptain ? 'ring-2 ring-yellow-400' : ''}`}>
          <span className="text-xs font-bold">{player.position}</span>
        </div>
      </div>
      <div className="text-xs font-medium truncate max-w-[100px]">
        {player.name}
        {player.isCaptain && <span className="ml-1 text-yellow-400">(C)</span>}
      </div>
      <div className="text-xs">
        {hasPlayed ? (
          <span className="text-green-400">{player.points} pts</span>
        ) : (
          <span className="text-yellow-400">Yet to play</span>
        )}
      </div>
      
      {/* Hover stats tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black/90 text-white text-xs rounded p-2 z-10 w-48">
        <div className="grid grid-cols-2 gap-1">
          {player.stats?.minutes && <div>Minutes: {player.stats.minutes}</div>}
          {player.stats?.goals_scored > 0 && <div>Goals: {player.stats.goals_scored} ({goalPoints}pts)</div>}
          {player.stats?.assists > 0 && <div>Assists: {player.stats.assists} ({assistPoints}pts)</div>}
          {player.stats?.clean_sheets > 0 && <div>Clean Sheet: {cleanSheetPoints}pts</div>}
          {bonusPoints > 0 && <div>Bonus: {bonusPoints}pts</div>}
          {player.stats?.bps > 0 && <div>BPS: {player.stats.bps}</div>}
        </div>
      </div>
    </div>
  );
}

export default function SquadView({ managerId }: SquadViewProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["squad", managerId],
    queryFn: () => fetchSquad(managerId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 bg-white/20" />
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 11 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full bg-white/20" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return <div>No squad data available.</div>;
  }

  // Organize players by position
  const formation = data.picks.reduce<Formation>(
    (acc, player) => {
      acc[player.position as keyof Formation].push(player as FormationPlayer);
      return acc;
    },
    { GKP: [], DEF: [], MID: [], FWD: [] }
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Current Squad</h2>
        <div className="text-sm text-white/60">
          Bank: £{data.bank.toFixed(1)}m | Total Points: {data.totalPoints}
        </div>
      </div>

      <Card className="p-6 bg-[#001e28]/80">
        <div className="flex flex-col gap-8 items-center">
          <div className="flex flex-col gap-6 items-center">
            <div className="flex justify-center">
              {formation.GKP.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
            <div className="flex justify-center gap-4">
              {formation.DEF.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
            <div className="flex justify-center gap-4">
              {formation.MID.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
            <div className="flex justify-center gap-4">
              {formation.FWD.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
