import { useQuery } from "@tanstack/react-query";
import { fetchTeamStats, type TeamStatsResponse } from "../lib/api";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TeamStatsProps {
  managerId: string;
}

export default function TeamStats({ managerId }: TeamStatsProps) {
  const { data: stats, isLoading, error } = useQuery<TeamStatsResponse>({
    queryKey: ["team-stats", managerId],
    queryFn: () => fetchTeamStats(managerId),
    enabled: !!managerId, // Only fetch when managerId is available
  });

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Team Performance</h2>
        <div className="text-red-400 bg-red-950/50 rounded-md p-4">
          Failed to load team stats. Please try again later.
        </div>
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Team Performance</h2>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 bg-white/20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Team Performance</h2>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-white/10">
          <div className="space-y-2">
            <p className="text-sm text-white/60">Average Points</p>
            <p className="text-2xl font-bold">{stats.averagePoints}</p>
          </div>
        </Card>
        <Card className="p-4 bg-white/10">
          <div className="space-y-2">
            <p className="text-sm text-white/60">Best GW Score</p>
            <p className="text-2xl font-bold">{stats.bestGameweekScore}</p>
          </div>
        </Card>
        <Card className="p-4 bg-white/10">
          <div className="space-y-2">
            <p className="text-sm text-white/60">Overall Rank</p>
            <p className="text-2xl font-bold">#{stats.overallRank.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="p-4 bg-white/10">
          <div className="space-y-2">
            <p className="text-sm text-white/60">Team Value</p>
            <p className="text-2xl font-bold">£{stats.teamValue}m</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
