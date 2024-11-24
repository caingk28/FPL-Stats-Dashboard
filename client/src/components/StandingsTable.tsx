import { useQuery } from "@tanstack/react-query";
import { fetchLeagueStandings } from "../lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { useToast } from "@/hooks/use-toast";
interface StandingsEntry {
  entry: number;
  entry_name: string;
  player_name: string;
  rank: number;
  total: number;
}

interface LeagueStandingsData {
  standings: {
    results: StandingsEntry[];
  };
}

interface StandingsTableProps {
  leagueId: string;
}

export default function StandingsTable({ leagueId }: StandingsTableProps) {
  const { toast } = useToast();
  const { data, isLoading, error } = useQuery<LeagueStandingsData>({
    queryKey: ["standings", leagueId],
    queryFn: () => fetchLeagueStandings(leagueId),
    refetchInterval: 60000, // Refresh every minute
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to fetch standings",
    });
    return <div>Failed to load standings</div>;
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full bg-white/20" />
        <Skeleton className="h-8 w-full bg-white/20" />
        <Skeleton className="h-8 w-full bg-white/20" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">League Standings</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.standings.results.map((entry: StandingsEntry) => (
            <TableRow key={entry.entry}>
              <TableCell>{entry.rank}</TableCell>
              <TableCell>{entry.entry_name}</TableCell>
              <TableCell>{entry.player_name}</TableCell>
              <TableCell>{entry.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
