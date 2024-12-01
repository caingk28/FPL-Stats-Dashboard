import { Card } from "@/components/ui/card";
import LeagueInput from "../components/LeagueInput";
import StandingsTable from "../components/StandingsTable";
import TeamStats from "../components/TeamStats";
import ManagerView from "../components/ManagerView";
import { useState } from "react";
import SquadView from "../components/SquadView";
import LeagueSelector from "../components/LeagueSelector";

export default function Dashboard() {
  const [managerId, setManagerId] = useState<string>("");
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>("");

  const handleManagerSubmit = (id: string) => {
    setManagerId(id);
    setSelectedLeagueId(""); // Reset league selection when manager changes
  };

  return (
    <div className="min-h-screen bg-[#37003c] text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Live FPL Dashboard</h1>
          <LeagueInput onSubmit={handleManagerSubmit} />
        </div>

        {managerId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2 p-6 bg-white/10 backdrop-blur">
              <LeagueSelector 
                managerId={managerId}
                onLeagueSelect={setSelectedLeagueId}
              />
            </Card>

            {selectedLeagueId && (
              <Card className="md:col-span-2 p-6 bg-white/10 backdrop-blur">
                <StandingsTable 
                  leagueId={selectedLeagueId}
                  onSelectManager={setManagerId}
                />
              </Card>
            )}
            
            <Card className="p-6 bg-white/10 backdrop-blur">
              <TeamStats managerId={managerId} />
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur">
              <ManagerView managerId={managerId} />
            </Card>

            <Card className="md:col-span-2 p-6 bg-white/10 backdrop-blur">
              <SquadView managerId={managerId} />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
