"use client";

import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { getGames } from "@/services/gameService";
import { getGameRanking, getGameSummary } from "@/services/scoringService";
import { Game } from "@/types/games";
import { GameSummary, PlayerRanking } from "@/types/scoring";

import styles from "./AdminDashboardPage.module.css";

export default function AdminDashboardPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [summary, setSummary] = useState<GameSummary | null>(null);
  const [ranking, setRanking] = useState<PlayerRanking[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadGames() {
      try {
        setIsLoadingGames(true);
        setErrorMessage("");

        const gamesData = await getGames();

        setGames(gamesData);

        if (gamesData.length > 0) {
          setSelectedGameId(gamesData[0].id);
        }
      } catch {
        setErrorMessage(
          "Não foi possível carregar os jogos. Confira se o backend está rodando."
        );
      } finally {
        setIsLoadingGames(false);
      }
    }

    loadGames();
  }, []);

  useEffect(() => {
    async function loadDashboard(gameId: number) {
      try {
        setIsLoadingDashboard(true);
        setErrorMessage("");

        const [summaryData, rankingData] = await Promise.all([
          getGameSummary(gameId),
          getGameRanking(gameId),
        ]);

        setSummary(summaryData);
        setRanking(rankingData);
      } catch {
        setSummary(null);
        setRanking([]);
        setErrorMessage(
          "Não foi possível carregar os dados deste jogo. Verifique se o jogo possui grupo e rodadas geradas."
        );
      } finally {
        setIsLoadingDashboard(false);
      }
    }

    if (selectedGameId) {
      loadDashboard(selectedGameId);
    }
  }, [selectedGameId]);

  const selectedGame = games.find((game) => game.id === selectedGameId);

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <div className={styles.header}>
          <h1>Dashboard Admin</h1>
          <p>
            Acompanhe o desempenho geral do jogo, pontuações, evidências e
            participação dos jogadores.
          </p>
        </div>

        {isLoadingGames && (
          <div className={styles.message}>Carregando jogos...</div>
        )}

        {!isLoadingGames && games.length === 0 && (
          <div className={styles.message}>
            Nenhum jogo encontrado. Cadastre um jogo no Django Admin para
            visualizar o dashboard.
          </div>
        )}

        {!isLoadingGames && games.length > 0 && (
          <section className={styles.filters}>
            <div className={styles.field}>
              <label htmlFor="game">Jogo</label>
              <select
                id="game"
                value={selectedGameId ?? ""}
                onChange={(event) => {
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

            {selectedGame && (
              <span className={styles.statusBadge}>
                Status: {selectedGame.status}
              </span>
            )}
          </section>
        )}

        {isLoadingDashboard && (
          <div className={styles.message}>Carregando dados do dashboard...</div>
        )}

        {!isLoadingDashboard && errorMessage && (
          <div className={styles.error}>{errorMessage}</div>
        )}

        {!isLoadingDashboard && !errorMessage && summary && (
          <>
            <section className={styles.grid}>
              <article className={styles.card}>
                <span>Jogadores</span>
                <strong>{summary.total_players}</strong>
              </article>

              <article className={styles.card}>
                <span>Rodadas</span>
                <strong>{summary.total_rounds}</strong>
              </article>

              <article className={styles.card}>
                <span>Jogadas</span>
                <strong>{summary.total_plays}</strong>
              </article>

              <article className={styles.card}>
                <span>Evidências pendentes</span>
                <strong>{summary.pending_evidences}</strong>
              </article>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Ranking do jogo</h2>
                  <span>
                    {summary.game_name} • {summary.group_name}
                  </span>
                </div>
              </div>

              {ranking.length === 0 ? (
                <div className={styles.message}>
                  Ainda não há jogadas pontuadas neste jogo.
                </div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Posição</th>
                        <th>Jogador</th>
                        <th>Pontos</th>
                        <th>Jogadas</th>
                        <th>Evidências aprovadas</th>
                      </tr>
                    </thead>

                    <tbody>
                      {ranking.map((player, index) => (
                        <tr key={player.player_id}>
                          <td>
                            <span className={styles.position}>
                              {index + 1}
                            </span>
                          </td>

                          <td>
                            <div className={styles.playerName}>
                              <strong>
                                {player.full_name || player.username}
                              </strong>
                              <span>@{player.username}</span>
                            </div>
                          </td>

                          <td className={styles.points}>
                            {player.total_points}
                          </td>

                          <td>{player.total_plays}</td>

                          <td>{player.approved_evidences}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}