import { useQuery } from "@tanstack/react-query";
import { fetchSquad, PlayerScore } from "../lib/api";
import styles from "./SquadView.module.css";
import { User2 } from "lucide-react";

interface SquadViewProps {
  managerId: string;
}

interface FormationPlayer extends PlayerScore {
  isCaptain?: boolean;
}

export default function SquadView({ managerId }: SquadViewProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["squad", managerId],
    queryFn: () => fetchSquad(managerId),
    refetchInterval: 60000,
    retry: 2,
    staleTime: 30000,
  });

  if (error) {
    return (
      <div className="p-4 text-red-400 bg-red-950/50 rounded-md">
        Failed to load squad data. Please check if the manager ID is correct.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-16 bg-white/20 rounded-lg flex justify-between p-4">
          <div className="h-8 w-32 bg-white/10 rounded" />
          <div className="flex gap-4">
            <div className="h-8 w-24 bg-white/10 rounded" />
            <div className="h-8 w-24 bg-white/10 rounded" />
          </div>
        </div>
        <div className="h-[700px] bg-white/20 rounded-lg">
          <div className="grid grid-rows-4 h-full p-8 gap-8">
            {[1, 3, 4, 3].map((count, i) => (
              <div key={i} className="flex justify-evenly">
                {Array(count).fill(0).map((_, j) => (
                  <div key={j} className="w-24 flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-white/10 rounded-full" />
                    <div className="h-4 w-20 bg-white/10 rounded" />
                    <div className="h-4 w-16 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data?.picks || data.picks.length === 0) {
    return (
      <div className="p-4 text-yellow-400 bg-yellow-950/50 rounded-md">
        No squad data available for this manager.
      </div>
    );
  }

  const formation = {
    GKP: data.picks.filter(p => p.position === "GKP").slice(0, 1),
    DEF: data.picks.filter(p => p.position === "DEF").slice(0, 3),
    MID: data.picks.filter(p => p.position === "MID").slice(0, 4),
    FWD: data.picks.filter(p => p.position === "FWD").slice(0, 3),
  };

  const PlayerCard = ({ player }: { player: FormationPlayer }) => (
    <div className={styles.playerCard}>
      <div className={styles.playerImage}>
        <User2 size={32} className="text-gray-400" />
        {player.isCaptain && (
          <span className={styles.captainBadge}>C</span>
        )}
      </div>
      <div className={styles.playerName}>
        {player.name}
      </div>
      <div className={styles.playerStatus}>
        {player.isPlayed ? (
          <span className={styles.pointsScore}>{player.points} pts</span>
        ) : (
          <span className={styles.stillToPlay}>Still to play</span>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className={styles.header}>
        <h2 className="text-xl font-bold">Current Squad</h2>
        <div className={styles.scoreInfo}>
          <div className={styles.scoreItem}>
            <div className={styles.scoreLabel}>GW Score</div>
            <div className={styles.scoreValue}>{data.totalPoints}</div>
          </div>
          <div className={styles.scoreItem}>
            <div className={styles.scoreLabel}>Bank</div>
            <div className={styles.scoreValue}>£{data.bank.toFixed(1)}m</div>
          </div>
        </div>
      </div>

      <div className={styles.pitchContainer}>
        <div className={styles.pitchLines} />
        <div className={styles.formation}>
          <div className={styles.row}>
            {formation.GKP.map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
          <div className={styles.row}>
            {formation.DEF.map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
          <div className={styles.row}>
            {formation.MID.map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
          <div className={styles.row}>
            {formation.FWD.map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
