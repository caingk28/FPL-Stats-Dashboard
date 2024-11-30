import { Card } from "@/components/ui/card";
import LeagueInput from "../components/LeagueInput";
import StandingsTable from "../components/StandingsTable";
import TeamStats from "../components/TeamStats";
import ManagerView from "../components/ManagerView";
import { useState } from "react";
import SquadView from "../components/SquadView";

export default function Dashboard() {
  const [leagueId, setLeagueId] = useState<string>("");
  const [selectedManager, setSelectedManager] = useState<string>("");

  return (
    <div className="min-h-screen bg-[#37003c] text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Live FPL Dashboard</h1>
          <LeagueInput onSubmit={setLeagueId} />
        </div>

        {leagueId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white/10 backdrop-blur">
              <StandingsTable 
                leagueId={leagueId} 
                onSelectManager={setSelectedManager}
              />
            </Card>
            
            <Card className="p-6 bg-white/10 backdrop-blur">
              <TeamStats leagueId={leagueId} />
            </Card>

            <Card className="md:col-span-2 p-6 bg-white/10 backdrop-blur">
              <ManagerView leagueId={leagueId} />
            </Card>

            {selectedManager && (
              <Card className="md:col-span-2 p-6 bg-white/10 backdrop-blur">
                <SquadView managerId={selectedManager.toString()} />
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
