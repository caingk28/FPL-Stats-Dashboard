import { useQuery } from "@tanstack/react-query";
import { fetchManagerHistory, type ManagerHistoryResponse } from "../lib/api";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface ManagerViewProps {
  managerId: string;
}

export default function ManagerView({ managerId }: ManagerViewProps) {
  const { data, isLoading, error } = useQuery<ManagerHistoryResponse>({
    queryKey: ["manager-history", managerId],
    queryFn: () => fetchManagerHistory(managerId),
    enabled: !!managerId,
  });

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Manager Statistics</h2>
        <div className="text-red-400 bg-red-950/50 rounded-md p-4">
          Failed to load manager history. Please try again later.
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Manager Statistics</h2>
        <Skeleton className="h-[300px] bg-white/20" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Manager Statistics</h2>
      <Tabs defaultValue="history">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="space-y-4">
          {data.history.slice(-5).map((entry) => (
            <Card key={entry.event} className="p-4 bg-white/10">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-white/60">Gameweek {entry.event}</p>
                  <p className="text-lg font-bold">{entry.points} pts</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60">Overall Rank</p>
                  <p className="text-lg font-bold">#{entry.overall_rank.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="transfers" className="space-y-4">
          {data.chips.map((chip) => (
            <Card key={chip.time} className="p-4 bg-white/10">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-white/60">Chip Used</p>
                  <p className="text-lg font-bold">{chip.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60">Gameweek</p>
                  <p className="text-lg font-bold">{chip.event}</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
