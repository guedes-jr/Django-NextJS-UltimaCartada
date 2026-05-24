"use client";

import { useEffect, useMemo, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { getEvidences } from "@/services/evidenceService";
import { getPlays } from "@/services/playService";
import { Evidence } from "@/types/evidences";
import { Play } from "@/types/plays";

import styles from "./PlayerPerformancePage.module.css";

export default function PlayerPerformancePage() {
  const [plays, setPlays] = useState<Play[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [playsData, evidencesData] = await Promise.all([
        getPlays(),
        getEvidences(),
      ]);

      setPlays(playsData);
      setEvidences(evidencesData);
    } catch {
      setErrorMessage("Não foi possível carregar seu desempenho.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const totalPoints = useMemo(() => {
    return plays.reduce((total, play) => total + play.total_points, 0);
  }, [plays]);

  const basePoints = useMemo(() => {
    return plays.reduce((total, play) => total + play.base_points, 0);
  }, [plays]);

  const bonusPoints = useMemo(() => {
    return plays.reduce((total, play) => total + play.bonus_points, 0);
  }, [plays]);

  const pendingEvidences = evidences.filter(
    (evidence) => evidence.status === "PENDING"
  ).length;

  const approvedEvidences = evidences.filter(
    (evidence) => evidence.status === "APPROVED"
  ).length;

  const rejectedEvidences = evidences.filter(
    (evidence) => evidence.status === "REJECTED"
  ).length;

  function getEvidenceByPlay(playId: number) {
    return evidences.find((evidence) => evidence.play === playId);
  }

  function getEvidenceStatusLabel(status?: string) {
    const labels: Record<string, string> = {
      PENDING: "Pendente",
      APPROVED: "Aprovada",
      REJECTED: "Rejeitada",
    };

    if (!status) {
      return "Não enviada";
    }

    return labels[status] ?? status;
  }

  function getEvidenceStatusClass(status?: string) {
    const classes: Record<string, string> = {
      PENDING: styles.pending,
      APPROVED: styles.approved,
      REJECTED: styles.rejected,
    };

    if (!status) {
      return "";
    }

    return classes[status] ?? "";
  }

  function formatDateTime(value: string) {
    return new Date(value).toLocaleString("pt-BR");
  }

  return (
    <ProtectedRoute allowedRoles={["PLAYER"]}>
      <PlayerLayout>
        <div className={styles.header}>
          <h1>Meu desempenho</h1>
          <p>
            Acompanhe sua pontuação, suas jogadas e o status das evidências
            enviadas.
          </p>
        </div>

        {isLoading && (
          <div className={styles.message}>Carregando desempenho...</div>
        )}

        {!isLoading && errorMessage && (
          <div className={styles.error}>{errorMessage}</div>
        )}

        {!isLoading && !errorMessage && (
          <>
            <section className={styles.summaryGrid}>
              <article className={styles.summaryCard}>
                <span>Pontos totais</span>
                <strong>{totalPoints}</strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Pontos base</span>
                <strong>{basePoints}</strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Bônus</span>
                <strong>{bonusPoints}</strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Jogadas</span>
                <strong>{plays.length}</strong>
              </article>
            </section>

            <section className={styles.summaryGrid}>
              <article className={styles.summaryCard}>
                <span>Evidências pendentes</span>
                <strong>{pendingEvidences}</strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Evidências aprovadas</span>
                <strong>{approvedEvidences}</strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Evidências rejeitadas</span>
                <strong>{rejectedEvidences}</strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Total de evidências</span>
                <strong>{evidences.length}</strong>
              </article>
            </section>

            <section className={styles.section}>
              <h2>Histórico de jogadas</h2>

              {plays.length === 0 ? (
                <div className={styles.message}>
                  Você ainda não realizou nenhuma jogada.
                </div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Carta</th>
                        <th>Rodada</th>
                        <th>Pontos</th>
                        <th>Status da jogada</th>
                        <th>Evidência</th>
                        <th>Data</th>
                      </tr>
                    </thead>

                    <tbody>
                      {plays.map((play) => {
                        const evidence = getEvidenceByPlay(play.id);

                        return (
                          <tr key={play.id}>
                            <td>
                              <div className={styles.cardInfo}>
                                <strong>{play.card_title}</strong>
                                <span>
                                  {play.card_suit_symbol} {play.card_value} •{" "}
                                  {play.card_suit}
                                </span>
                              </div>
                            </td>

                            <td>Dia {play.round_day}</td>

                            <td>
                              {play.total_points}
                              <br />
                              <span>
                                Base {play.base_points} / Bônus{" "}
                                {play.bonus_points}
                              </span>
                            </td>

                            <td>
                              <span className={styles.badge}>{play.status}</span>
                            </td>

                            <td>
                              <span
                                className={`${styles.badge} ${getEvidenceStatusClass(
                                  evidence?.status
                                )}`}
                              >
                                {getEvidenceStatusLabel(evidence?.status)}
                              </span>
                            </td>

                            <td>{formatDateTime(play.played_at)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </PlayerLayout>
    </ProtectedRoute>
  );
}
