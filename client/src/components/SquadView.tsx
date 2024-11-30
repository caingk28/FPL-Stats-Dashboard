import { useQuery } from "@tanstack/react-query";
import { fetchSquad } from "../lib/api";
import styles from "./SquadView.module.css";
import { User2 } from "lucide-react";

interface SquadViewProps {
  managerId: string;
}

interface FormationPlayer {
  id: number;
  name: string;
  position: string;
  points: number;
  isPlayed: boolean;
}

export default function SquadView({ managerId }: SquadViewProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["squad", managerId],
    queryFn: () => fetchSquad(managerId),
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-16 bg-white/20 rounded-lg" />
        <div className="h-[600px] bg-white/20 rounded-lg" />
      </div>
    );
  }

  if (!data?.picks) return null;

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
      </div>
      <div className={styles.playerName}>{player.name}</div>
      <div className={styles.playerStatus}>
        {player.points > 0 ? (
          <span className="text-green-400">{player.points} pts</span>
        ) : (
          <span className="text-yellow-400">Still to play</span>
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
