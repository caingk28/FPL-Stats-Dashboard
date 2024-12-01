import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchManagerLeagues, type League } from "../lib/api";

interface LeagueSelectorProps {
  managerId: string;
  onLeagueSelect: (leagueId: string) => void;
}

export default function LeagueSelector({ managerId, onLeagueSelect }: LeagueSelectorProps) {
  const { data: leagues, isLoading, error } = useQuery<League[]>({
    queryKey: ['leagues', managerId],
    queryFn: () => fetchManagerLeagues(managerId),
    enabled: !!managerId,
    retry: 1,
    onError: (error) => {
      console.error('Failed to fetch leagues:', error);
    }
  });

  if (error) {
    return (
      <div className="p-4 text-red-400 bg-red-950/50 rounded-md">
        Failed to load leagues. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-12 w-full bg-white/20" />;
  }

  if (!leagues?.length) {
    return (
      <div className="p-4 text-yellow-400 bg-yellow-950/50 rounded-md">
        No leagues found for this manager.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Select League</h3>
      <Select onValueChange={onLeagueSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a league..." />
        </SelectTrigger>
        <SelectContent>
          {leagues.map((league) => (
            <SelectItem key={league.id} value={league.id.toString()}>
              <div className="flex items-center justify-between w-full gap-4">
                <span className="truncate">{league.name}</span>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Rank: {league.entry_rank}/{league.total_teams}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 