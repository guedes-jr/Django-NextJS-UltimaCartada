"use client";

import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { getAuthUser } from "@/lib/auth";
import { getGames } from "@/services/gameService";
import { getGameRanking } from "@/services/scoringService";
import { Game } from "@/types/games";
import { PlayerRanking } from "@/types/scoring";

import styles from "./PlayerRankingPage.module.css";

export default function PlayerRankingPage() {
  const user = getAuthUser();

  const [games, setGames] = useState<Game[]>([]);
  const [ranking, setRanking] = useState<PlayerRanking[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRankingLoading, setIsRankingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rankingErrorMessage, setRankingErrorMessage] = useState("");

  async function loadGames() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const gamesData = await getGames();

      setGames(gamesData);

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
    void Promise.resolve().then(loadGames);
  }, []);

  useEffect(() => {
    if (!selectedGameId) {
      return;
    }

    const gameId = selectedGameId;

    async function loadRanking() {
      try {
        setIsRankingLoading(true);
        setRankingErrorMessage("");

        const rankingData = await getGameRanking(gameId);
        setRanking(rankingData);
      } catch {
        setRanking([]);
        setRankingErrorMessage("Não foi possível carregar o ranking deste jogo.");
      } finally {
        setIsRankingLoading(false);
      }
    }

    void Promise.resolve().then(loadRanking);
  }, [selectedGameId]);

  const selectedGame = games.find((game) => game.id === selectedGameId);

  const currentPlayerPosition = ranking.findIndex(
    (item) => item.username === user?.username
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
                <strong>{currentPlayer?.total_points ?? 0}</strong>
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

              {isRankingLoading ? (
                <div className={styles.message}>Carregando ranking do jogo...</div>
              ) : rankingErrorMessage ? (
                <div className={styles.error}>{rankingErrorMessage}</div>
              ) : ranking.length === 0 ? (
                <div className={styles.message}>
                  Ainda não existem jogadas neste jogo.
                </div>
              ) : (
                <div className={styles.rankingList}>
                  {ranking.map((item, index) => {
                    const isCurrentPlayer =
                      item.username === user?.username;

                    return (
                      <article
                        className={`${styles.rankingCard} ${
                          isCurrentPlayer ? styles.currentPlayer : ""
                        }`}
                        key={item.player_id}
                      >
                        <span className={styles.position}>{index + 1}º</span>

                        <div className={styles.playerInfo}>
                          <strong>
                            {item.full_name || `@${item.username}`}
                            {isCurrentPlayer ? " — você" : ""}
                          </strong>

                          <span>
                            @{item.username} • Jogadas: {item.total_plays} •
                            Evidências aprovadas: {item.approved_evidences}
                          </span>
                        </div>

                        <div className={styles.points}>
                          <strong>{item.total_points}</strong>
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
