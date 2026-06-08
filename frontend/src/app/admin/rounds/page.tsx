"use client";

import { useEffect, useMemo, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { getGames } from "@/services/gameService";
import {
  activateRound,
  closeRound,
  getGameRounds,
} from "@/services/roundService";
import { Game } from "@/types/games";
import { GameRound } from "@/types/rounds";

import styles from "./AdminRoundsPage.module.css";

export default function AdminRoundsPage() {
  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | "">("");

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [roundsData, gamesData] = await Promise.all([
        getGameRounds(),
        getGames(),
      ]);

      setRounds(roundsData);
      setGames(gamesData);
    } catch {
      setErrorMessage("Não foi possível carregar as rodadas.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredRounds = useMemo(() => {
    if (!selectedGameId) {
      return rounds;
    }

    return rounds.filter((round) => round.game === selectedGameId);
  }, [rounds, selectedGameId]);

  async function handleActivateRound(roundId: number) {
    try {
      setIsUpdating(true);
      setFeedbackMessage("");
      setErrorMessage("");

      const response = await activateRound(roundId);

      setFeedbackMessage(response.detail);

      await loadData();
    } catch {
      setErrorMessage("Não foi possível ativar a rodada.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleCloseRound(roundId: number) {
    try {
      setIsUpdating(true);
      setFeedbackMessage("");
      setErrorMessage("");

      const response = await closeRound(roundId);

      setFeedbackMessage(response.detail);

      await loadData();
    } catch {
      setErrorMessage("Não foi possível encerrar a rodada.");
    } finally {
      setIsUpdating(false);
    }
  }

  function formatDateTime(value?: string) {
    if (!value) {
      return "Não definido";
    }

    return new Date(value).toLocaleString("pt-BR");
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <div className={styles.header}>
          <div>
            <h1>Rodadas</h1>
            <p>
              Acompanhe as rodadas dos jogos, controle qual está ativa e veja o
              volume de jogadas.
            </p>
          </div>
        </div>

        {feedbackMessage && (
          <div className={styles.success}>{feedbackMessage}</div>
        )}

        {errorMessage && <div className={styles.error}>{errorMessage}</div>}

        <section className={styles.filters}>
          <div className={styles.field}>
            <label htmlFor="game">Filtrar por jogo</label>
            <select
              id="game"
              value={selectedGameId}
              onChange={(event) =>
                setSelectedGameId(
                  event.target.value ? Number(event.target.value) : ""
                )
              }
            >
              <option value="">Todos os jogos</option>

              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <article className={styles.card}>
          <h2>Rodadas cadastradas</h2>

          {isLoading && (
            <div className={styles.message}>Carregando rodadas...</div>
          )}

          {!isLoading && filteredRounds.length === 0 && (
            <div className={styles.message}>
              Nenhuma rodada encontrada. Gere rodadas na tela de jogos.
            </div>
          )}

          {!isLoading && filteredRounds.length > 0 && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Jogo</th>
                    <th>Rodada</th>
                    <th>Período</th>
                    <th>Jogadas</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRounds.map((round) => (
                    <tr key={round.id}>
                      <td>
                        <strong>{round.game_name || `Jogo ${round.game}`}</strong>
                      </td>

                      <td>
                        <span className={styles.badge}>
                          Dia {round.day_number}
                        </span>
                      </td>

                      <td>
                        <div className={styles.period}>
                          <span>Início: {formatDateTime(round.starts_at)}</span>
                          <span>Fim: {formatDateTime(round.ends_at)}</span>
                        </div>
                      </td>

                      <td>
                        <span className={styles.badge}>
                          {round.plays_count ?? 0} jogada
                          {(round.plays_count ?? 0) === 1 ? "" : "s"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`${styles.badge} ${
                            round.is_active
                              ? styles.badgeActive
                              : styles.badgeInactive
                          }`}
                        >
                          {round.is_active ? "Ativa" : "Inativa"}
                        </span>
                      </td>

                      <td>
                        <div className={styles.actions}>
                          <button
                            className={styles.secondaryButton}
                            type="button"
                            onClick={() => handleActivateRound(round.id)}
                            disabled={isUpdating || round.is_active}
                          >
                            Ativar
                          </button>

                          <button
                            className={styles.dangerButton}
                            type="button"
                            onClick={() => handleCloseRound(round.id)}
                            disabled={isUpdating || !round.is_active}
                          >
                            Encerrar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </AdminLayout>
    </ProtectedRoute>
  );
}
