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
    return <div className="animate-pulse bg-white/20 h-64 rounded-lg" />;
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
          <TabsContent value="history">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data?.history.map((week) => (
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
          </TabsContent>
          <TabsContent value="transfers">
            <div className="grid grid-cols-1 gap-4">
              {data?.transfers.map((transfer) => (
                <Card key={transfer.id} className="bg-white/5">
                  <CardContent className="py-4">
                    <p>{transfer.playerOut} → {transfer.playerIn}</p>
                    <p className="text-sm text-gray-400">GW {transfer.event}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
