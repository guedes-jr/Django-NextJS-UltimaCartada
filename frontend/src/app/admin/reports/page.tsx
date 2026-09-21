"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { getGames } from "@/services/gameService";
import { getGroups } from "@/services/groupService";
import { getJourneys } from "@/services/journeyService";
import {
  downloadPeriodicReport,
  getPeriodicReportSummary,
  getReportTimeseries,
} from "@/services/reportService";
import { Game } from "@/types/games";
import { PlayerGroup } from "@/types/groups";
import { Journey } from "@/types/journeys";
import {
  PeriodicReportSummary,
  ReportFilters,
  ReportTimeseriesItem,
} from "@/types/reports";

import styles from "./AdminReportsPage.module.css";

const now = new Date();
const INITIAL_FILTERS: ReportFilters = {
  period: "quarter",
  year: now.getFullYear(),
  quarter: Math.floor(now.getMonth() / 3) + 1,
};

const quarterLabels = [
  { value: 1, label: "1º trimestre • Jan–Mar" },
  { value: 2, label: "2º trimestre • Abr–Jun" },
  { value: 3, label: "3º trimestre • Jul–Set" },
  { value: 4, label: "4º trimestre • Out–Dez" },
];

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export default function AdminReportsPage() {
  const [groups, setGroups] = useState<PlayerGroup[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [filters, setFilters] = useState<ReportFilters>(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<ReportFilters>(INITIAL_FILTERS);
  const [summary, setSummary] = useState<PeriodicReportSummary | null>(null);
  const [timeseries, setTimeseries] = useState<ReportTimeseriesItem[]>([]);
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const [isLoadingReport, setIsLoadingReport] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadContext() {
      try {
        setIsLoadingContext(true);
        const [groupsData, gamesData, journeysData] = await Promise.all([
          getGroups(),
          getGames(),
          getJourneys(),
        ]);
        setGroups(groupsData);
        setGames(gamesData);
        setJourneys(journeysData);
      } catch {
        setErrorMessage("Não foi possível carregar os filtros do relatório.");
      } finally {
        setIsLoadingContext(false);
      }
    }
    void loadContext();
  }, []);

  useEffect(() => {
    async function loadReport() {
      try {
        setIsLoadingReport(true);
        setErrorMessage("");
        const [summaryData, timeseriesData] = await Promise.all([
          getPeriodicReportSummary(appliedFilters),
          getReportTimeseries(appliedFilters),
        ]);
        setSummary(summaryData);
        setTimeseries(timeseriesData);
      } catch {
        setSummary(null);
        setTimeseries([]);
        setErrorMessage("Não foi possível consolidar o relatório selecionado.");
      } finally {
        setIsLoadingReport(false);
      }
    }
    void loadReport();
  }, [appliedFilters]);

  const filteredGames = useMemo(
    () =>
      games.filter(
        (game) =>
          (!filters.group || game.group === filters.group) &&
          (!filters.journey || game.journey_id === filters.journey)
      ),
    [filters.group, filters.journey, games]
  );

  function updateFilter<K extends keyof ReportFilters>(
    key: K,
    value: ReportFilters[K]
  ) {
    setFilters((current) => {
      const next = { ...current, [key]: value };
      if (key === "period" && value === "year") delete next.quarter;
      if (key === "period" && value === "quarter" && !next.quarter) {
        next.quarter = 1;
      }
      if (key === "group" || key === "journey") delete next.game;
      return next;
    });
  }

  async function exportReport() {
    try {
      setIsExporting(true);
      setErrorMessage("");
      await downloadPeriodicReport(appliedFilters);
    } catch {
      setErrorMessage("Não foi possível exportar o relatório CSV.");
    } finally {
      setIsExporting(false);
    }
  }

  const totals = summary?.totals;

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "GAME_MEDIATOR"]}>
      <AdminLayout>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Inteligência de desempenho</span>
            <h1>Relatórios periódicos</h1>
            <p>
              Compare participação, pontuação e qualidade das evidências em
              recortes trimestrais ou anuais.
            </p>
          </div>
          <button
            className={styles.exportButton}
            type="button"
            onClick={() => void exportReport()}
            disabled={isExporting || !summary}
          >
            {isExporting ? "Preparando CSV..." : "Exportar relatório CSV"}
          </button>
        </header>

        <section className={styles.periodSwitch}>
          <button
            type="button"
            className={filters.period === "quarter" ? styles.activePeriod : ""}
            onClick={() => updateFilter("period", "quarter")}
          >
            Relatório trimestral
          </button>
          <button
            type="button"
            className={filters.period === "year" ? styles.activePeriod : ""}
            onClick={() => updateFilter("period", "year")}
          >
            Relatório anual
          </button>
        </section>

        <section className={styles.filters}>
          <label>
            Ano
            <input
              type="number"
              min={2000}
              max={2100}
              value={filters.year}
              onChange={(event) => updateFilter("year", Number(event.target.value))}
            />
          </label>
          {filters.period === "quarter" && (
            <label>
              Trimestre
              <select
                value={filters.quarter}
                onChange={(event) => updateFilter("quarter", Number(event.target.value))}
              >
                {quarterLabels.map((quarter) => (
                  <option key={quarter.value} value={quarter.value}>{quarter.label}</option>
                ))}
              </select>
            </label>
          )}
          <label>
            Jornada
            <select
              value={filters.journey ?? ""}
              onChange={(event) => updateFilter("journey", Number(event.target.value) || undefined)}
            >
              <option value="">Todas as Jornadas</option>
              {journeys.map((journey) => <option key={journey.id} value={journey.id}>{journey.name}</option>)}
            </select>
          </label>
          <label>
            Grupo
            <select
              value={filters.group ?? ""}
              onChange={(event) => updateFilter("group", Number(event.target.value) || undefined)}
            >
              <option value="">Todos os grupos</option>
              {groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
            </select>
          </label>
          <label>
            Jogo
            <select
              value={filters.game ?? ""}
              onChange={(event) => updateFilter("game", Number(event.target.value) || undefined)}
            >
              <option value="">Todos os jogos</option>
              {filteredGames.map((game) => <option key={game.id} value={game.id}>{game.name}</option>)}
            </select>
          </label>
          <button
            className={styles.applyButton}
            type="button"
            disabled={isLoadingContext || isLoadingReport}
            onClick={() => setAppliedFilters({ ...filters })}
          >
            Atualizar relatório
          </button>
        </section>

        {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        {isLoadingReport ? (
          <div className={styles.state}>Consolidando dados do período...</div>
        ) : summary && totals ? (
          <>
            <section className={styles.periodBanner}>
              <div>
                <span>Período analisado</span>
                <strong>{summary.period.label}</strong>
              </div>
              <p>{formatDate(summary.period.start_date)} a {formatDate(summary.period.end_date)}</p>
            </section>

            <section className={styles.summaryGrid}>
              <article><span>Participação</span><strong>{totals.participation_rate}%</strong><small>{totals.active_players} de {totals.eligible_players} jogadores ativos</small></article>
              <article><span>Jogadas</span><strong>{formatNumber(totals.total_plays)}</strong><small>{formatNumber(totals.valid_plays)} válidas no período</small></article>
              <article><span>Pontuação</span><strong>{formatNumber(totals.total_points)}</strong><small>{formatNumber(totals.bonus_points)} pontos de bônus</small></article>
              <article><span>Aprovação</span><strong>{totals.approval_rate}%</strong><small>{totals.approved_evidences} evidências aprovadas</small></article>
            </section>

            <section className={styles.dashboardGrid}>
              <article className={styles.chartCard}>
                <div className={styles.sectionHeader}>
                  <div><span>Evolução do período</span><h2>Engajamento e pontos</h2></div>
                  <small>Dados consolidados no backend</small>
                </div>
                <div className={styles.chart}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={timeseries} margin={{ top: 12, right: 12, left: -14, bottom: 0 }}>
                      <CartesianGrid stroke="#e8dfd0" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" tick={{ fill: "#667064", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={{ fill: "#667064", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: "#667064", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#ded8c9", background: "#fffaf2" }} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="plays" name="Jogadas" fill="#d88b43" radius={[5, 5, 0, 0]} />
                      <Line yAxisId="right" dataKey="points" name="Pontos" stroke="#132820" strokeWidth={3} dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className={styles.evidenceCard}>
                <div className={styles.sectionHeader}><div><span>Qualidade</span><h2>Evidências</h2></div></div>
                <div className={styles.evidenceTotal}><strong>{totals.total_evidences}</strong><span>enviadas</span></div>
                <div className={styles.evidenceRows}>
                  <div><span>Aprovadas</span><strong>{totals.approved_evidences}</strong></div>
                  <div><span>Pendentes</span><strong>{totals.pending_evidences}</strong></div>
                  <div><span>Rejeitadas</span><strong>{totals.rejected_evidences}</strong></div>
                  <div><span>Enviadas no prazo</span><strong>{totals.on_time_evidences}</strong></div>
                  <div className={styles.alertRow}><span>Não enviadas no prazo</span><strong>{totals.missing_evidences}</strong></div>
                  <div><span>Participações em desafios</span><strong>{totals.challenge_submissions}</strong></div>
                  <div><span>Desafios aprovados</span><strong>{totals.approved_challenge_submissions}</strong></div>
                  <div><span>Pontos de desafios</span><strong>{totals.challenge_points}</strong></div>
                </div>
              </article>
            </section>

            <section className={styles.tablesGrid}>
              <article className={styles.tableCard}>
                <div className={styles.sectionHeader}><div><span>Comparativo</span><h2>Desempenho por grupo</h2></div><small>{totals.groups} grupos</small></div>
                {summary.by_group.length === 0 ? <div className={styles.state}>Nenhum grupo no período.</div> : (
                  <div className={styles.tableWrapper}><table><thead><tr><th>Grupo</th><th>Ativos</th><th>Jogadas</th><th>Pontos</th><th>Aprovadas</th></tr></thead><tbody>{summary.by_group.map((group) => <tr key={group.group_id}><td><strong>{group.group_name}</strong></td><td>{group.active_players}/{group.total_players}</td><td>{group.total_plays}</td><td>{group.total_points}</td><td>{group.approved_evidences}</td></tr>)}</tbody></table></div>
                )}
              </article>

              <article className={styles.rankingCard}>
                <div className={styles.sectionHeader}><div><span>Destaques</span><h2>Ranking do período</h2></div><small>{summary.ranking.length} jogadores</small></div>
                {summary.ranking.length === 0 ? <div className={styles.state}>Ainda não há pontuação neste período.</div> : (
                  <div className={styles.rankingList}>{summary.ranking.slice(0, 10).map((player, index) => <div className={styles.rankingItem} key={player.player_id}><span>{index + 1}</span><div><strong>{player.full_name || player.username}</strong><small>@{player.username} • {player.total_plays} jogadas</small></div><b>{player.total_points} pts</b></div>)}</div>
                )}
              </article>
            </section>
          </>
        ) : (
          <div className={styles.state}>Nenhum dado disponível para o período.</div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
