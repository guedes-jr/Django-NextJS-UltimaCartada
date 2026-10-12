"use client";

import { useEffect, useState } from "react";
import { Crown, Medal, Sparkles, Trophy } from "lucide-react";
import { AxiosError } from "axios";

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
    let canceled = false;

    async function loadRanking() {
      try {
        if (canceled) return;
        setIsRankingLoading(true);
        setRanking([]);
        setRankingErrorMessage("");

        const rankingData = await getGameRanking(gameId);
        if (!canceled) setRanking(rankingData);
      } catch (error) {
        if (!canceled) {
          setRanking([]);
          setRankingErrorMessage(error instanceof AxiosError && error.response?.status === 403 ? "O ranking deste jogo não está disponível para visualização." : "Não foi possível carregar o ranking deste jogo. Tente novamente em instantes.");
        }
      } finally {
        if (!canceled) setIsRankingLoading(false);
      }
    }

    void Promise.resolve().then(loadRanking);
    return () => { canceled = true; };
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
          <span className={styles.eyebrow}><Trophy size={16} aria-hidden="true" /> Cada participação conta</span>
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
                  onChange={(event) => {
                    setIsRankingLoading(true);
                    setRanking([]);
                    setSelectedGameId(Number(event.target.value));
                  }}
                >
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name} - {game.group_name}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {!isRankingLoading && !rankingErrorMessage && ranking.length > 0 && (
              <section className={styles.podiumSection} aria-labelledby="podium-title" key={selectedGameId}>
                <div className={styles.podiumHeading}><div><span className={styles.eyebrow}><Sparkles size={16} aria-hidden="true" /> Destaques do jogo</span><h2 id="podium-title">Cada cartada constrói esse caminho.</h2><p>Os {Math.min(ranking.length, 5)} primeiros lugares de {selectedGame?.name}.</p></div><Trophy className={styles.trophyIllustration} aria-hidden="true" /></div>
                <ol className={styles.podium} aria-label="Primeiros lugares do ranking">
                  {ranking.slice(0, 5).map((item, index) => (
                    <li key={item.player_id} className={`${styles.podiumPlayer} ${item.username === user?.username ? styles.podiumYou : ""}`} data-place={index + 1}>
                      <div className={styles.medalIllustration} aria-hidden="true"><span className={styles.ribbon} /><div className={styles.medalFace}>{index === 0 ? <Crown /> : <Medal />}<strong>{index + 1}</strong></div></div>
                      <div className={styles.podiumIdentity}><span className={styles.placeLabel}>{index + 1}º lugar{item.username === user?.username ? " • Você" : ""}</span><h3>{item.full_name || `@${item.username}`}</h3></div>
                      <div className={styles.podiumBase}><strong>{item.total_points.toLocaleString("pt-BR")}</strong><span>pontos</span></div>
                    </li>
                  ))}
                </ol>
                <p className={styles.podiumNote}>Seu progresso também está nas pequenas escolhas de cada dia.</p>
              </section>
            )}
            <section className={styles.summaryGrid} aria-busy={isRankingLoading}>
              <article className={styles.summaryCard}>
                <span>Seu lugar</span>
                <strong>
                  {!isRankingLoading && currentPlayer ? `${currentPlayerPosition + 1}º` : "—"}
                </strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Seus pontos</span>
                <strong>{isRankingLoading ? "—" : currentPlayer?.total_points ?? 0}</strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Participantes no ranking</span>
                <strong>{isRankingLoading ? "—" : ranking.length}</strong>
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
