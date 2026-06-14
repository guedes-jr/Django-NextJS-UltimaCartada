"use client";

import { useEffect, useMemo, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { getEvidences } from "@/services/evidenceService";
import { getGames } from "@/services/gameService";
import { getPlays } from "@/services/playService";
import { Evidence, EvidenceStatus } from "@/types/evidences";
import { Game } from "@/types/games";
import { Play, PlayStatus } from "@/types/plays";

import styles from "./AdminReportsPage.module.css";

type FilterOption = "ALL";
type CsvCell = string | number | boolean | null | undefined;

type PlayerPerformance = {
  playerUsername: string;
  totalPoints: number;
  basePoints: number;
  bonusPoints: number;
  totalPlays: number;
  validPlays: number;
  approvedEvidences: number;
  pendingEvidences: number;
  rejectedEvidences: number;
};

const playStatusLabels: Record<PlayStatus, string> = {
  PENDING: "Pendente",
  VALID: "Válida",
  INVALID: "Inválida",
  CANCELED: "Cancelada",
};

const evidenceStatusLabels: Record<EvidenceStatus, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
};

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString("pt-BR");
}

function formatDateInput(value: Date) {
  return value.toISOString().slice(0, 10);
}

export default function AdminReportsPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [plays, setPlays] = useState<Play[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | FilterOption>(
    "ALL"
  );
  const [selectedPlayStatus, setSelectedPlayStatus] = useState<
    PlayStatus | FilterOption
  >("ALL");
  const [selectedEvidenceStatus, setSelectedEvidenceStatus] = useState<
    EvidenceStatus | FilterOption
  >("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
      setErrorMessage("Não foi possível carregar os dados dos relatórios.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, []);

  const filteredPlays = useMemo(() => {
    const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const end = endDate ? new Date(`${endDate}T23:59:59`) : null;

    return plays.filter((play) => {
      const playedAt = new Date(play.played_at);
      const isGameMatch =
        selectedGameId === "ALL" || play.game === selectedGameId;
      const isStatusMatch =
        selectedPlayStatus === "ALL" || play.status === selectedPlayStatus;
      const isAfterStart = !start || playedAt >= start;
      const isBeforeEnd = !end || playedAt <= end;

      return isGameMatch && isStatusMatch && isAfterStart && isBeforeEnd;
    });
  }, [plays, selectedGameId, selectedPlayStatus, startDate, endDate]);

  const filteredEvidences = useMemo(() => {
    const filteredPlayIds = new Set(filteredPlays.map((play) => play.id));

    return evidences.filter((evidence) => {
      const isStatusMatch =
        selectedEvidenceStatus === "ALL" ||
        evidence.status === selectedEvidenceStatus;

      return filteredPlayIds.has(evidence.play) && isStatusMatch;
    });
  }, [evidences, filteredPlays, selectedEvidenceStatus]);

  const totalPoints = useMemo(() => {
    return filteredPlays.reduce((total, play) => total + play.total_points, 0);
  }, [filteredPlays]);

  const bonusPoints = useMemo(() => {
    return filteredPlays.reduce((total, play) => total + play.bonus_points, 0);
  }, [filteredPlays]);

  const pendingEvidences = filteredEvidences.filter(
    (evidence) => evidence.status === "PENDING"
  ).length;

  const approvedEvidences = filteredEvidences.filter(
    (evidence) => evidence.status === "APPROVED"
  ).length;

  const rejectedEvidences = filteredEvidences.filter(
    (evidence) => evidence.status === "REJECTED"
  ).length;

  const playerPerformance = useMemo(() => {
    const map = new Map<string, PlayerPerformance>();

    for (const play of filteredPlays) {
      const current = map.get(play.player_username) ?? {
        playerUsername: play.player_username,
        totalPoints: 0,
        basePoints: 0,
        bonusPoints: 0,
        totalPlays: 0,
        validPlays: 0,
        approvedEvidences: 0,
        pendingEvidences: 0,
        rejectedEvidences: 0,
      };

      current.totalPoints += play.total_points;
      current.basePoints += play.base_points;
      current.bonusPoints += play.bonus_points;
      current.totalPlays += 1;

      if (play.status === "VALID") {
        current.validPlays += 1;
      }

      map.set(play.player_username, current);
    }

    for (const evidence of filteredEvidences) {
      const play = filteredPlays.find((item) => item.id === evidence.play);

      if (!play) {
        continue;
      }

      const current = map.get(play.player_username);

      if (!current) {
        continue;
      }

      if (evidence.status === "APPROVED") {
        current.approvedEvidences += 1;
      }

      if (evidence.status === "PENDING") {
        current.pendingEvidences += 1;
      }

      if (evidence.status === "REJECTED") {
        current.rejectedEvidences += 1;
      }

      map.set(play.player_username, current);
    }

    return Array.from(map.values()).sort(
      (first, second) => second.totalPoints - first.totalPoints
    );
  }, [filteredPlays, filteredEvidences]);

  const latestPlays = useMemo(() => {
    return [...filteredPlays]
      .sort(
        (first, second) =>
          new Date(second.played_at).getTime() -
          new Date(first.played_at).getTime()
      )
      .slice(0, 8);
  }, [filteredPlays]);

  const latestEvidences = useMemo(() => {
    return [...filteredEvidences]
      .sort(
        (first, second) =>
          new Date(second.created_at).getTime() -
          new Date(first.created_at).getTime()
      )
      .slice(0, 8);
  }, [filteredEvidences]);

  function getGameName(gameId: number) {
    return games.find((game) => game.id === gameId)?.name ?? `Jogo ${gameId}`;
  }

  function escapeCsvValue(value: CsvCell) {
    if (value === null || value === undefined) {
      return "";
    }

    const normalized = String(value).replace(/"/g, '""');

    return `"${normalized}"`;
  }

  function getReportSuffix() {
    const date = formatDateInput(new Date());
    const game =
      selectedGameId === "ALL" ? "todos-os-jogos" : `jogo-${selectedGameId}`;

    return `${game}-${date}`;
  }

  function downloadCsv(filename: string, headers: string[], rows: CsvCell[][]) {
    const csvContent = [
      headers.map(escapeCsvValue).join(";"),
      ...rows.map((row) => row.map(escapeCsvValue).join(";")),
    ].join("\n");

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  }

  function resetFilters() {
    setSelectedGameId("ALL");
    setSelectedPlayStatus("ALL");
    setSelectedEvidenceStatus("ALL");
    setStartDate("");
    setEndDate("");
  }

  function exportPlays() {
    downloadCsv(
      `relatorio-jogadas-${getReportSuffix()}.csv`,
      [
        "ID",
        "Jogador",
        "Jogo",
        "Grupo",
        "Rodada",
        "Carta",
        "Naipe",
        "Valor",
        "Pontos Base",
        "Bonus",
        "Pontos Totais",
        "Status",
        "Dentro do Horario",
        "Iniciou Rodada",
        "Data da Jogada",
      ],
      filteredPlays.map((play) => [
        play.id,
        play.player_username,
        getGameName(play.game),
        play.group,
        play.round_day,
        play.card_title,
        play.card_suit,
        play.card_value,
        play.base_points,
        play.bonus_points,
        play.total_points,
        playStatusLabels[play.status],
        play.is_within_time ? "Sim" : "Não",
        play.is_round_starter ? "Sim" : "Não",
        formatDateTime(play.played_at),
      ])
    );
  }

  function exportEvidences() {
    downloadCsv(
      `relatorio-evidencias-${getReportSuffix()}.csv`,
      [
        "ID",
        "Jogador",
        "Jogo",
        "Carta",
        "Rodada",
        "Texto",
        "Arquivo",
        "Status",
        "Observacao Admin",
        "Criada em",
        "Revisada em",
      ],
      filteredEvidences.map((evidence) => [
        evidence.id,
        evidence.player_name || evidence.player_username,
        evidence.game_name,
        evidence.card_title,
        evidence.round_day,
        evidence.text,
        evidence.file || "",
        evidenceStatusLabels[evidence.status],
        evidence.admin_notes,
        formatDateTime(evidence.created_at),
        formatDateTime(evidence.reviewed_at),
      ])
    );
  }

  function exportPerformance() {
    downloadCsv(
      `relatorio-desempenho-${getReportSuffix()}.csv`,
      [
        "Jogador",
        "Pontos Totais",
        "Pontos Base",
        "Bonus",
        "Total Jogadas",
        "Jogadas Validas",
        "Evidencias Aprovadas",
        "Evidencias Pendentes",
        "Evidencias Rejeitadas",
      ],
      playerPerformance.map((player) => [
        player.playerUsername,
        player.totalPoints,
        player.basePoints,
        player.bonusPoints,
        player.totalPlays,
        player.validPlays,
        player.approvedEvidences,
        player.pendingEvidences,
        player.rejectedEvidences,
      ])
    );
  }

  function exportCompleteReport() {
    const rows: CsvCell[][] = [
      ["Indicador", "Valor"],
      ["Jogos cadastrados", games.length],
      ["Jogadas filtradas", filteredPlays.length],
      ["Pontos filtrados", totalPoints],
      ["Bonus por evidencias", bonusPoints],
      ["Evidencias filtradas", filteredEvidences.length],
      ["Evidencias aprovadas", approvedEvidences],
      ["Evidencias pendentes", pendingEvidences],
      ["Evidencias rejeitadas", rejectedEvidences],
      ["Jogadores com pontuacao", playerPerformance.length],
      [],
      [
        "Jogador",
        "Pontos",
        "Jogadas",
        "Validas",
        "Aprovadas",
        "Pendentes",
        "Rejeitadas",
      ],
      ...playerPerformance.map((player) => [
        player.playerUsername,
        player.totalPoints,
        player.totalPlays,
        player.validPlays,
        player.approvedEvidences,
        player.pendingEvidences,
        player.rejectedEvidences,
      ]),
    ];

    downloadCsv(
      `relatorio-geral-${getReportSuffix()}.csv`,
      ["Campo 1", "Campo 2", "Campo 3", "Campo 4", "Campo 5", "Campo 6", "Campo 7"],
      rows
    );
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "GAME_MEDIATOR"]}>
      <AdminLayout>
        <div className={styles.header}>
          <h1>Relatórios</h1>
          <p>
            Gere relatórios administrativos com filtros por jogo, período,
            jogadas e evidências. Os arquivos são exportados em CSV.
          </p>
        </div>

        {isLoading && (
          <div className={styles.message}>Carregando relatórios...</div>
        )}

        {!isLoading && errorMessage && (
          <div className={styles.error}>{errorMessage}</div>
        )}

        {!isLoading && !errorMessage && (
          <>
            <section className={styles.filters}>
              <div className={styles.field}>
                <label htmlFor="report-game">Jogo</label>
                <select
                  id="report-game"
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

              <div className={styles.field}>
                <label htmlFor="report-start-date">Início</label>
                <input
                  id="report-start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="report-end-date">Fim</label>
                <input
                  id="report-end-date"
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="report-play-status">Status da jogada</label>
                <select
                  id="report-play-status"
                  value={selectedPlayStatus}
                  onChange={(event) =>
                    setSelectedPlayStatus(
                      event.target.value as PlayStatus | FilterOption
                    )
                  }
                >
                  <option value="ALL">Todos</option>
                  <option value="PENDING">Pendente</option>
                  <option value="VALID">Válida</option>
                  <option value="INVALID">Inválida</option>
                  <option value="CANCELED">Cancelada</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="report-evidence-status">
                  Status da evidência
                </label>
                <select
                  id="report-evidence-status"
                  value={selectedEvidenceStatus}
                  onChange={(event) =>
                    setSelectedEvidenceStatus(
                      event.target.value as EvidenceStatus | FilterOption
                    )
                  }
                >
                  <option value="ALL">Todos</option>
                  <option value="PENDING">Pendente</option>
                  <option value="APPROVED">Aprovada</option>
                  <option value="REJECTED">Rejeitada</option>
                </select>
              </div>

              <button
                className={styles.secondaryButton}
                type="button"
                onClick={resetFilters}
              >
                Limpar filtros
              </button>
            </section>

            <section className={styles.summaryGrid}>
              <article className={styles.summaryItem}>
                <span>Jogadas</span>
                <strong>{filteredPlays.length}</strong>
              </article>

              <article className={styles.summaryItem}>
                <span>Pontos</span>
                <strong>{totalPoints}</strong>
              </article>

              <article className={styles.summaryItem}>
                <span>Bônus</span>
                <strong>{bonusPoints}</strong>
              </article>

              <article className={styles.summaryItem}>
                <span>Evidências</span>
                <strong>{filteredEvidences.length}</strong>
              </article>

              <article className={styles.summaryItem}>
                <span>Aprovadas</span>
                <strong>{approvedEvidences}</strong>
              </article>

              <article className={styles.summaryItem}>
                <span>Pendentes</span>
                <strong>{pendingEvidences}</strong>
              </article>

              <article className={styles.summaryItem}>
                <span>Rejeitadas</span>
                <strong>{rejectedEvidences}</strong>
              </article>

              <article className={styles.summaryItem}>
                <span>Jogadores</span>
                <strong>{playerPerformance.length}</strong>
              </article>
            </section>

            <section className={styles.exportGrid}>
              <article className={styles.card}>
                <h2>Relatório geral</h2>
                <p>
                  Consolida indicadores principais e ranking dos jogadores para
                  o filtro atual.
                </p>

                <button
                  className={styles.button}
                  type="button"
                  onClick={exportCompleteReport}
                  disabled={filteredPlays.length === 0}
                >
                  Baixar CSV geral
                </button>
              </article>

              <article className={styles.card}>
                <h2>Jogadas</h2>
                <p>
                  Exporta carta, rodada, pontuação, validade e horário de cada
                  jogada filtrada.
                </p>

                <button
                  className={styles.button}
                  type="button"
                  onClick={exportPlays}
                  disabled={filteredPlays.length === 0}
                >
                  Baixar CSV de jogadas
                </button>
              </article>

              <article className={styles.card}>
                <h2>Evidências</h2>
                <p>
                  Exporta evidências enviadas, revisão, observações e vínculo
                  com carta e rodada.
                </p>

                <button
                  className={styles.button}
                  type="button"
                  onClick={exportEvidences}
                  disabled={filteredEvidences.length === 0}
                >
                  Baixar CSV de evidências
                </button>
              </article>

              <article className={styles.card}>
                <h2>Desempenho</h2>
                <p>
                  Exporta ranking consolidado de jogadores com pontos, jogadas
                  e evidências.
                </p>

                <button
                  className={styles.button}
                  type="button"
                  onClick={exportPerformance}
                  disabled={playerPerformance.length === 0}
                >
                  Baixar CSV de desempenho
                </button>
              </article>
            </section>

            <section className={styles.previewGrid}>
              <article className={styles.tableCard}>
                <div className={styles.tableHeader}>
                  <h2>Desempenho por jogador</h2>
                  <span>{playerPerformance.length} jogadores</span>
                </div>

                {playerPerformance.length === 0 ? (
                  <div className={styles.message}>
                    Nenhum desempenho encontrado para os filtros selecionados.
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
                        {playerPerformance.map((player, index) => (
                          <tr key={player.playerUsername}>
                            <td>
                              <span className={styles.positionBadge}>
                                {index + 1}
                              </span>
                            </td>
                            <td>@{player.playerUsername}</td>
                            <td>{player.totalPoints}</td>
                            <td>
                              {player.validPlays}/{player.totalPlays}
                            </td>
                            <td>
                              Aprovadas: {player.approvedEvidences} Pendentes:{" "}
                              {player.pendingEvidences} Rejeitadas:{" "}
                              {player.rejectedEvidences}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>

              <article className={styles.tableCard}>
                <div className={styles.tableHeader}>
                  <h2>Últimas jogadas</h2>
                  <span>{filteredPlays.length} registros</span>
                </div>

                {latestPlays.length === 0 ? (
                  <div className={styles.message}>
                    Nenhuma jogada encontrada para os filtros selecionados.
                  </div>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Jogador</th>
                          <th>Jogo</th>
                          <th>Carta</th>
                          <th>Pontos</th>
                          <th>Status</th>
                          <th>Data</th>
                        </tr>
                      </thead>

                      <tbody>
                        {latestPlays.map((play) => (
                          <tr key={play.id}>
                            <td>@{play.player_username}</td>
                            <td>{getGameName(play.game)}</td>
                            <td>{play.card_title}</td>
                            <td>{play.total_points}</td>
                            <td>
                              <span className={styles.statusBadge}>
                                {playStatusLabels[play.status]}
                              </span>
                            </td>
                            <td>{formatDateTime(play.played_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>

              <article className={styles.tableCard}>
                <div className={styles.tableHeader}>
                  <h2>Últimas evidências</h2>
                  <span>{filteredEvidences.length} registros</span>
                </div>

                {latestEvidences.length === 0 ? (
                  <div className={styles.message}>
                    Nenhuma evidência encontrada para os filtros selecionados.
                  </div>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Jogador</th>
                          <th>Jogo</th>
                          <th>Carta</th>
                          <th>Status</th>
                          <th>Criada em</th>
                        </tr>
                      </thead>

                      <tbody>
                        {latestEvidences.map((evidence) => (
                          <tr key={evidence.id}>
                            <td>
                              {evidence.player_name || evidence.player_username}
                            </td>
                            <td>{evidence.game_name}</td>
                            <td>{evidence.card_title}</td>
                            <td>
                              <span className={styles.statusBadge}>
                                {evidenceStatusLabels[evidence.status]}
                              </span>
                            </td>
                            <td>{formatDateTime(evidence.created_at)}</td>
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
