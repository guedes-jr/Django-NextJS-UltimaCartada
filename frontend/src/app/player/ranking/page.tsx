"use client";

import { useEffect, useRef, useState } from "react";
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

  const [gamesAttempt, setGamesAttempt] = useState(0);
  const [rankingAttempt, setRankingAttempt] = useState(0);
  const gamesRetryRef = useRef(false);
  const rankingRetryRef = useRef(false);
  const rankingGameRef = useRef<number | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const rankingTitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let canceled = false;
    async function loadGames() {
      try {
        setIsLoading(true);
        const gamesData = await getGames();
        if (canceled) return;
        setGames(gamesData);
        setSelectedGameId(gamesData[0]?.id ?? null);
        setErrorMessage("");
        if (gamesRetryRef.current) requestAnimationFrame(() => {
          if (!canceled) titleRef.current?.focus();
        });
      } catch {
        if (!canceled) setErrorMessage("Não foi possível carregar o ranking.");
      } finally {
        if (!canceled) {
          gamesRetryRef.current = false;
          setIsLoading(false);
        }
      }
    }
    void loadGames();
    return () => { canceled = true; };
  }, [gamesAttempt]);

  useEffect(() => {
    if (!selectedGameId) return;
    const gameId = selectedGameId;
    const changedGame = rankingGameRef.current !== gameId;
    rankingGameRef.current = gameId;
    if (changedGame) rankingRetryRef.current = false;
    let canceled = false;
    async function loadRanking() {
      try {
        setIsRankingLoading(true);
        setRanking([]);
        if (changedGame) setRankingErrorMessage("");
        const rankingData = await getGameRanking(gameId);
        if (canceled) return;
        setRanking(rankingData);
        setRankingErrorMessage("");
        if (rankingRetryRef.current) requestAnimationFrame(() => {
          if (!canceled) rankingTitleRef.current?.focus();
        });
      } catch (error) {
        if (!canceled) {
          setRanking([]);
          setRankingErrorMessage(error instanceof AxiosError && error.response?.status === 403 ? "O ranking deste jogo não está disponível para visualização." : "Não foi possível carregar o ranking deste jogo. Tente novamente em instantes.");
        }
      } finally {
        if (!canceled) {
          rankingRetryRef.current = false;
          setIsRankingLoading(false);
        }
      }
    }
    void loadRanking();
    return () => { canceled = true; };
  }, [selectedGameId, rankingAttempt]);

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
          <h1 ref={titleRef} tabIndex={-1}>Ranking do grupo</h1>
          <p>
            Veja sua posição no jogo e acompanhe a evolução dos participantes.
          </p>
        </div>

        {isLoading && !errorMessage && (
          <div role="status" className={styles.message}>Carregando ranking...</div>
        )}

        {errorMessage && (
          <div role="alert" className={styles.error}>
            <p>{errorMessage}</p>
            <button className={styles.retryButton} type="button" aria-disabled={isLoading} onClick={() => {
              if (gamesRetryRef.current) return;
              gamesRetryRef.current = true;
              setGamesAttempt((attempt) => attempt + 1);
            }}>{isLoading ? "Carregando jogos..." : "Recarregar jogos"}</button>
          </div>
        )}

        {!isLoading && !errorMessage && games.length === 0 && (
          <div role="status" className={styles.message}>
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
                <strong>{isRankingLoading || rankingErrorMessage ? "—" : currentPlayer?.total_points ?? 0}</strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Participantes no ranking</span>
                <strong>{isRankingLoading || rankingErrorMessage ? "—" : ranking.length}</strong>
              </article>
            </section>

            <section className={styles.section}>
              <h2 ref={rankingTitleRef} tabIndex={-1}>
                {selectedGame
                  ? `Ranking — ${selectedGame.name}`
                  : "Ranking"}
              </h2>

              {rankingErrorMessage ? (
                <div role="alert" className={styles.error}>
                  <p>{rankingErrorMessage}</p>
                  <button className={styles.retryButton} type="button" aria-disabled={isRankingLoading} onClick={() => {
                    if (rankingRetryRef.current) return;
                    rankingRetryRef.current = true;
                    setRankingAttempt((attempt) => attempt + 1);
                  }}>{isRankingLoading ? "Carregando ranking..." : "Tentar novamente"}</button>
                </div>
              ) : isRankingLoading ? (
                <div role="status" className={styles.message}>Carregando ranking do jogo...</div>
              ) : ranking.length === 0 ? (
                <div role="status" className={styles.message}>
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
