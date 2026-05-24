"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { getEvidences } from "@/services/evidenceService";
import { getGames } from "@/services/gameService";
import { getPlays } from "@/services/playService";
import { Evidence } from "@/types/evidences";
import { Game } from "@/types/games";
import { Play } from "@/types/plays";

import styles from "./AdminDashboardPage.module.css";

export default function AdminDashboardPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [plays, setPlays] = useState<Play[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadDashboard() {
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
    } catch {
      setErrorMessage("Não foi possível carregar os dados do dashboard.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalPoints = useMemo(() => {
    return plays.reduce((total, play) => total + play.total_points, 0);
  }, [plays]);

  const pendingEvidences = useMemo(() => {
    return evidences.filter((evidence) => evidence.status === "PENDING");
  }, [evidences]);

  const approvedEvidences = useMemo(() => {
    return evidences.filter((evidence) => evidence.status === "APPROVED");
  }, [evidences]);

  const recentPlays = useMemo(() => {
    return [...plays]
      .sort(
        (first, second) =>
          new Date(second.played_at).getTime() -
          new Date(first.played_at).getTime()
      )
      .slice(0, 5);
  }, [plays]);

  const recentPendingEvidences = useMemo(() => {
    return [...pendingEvidences]
      .sort(
        (first, second) =>
          new Date(second.created_at).getTime() -
          new Date(first.created_at).getTime()
      )
      .slice(0, 5);
  }, [pendingEvidences]);

  function formatDateTime(value: string) {
    return new Date(value).toLocaleString("pt-BR");
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <div className={styles.header}>
          <h1>Dashboard</h1>
          <p>
            Visão geral dos jogos, jogadas, pontuações e evidências enviadas
            pelos jogadores.
          </p>
        </div>

        {isLoading && (
          <div className={styles.message}>Carregando dashboard...</div>
        )}

        {!isLoading && errorMessage && (
          <div className={styles.error}>{errorMessage}</div>
        )}

        {!isLoading && !errorMessage && (
          <>
            <section className={styles.summaryGrid}>
              <article className={styles.summaryCard}>
                <span>Jogos cadastrados</span>
                <strong>{games.length}</strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Jogadas realizadas</span>
                <strong>{plays.length}</strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Pontos distribuídos</span>
                <strong>{totalPoints}</strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Evidências pendentes</span>
                <strong>{pendingEvidences.length}</strong>
              </article>
            </section>

            <section className={styles.quickActions}>
              <Link href="/admin/players">Gerenciar jogadores</Link>
              <Link href="/admin/groups">Gerenciar grupos</Link>
              <Link href="/admin/games">Gerenciar jogos</Link>
              <Link href="/admin/cards">Gerenciar cartas</Link>
              <Link href="/admin/plays">Ver jogadas</Link>
              <Link href="/admin/evidences">Revisar evidências</Link>
              <Link href="/admin/performance">Ver desempenho</Link>
            </section>

            <section className={styles.grid}>
              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2>Jogadas recentes</h2>
                  <Link href="/admin/plays">Ver todas</Link>
                </div>

                {recentPlays.length === 0 ? (
                  <div className={styles.empty}>
                    Nenhuma jogada realizada até o momento.
                  </div>
                ) : (
                  <div className={styles.list}>
                    {recentPlays.map((play) => (
                      <div className={styles.listItem} key={play.id}>
                        <div>
                          <strong>@{play.player_username}</strong>
                          <span>
                            {play.card_suit_symbol} {play.card_value} —{" "}
                            {play.card_title}
                          </span>
                          <small>{formatDateTime(play.played_at)}</small>
                        </div>

                        <div className={styles.points}>
                          <strong>{play.total_points}</strong>
                          <span>pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2>Evidências pendentes</h2>
                  <Link href="/admin/evidences">Revisar</Link>
                </div>

                {recentPendingEvidences.length === 0 ? (
                  <div className={styles.empty}>
                    Nenhuma evidência pendente no momento.
                  </div>
                ) : (
                  <div className={styles.list}>
                    {recentPendingEvidences.map((evidence) => (
                      <div className={styles.listItem} key={evidence.id}>
                        <div>
                          <strong>
                            {evidence.player_name || evidence.player_username}
                          </strong>
                          <span>
                            {evidence.card_suit_symbol} {evidence.card_value} —{" "}
                            {evidence.card_title}
                          </span>
                          <small>{formatDateTime(evidence.created_at)}</small>
                        </div>

                        <span className={styles.badge}>Pendente</span>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </section>

            <section className={styles.grid}>
              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2>Status das evidências</h2>
                </div>

                <div className={styles.statusGrid}>
                  <div>
                    <span>Pendentes</span>
                    <strong>{pendingEvidences.length}</strong>
                  </div>

                  <div>
                    <span>Aprovadas</span>
                    <strong>{approvedEvidences.length}</strong>
                  </div>

                  <div>
                    <span>Total</span>
                    <strong>{evidences.length}</strong>
                  </div>
                </div>
              </article>

              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2>Próximas ações sugeridas</h2>
                </div>

                <div className={styles.todoList}>
                  <span>1. Revisar evidências pendentes.</span>
                  <span>2. Conferir ranking e desempenho dos grupos.</span>
                  <span>3. Verificar se todos os jogadores estão vinculados a grupos.</span>
                  <span>4. Acompanhar jogadas recentes após cada rodada.</span>
                </div>
              </article>
            </section>
          </>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
