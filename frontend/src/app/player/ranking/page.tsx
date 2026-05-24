"use client";

import { useEffect, useMemo, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { getAuthUser } from "@/lib/auth";
import { getEvidences } from "@/services/evidenceService";
import { getGames } from "@/services/gameService";
import { getPlays } from "@/services/playService";
import { Evidence } from "@/types/evidences";
import { Game } from "@/types/games";
import { Play } from "@/types/plays";

import styles from "./PlayerRankingPage.module.css";

type RankingItem = {
  playerUsername: string;
  totalPoints: number;
  basePoints: number;
  bonusPoints: number;
  totalPlays: number;
  approvedEvidences: number;
};

export default function PlayerRankingPage() {
  const user = getAuthUser();

  const [games, setGames] = useState<Game[]>([]);
  const [plays, setPlays] = useState<Play[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [gamesData, playsData, evidencesData] = await Promise.all([
        getGames(),
        getPlays(),
        getEvidences(),
      ]);

      setGames(gamesData);
      setPlays(playsData);
      setEvidences(evidencesData);

      if (gamesData.length > 0) {
        setSelectedGameId(gamesData[0].id);
      }
    } catch {
      setErrorMessage("Não foi possível carregar o ranking.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const selectedGame = games.find((game) => game.id === selectedGameId);

  const filteredPlays = useMemo(() => {
    if (!selectedGameId) {
      return [];
    }

    return plays.filter((play) => play.game === selectedGameId);
  }, [plays, selectedGameId]);

  const ranking = useMemo(() => {
    const rankingMap = new Map<string, RankingItem>();

    for (const play of filteredPlays) {
      const current = rankingMap.get(play.player_username) ?? {
        playerUsername: play.player_username,
        totalPoints: 0,
        basePoints: 0,
        bonusPoints: 0,
        totalPlays: 0,
        approvedEvidences: 0,
      };

      current.totalPoints += play.total_points;
      current.basePoints += play.base_points;
      current.bonusPoints += play.bonus_points;
      current.totalPlays += 1;

      rankingMap.set(play.player_username, current);
    }

    for (const evidence of evidences) {
      const play = filteredPlays.find((item) => item.id === evidence.play);

      if (!play || evidence.status !== "APPROVED") {
        continue;
      }

      const current = rankingMap.get(play.player_username);

      if (!current) {
        continue;
      }

      current.approvedEvidences += 1;
      rankingMap.set(play.player_username, current);
    }

    return Array.from(rankingMap.values()).sort(
      (first, second) => second.totalPoints - first.totalPoints
    );
  }, [filteredPlays, evidences]);

  const currentPlayerPosition = ranking.findIndex(
    (item) => item.playerUsername === user?.username
  );

  const currentPlayer = currentPlayerPosition >= 0
    ? ranking[currentPlayerPosition]
    : null;

  return (
    <ProtectedRoute allowedRoles={["PLAYER"]}>
      <PlayerLayout>
        <div className={styles.header}>
          <h1>Ranking do grupo</h1>
          <p>
            Veja sua posição no jogo e acompanhe a evolução dos participantes.
          </p>
        </div>

        {isLoading && (
          <div className={styles.message}>Carregando ranking...</div>
        )}

        {!isLoading && errorMessage && (
          <div className={styles.error}>{errorMessage}</div>
        )}

        {!isLoading && !errorMessage && games.length === 0 && (
          <div className={styles.message}>
            Você ainda não possui jogos disponíveis para ranking.
          </div>
        )}

        {!isLoading && !errorMessage && games.length > 0 && (
          <>
            <section className={styles.filters}>
              <div className={styles.field}>
                <label htmlFor="game">Jogo</label>
                <select
                  id="game"
                  value={selectedGameId ?? ""}
                  onChange={(event) =>
                    setSelectedGameId(Number(event.target.value))
                  }
                >
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name} - {game.group_name}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section className={styles.summaryGrid}>
              <article className={styles.summaryCard}>
                <span>Seu lugar</span>
                <strong>
                  {currentPlayer ? `${currentPlayerPosition + 1}º` : "-"}
                </strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Seus pontos</span>
                <strong>{currentPlayer?.totalPoints ?? 0}</strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Participantes no ranking</span>
                <strong>{ranking.length}</strong>
              </article>
            </section>

            <section className={styles.section}>
              <h2>
                {selectedGame
                  ? `Ranking — ${selectedGame.name}`
                  : "Ranking"}
              </h2>

              {ranking.length === 0 ? (
                <div className={styles.message}>
                  Ainda não existem jogadas neste jogo.
                </div>
              ) : (
                <div className={styles.rankingList}>
                  {ranking.map((item, index) => {
                    const isCurrentPlayer =
                      item.playerUsername === user?.username;

                    return (
                      <article
                        className={`${styles.rankingCard} ${
                          isCurrentPlayer ? styles.currentPlayer : ""
                        }`}
                        key={item.playerUsername}
                      >
                        <span className={styles.position}>{index + 1}º</span>

                        <div className={styles.playerInfo}>
                          <strong>
                            @{item.playerUsername}
                            {isCurrentPlayer ? " — você" : ""}
                          </strong>

                          <span>
                            Jogadas: {item.totalPlays} • Evidências aprovadas:{" "}
                            {item.approvedEvidences}
                          </span>

                          <span>
                            Pontos base: {item.basePoints} • Bônus:{" "}
                            {item.bonusPoints}
                          </span>
                        </div>

                        <div className={styles.points}>
                          <strong>{item.totalPoints}</strong>
                          <span>pontos</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </PlayerLayout>
    </ProtectedRoute>
  );
}
