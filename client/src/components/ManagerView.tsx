import { useQuery } from "@tanstack/react-query";
import { fetchManagerHistory } from "../lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ManagerViewProps {
  leagueId: string;
}

export default function ManagerView({ leagueId }: ManagerViewProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["managerHistory", leagueId],
    queryFn: () => fetchManagerHistory(leagueId),
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <Card className="bg-white/10">
        <CardHeader>
          <CardTitle>Manager Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse bg-white/20 h-8 w-48 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white/20 h-32 rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10">
      <CardHeader>
        <CardTitle>Manager Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="history">
          <TabsList>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="transfers">Transfers</TabsTrigger>
          </TabsList>
          <TabsContent value="history" key="history">
            {data?.history?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.history.map((week) => (
                  <Card key={week.event} className="bg-white/5">
                    <CardHeader>
                      <CardTitle className="text-sm">Gameweek {week.event}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Points: {week.points}</p>
                      <p>Rank: {week.rank}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-4 text-yellow-400 bg-yellow-950/50 rounded-md">
                No gameweek history available for this manager.
              </div>
            )}
          </TabsContent>
          <TabsContent value="transfers" key="transfers">
            {data?.chips?.length ? (
              <div className="grid grid-cols-1 gap-4">
                {data.chips.map((chip, index) => (
                  <Card key={`${chip.name}-${chip.event}-${index}`} className="bg-white/5">
                    <CardContent className="py-4">
                      <p>{chip.name}</p>
                      <p className="text-sm text-gray-400">GW {chip.event} • {chip.time}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-4 text-yellow-400 bg-yellow-950/50 rounded-md">
                No transfer history available for this manager.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
