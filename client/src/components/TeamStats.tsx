import { useQuery } from "@tanstack/react-query";
import { fetchTeamStats } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TeamStatsProps {
  leagueId: string;
}

export default function TeamStats({ leagueId }: TeamStatsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["teamStats", leagueId],
    queryFn: () => fetchTeamStats(leagueId),
    refetchInterval: 60000,
  });

  if (isLoading) {
    return <div className="animate-pulse bg-white/20 h-48 rounded-lg" />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Team Performance</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/10">
          <CardHeader>
            <CardTitle className="text-sm">Average Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.averagePoints}</div>
            <Progress value={data?.averagePoints} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/10">
          <CardHeader>
            <CardTitle className="text-sm">Highest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.highestScore}</div>
            <Progress value={data?.highestScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
