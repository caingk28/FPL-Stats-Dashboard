import { useQuery } from "@tanstack/react-query";
import { fetchSquad, type PlayerScore } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SquadViewProps {
  managerId: string;
}

export default function SquadView({ managerId }: SquadViewProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["squad", managerId],
    queryFn: () => fetchSquad(managerId),
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 bg-white/20" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 11 }).map((_, i) => (
            <Skeleton key={i} className="h-24 bg-white/20" />
          ))}
        </div>
      </div>
    );
  }

  const positionOrder = ["GKP", "DEF", "MID", "FWD"];
  const sortedPlayers = [...(data?.picks || [])].sort(
    (a, b) => positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Current Squad</h2>
        <div className="text-sm text-white/60">
          <span>Bank: £{data?.bank.toFixed(1)}m</span>
          <span className="mx-2">•</span>
          <span>Total Points: {data?.totalPoints}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedPlayers.map((player) => (
          <Card key={player.id} className="bg-white/5">
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{player.name}</span>
                <span className="text-white/60">{player.position}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Team: {player.team}</div>
                <div>Price: £{player.price}m</div>
                <div>Form: {player.form}</div>
                <div>Selected: {player.selected_by}%</div>
                <div className="col-span-2 mt-2">
                  <span className="text-lg font-bold">{player.points}</span>
                  <span className="text-white/60 ml-1">points</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
