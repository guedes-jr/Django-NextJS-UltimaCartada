"use client";

import { useEffect, useMemo, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { getEvidences } from "@/services/evidenceService";
import { getGames } from "@/services/gameService";
import { getPlays } from "@/services/playService";
import { Evidence } from "@/types/evidences";
import { Game } from "@/types/games";
import { Play } from "@/types/plays";

import styles from "./AdminPerformancePage.module.css";

type PlayerRankingItem = {
  playerUsername: string;
  totalPoints: number;
  basePoints: number;
  bonusPoints: number;
  totalPlays: number;
  validPlays: number;
  pendingEvidences: number;
  approvedEvidences: number;
  rejectedEvidences: number;
};

type GroupRankingItem = {
  groupId: number;
  groupName: string;
  totalPoints: number;
  totalPlays: number;
  players: Set<string>;
};

export default function AdminPerformancePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [plays, setPlays] = useState<Play[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | "ALL">("ALL");
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
    } catch {
      setErrorMessage("Não foi possível carregar os dados de desempenho.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, []);

  const filteredPlays = useMemo(() => {
    if (selectedGameId === "ALL") {
      return plays;
    }

    return plays.filter((play) => play.game === selectedGameId);
  }, [plays, selectedGameId]);

  const filteredEvidences = useMemo(() => {
    const filteredPlayIds = new Set(filteredPlays.map((play) => play.id));

    return evidences.filter((evidence) => filteredPlayIds.has(evidence.play));
  }, [evidences, filteredPlays]);

  const playerRanking = useMemo(() => {
    const ranking = new Map<string, PlayerRankingItem>();

    for (const play of filteredPlays) {
      const current = ranking.get(play.player_username) ?? {
        playerUsername: play.player_username,
        totalPoints: 0,
        basePoints: 0,
        bonusPoints: 0,
        totalPlays: 0,
        validPlays: 0,
        pendingEvidences: 0,
        approvedEvidences: 0,
        rejectedEvidences: 0,
      };

      current.totalPoints += play.total_points;
      current.basePoints += play.base_points;
      current.bonusPoints += play.bonus_points;
      current.totalPlays += 1;

      if (play.status === "VALID") {
        current.validPlays += 1;
      }

      ranking.set(play.player_username, current);
    }

    for (const evidence of filteredEvidences) {
      const play = filteredPlays.find((item) => item.id === evidence.play);

      if (!play) {
        continue;
      }

      const current = ranking.get(play.player_username);

      if (!current) {
        continue;
      }

      if (evidence.status === "PENDING") {
        current.pendingEvidences += 1;
      }

      if (evidence.status === "APPROVED") {
        current.approvedEvidences += 1;
      }

      if (evidence.status === "REJECTED") {
        current.rejectedEvidences += 1;
      }

      ranking.set(play.player_username, current);
    }

    return Array.from(ranking.values()).sort(
      (first, second) => second.totalPoints - first.totalPoints
    );
  }, [filteredPlays, filteredEvidences]);

  const groupRanking = useMemo(() => {
    const ranking = new Map<number, GroupRankingItem>();

    for (const play of filteredPlays) {
      const game = games.find((item) => item.id === play.game);

      const current = ranking.get(play.group) ?? {
        groupId: play.group,
        groupName: game?.group_name ?? `Grupo ${play.group}`,
        totalPoints: 0,
        totalPlays: 0,
        players: new Set<string>(),
      };

      current.totalPoints += play.total_points;
      current.totalPlays += 1;
      current.players.add(play.player_username);

      ranking.set(play.group, current);
    }

    return Array.from(ranking.values()).sort(
      (first, second) => second.totalPoints - first.totalPoints
    );
  }, [filteredPlays, games]);

  const totalPoints = filteredPlays.reduce(
    (total, play) => total + play.total_points,
    0
  );

  const totalBonusPoints = filteredPlays.reduce(
    (total, play) => total + play.bonus_points,
    0
  );

  const pendingEvidences = filteredEvidences.filter(
    (evidence) => evidence.status === "PENDING"
  ).length;

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "GAME_MEDIATOR"]}>
      <AdminLayout>
        <div className={styles.header}>
          <h1>Desempenho</h1>
          <p>
            Acompanhe pontuação, participação e evidências dos jogadores e
            grupos.
          </p>
        </div>

        {errorMessage && <div className={styles.error}>{errorMessage}</div>}

        <section className={styles.filters}>
          <div className={styles.field}>
            <label htmlFor="game">Filtrar por jogo</label>
            <select
              id="game"
              value={selectedGameId}
              onChange={(event) => {
                const value = event.target.value;
                setSelectedGameId(value === "ALL" ? "ALL" : Number(value));
              }}
            >
              <option value="ALL">Todos os jogos</option>

              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name} - {game.group_name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {isLoading && (
          <div className={styles.message}>Carregando desempenho...</div>
        )}

        {!isLoading && !errorMessage && (
          <>
            <section className={styles.summaryGrid}>
              <article className={styles.summaryCard}>
                <span>Pontos totais</span>
                <strong>{totalPoints}</strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Bônus por evidência</span>
                <strong>{totalBonusPoints}</strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Jogadas realizadas</span>
                <strong>{filteredPlays.length}</strong>
              </article>

              <article className={styles.summaryCard}>
                <span>Evidências pendentes</span>
                <strong>{pendingEvidences}</strong>
              </article>
            </section>

            <section className={styles.grid}>
              <article className={styles.card}>
                <h2>Ranking individual</h2>

                {playerRanking.length === 0 ? (
                  <div className={styles.message}>
                    Nenhuma jogada encontrada para este filtro.
                  </div>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Jogador</th>
                          <th>Pontos</th>
                          <th>Jogadas</th>
                          <th>Evidências</th>
                        </tr>
                      </thead>

                      <tbody>
                        {playerRanking.map((player, index) => (
                          <tr key={player.playerUsername}>
                            <td>
                              <span className={styles.positionBadge}>
                                {index + 1}
                              </span>
                            </td>

                            <td>
                              <div className={styles.playerInfo}>
                                <strong>@{player.playerUsername}</strong>
                                <span>
                                  Base: {player.basePoints} • Bônus:{" "}
                                  {player.bonusPoints}
                                </span>
                              </div>
                            </td>

                            <td>{player.totalPoints}</td>

                            <td>{player.totalPlays}</td>

                            <td>
                              Aprovadas: {player.approvedEvidences} • Pendentes:{" "}
                              {player.pendingEvidences} • Rejeitadas:{" "}
                              {player.rejectedEvidences}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>

              <article className={styles.card}>
                <h2>Desempenho por grupo</h2>

                {groupRanking.length === 0 ? (
                  <div className={styles.message}>
                    Nenhum grupo com jogadas para este filtro.
                  </div>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Grupo</th>
                          <th>Pontos</th>
                          <th>Jogadas</th>
                          <th>Jogadores</th>
                        </tr>
                      </thead>

                      <tbody>
                        {groupRanking.map((group) => (
                          <tr key={group.groupId}>
                            <td>{group.groupName}</td>
                            <td>{group.totalPoints}</td>
                            <td>{group.totalPlays}</td>
                            <td>{group.players.size}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>
            </section>
          </>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
