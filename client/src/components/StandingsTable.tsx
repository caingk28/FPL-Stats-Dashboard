import { useQuery } from "@tanstack/react-query";
import { fetchLeagueStandings, type LeagueStandingsResponse } from "../lib/api";
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
import { useEffect } from "react";

interface StandingsTableProps {
  leagueId: string;
  onSelectManager?: (managerId: string) => void;
}

export default function StandingsTable({ leagueId, onSelectManager }: StandingsTableProps) {
  const { toast } = useToast();
  const { data, isLoading, error } = useQuery<LeagueStandingsResponse>({
    queryKey: ["standings", leagueId],
    queryFn: () => fetchLeagueStandings(leagueId),
    refetchInterval: 60000, // Refresh every minute
  });

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch standings";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    }
  }, [error]);

  if (error) {
    return (
      <div className="p-4 text-red-400 bg-red-950/50 rounded-md">
        Failed to load standings. Please try again later.
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 bg-white/20" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-white/20" />
          ))}
        </div>
      </div>
    );
  }

  if (!data.standings?.results?.length) {
    return (
      <div className="p-4 text-yellow-400 bg-yellow-950/50 rounded-md">
        No standings data available for this league.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">League Standings</h2>
        <p className="text-sm text-white/60">{data.league.name}</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead className="text-right">Points</TableHead>
            <TableHead className="text-right">GW</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.standings.results.map((entry) => (
            <TableRow 
              key={entry.entry}
              className="cursor-pointer hover:bg-white/5"
              onClick={() => onSelectManager?.(entry.entry.toString())}
            >
              <TableCell>{entry.rank}</TableCell>
              <TableCell>{entry.entry_name}</TableCell>
              <TableCell>{entry.player_name}</TableCell>
              <TableCell className="text-right">{entry.total}</TableCell>
              <TableCell className="text-right">{entry.event_total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
