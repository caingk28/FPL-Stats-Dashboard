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
  return (
    <div className="flex flex-col items-center gap-1 p-2 text-center">
      <div className="relative">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center 
          ${player.isPlayed ? 'bg-green-600' : 'bg-gray-600'} 
          ${player.isCaptain ? 'ring-2 ring-yellow-400' : ''}`}>
          <span className="text-xs font-bold">{player.position}</span>
        </div>
      </div>
      <div className="text-xs font-medium truncate max-w-[100px]">
        {player.name}
        {player.isCaptain && <span className="ml-1 text-yellow-400">(C)</span>}
      </div>
      <div className="text-xs">
        {player.isPlayed ? (
          <span className="text-green-400">{player.points} pts</span>
        ) : (
          <span className="text-yellow-400">Still to play</span>
        )}
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
