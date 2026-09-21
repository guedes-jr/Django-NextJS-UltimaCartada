"use client";

import { useEffect, useMemo, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { downloadAuditEvents, getAuditEvents } from "@/services/auditService";
import { getPlayers } from "@/services/playerService";
import { AuditEvent, AuditFilters } from "@/types/audit";
import { PlayerProfile } from "@/types/players";

import styles from "./AuditPage.module.css";

const actionLabels: Record<string, string> = {
  CREATE_OR_ACTION: "Criação/ação",
  UPDATE: "Alteração",
  DELETE: "Exclusão",
};

export default function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [actors, setActors] = useState<PlayerProfile[]>([]);
  const [filters, setFilters] = useState<AuditFilters>({});
  const [selected, setSelected] = useState<AuditEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  async function load(nextFilters = filters) {
    try {
      setLoading(true);
      setError("");
      setEvents(await getAuditEvents(nextFilters));
    } catch {
      setError("Não foi possível carregar os eventos de auditoria.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    Promise.all([getAuditEvents({}), getPlayers()])
      .then(([initialEvents, initialActors]) => {
        setEvents(initialEvents);
        setActors(initialActors);
      })
      .catch(() => setError("Não foi possível carregar os eventos de auditoria."))
      .finally(() => setLoading(false));
  }, []);

  const resources = useMemo(
    () => Array.from(new Set(events.map((event) => event.resource))).sort(),
    [events]
  );

  async function exportCsv() {
    try {
      setExporting(true);
      await downloadAuditEvents(filters);
    } catch {
      setError("Não foi possível exportar os eventos.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["DEV", "GENERAL_ADMIN", "ADMIN"]}>
      <AdminLayout>
        <header className={styles.heading}>
          <div><span>Rastreabilidade</span><h1>Auditoria da plataforma</h1><p>Consulte alterações críticas sem permitir edição ou exclusão do histórico.</p></div>
          <button type="button" onClick={() => void exportCsv()} disabled={exporting}>{exporting ? "Exportando..." : "Exportar CSV"}</button>
        </header>

        <section className={styles.filters}>
          <label>Ator<select value={filters.actor ?? ""} onChange={(event) => setFilters((current) => ({ ...current, actor: Number(event.target.value) || undefined }))}><option value="">Todos</option>{actors.map((actor) => <option key={actor.id} value={actor.user.id}>{actor.user.full_name || actor.user.username}</option>)}</select></label>
          <label>Ação<select value={filters.action ?? ""} onChange={(event) => setFilters((current) => ({ ...current, action: event.target.value || undefined }))}><option value="">Todas</option>{Object.entries(actionLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label>Recurso<select value={filters.resource ?? ""} onChange={(event) => setFilters((current) => ({ ...current, resource: event.target.value || undefined }))}><option value="">Todos</option>{resources.map((resource) => <option key={resource}>{resource}</option>)}</select></label>
          <label>De<input type="date" value={filters.start_date ?? ""} onChange={(event) => setFilters((current) => ({ ...current, start_date: event.target.value || undefined }))} /></label>
          <label>Até<input type="date" value={filters.end_date ?? ""} onChange={(event) => setFilters((current) => ({ ...current, end_date: event.target.value || undefined }))} /></label>
          <button type="button" onClick={() => void load()}>Filtrar</button>
        </section>

        {error && <div className={styles.error}>{error}</div>}
        {loading ? <div className={styles.state}>Carregando histórico...</div> : events.length === 0 ? <div className={styles.state}>Nenhum evento encontrado.</div> : (
          <section className={styles.tableCard}><div className={styles.tableWrapper}><table><thead><tr><th>Data</th><th>Ator</th><th>Ação</th><th>Recurso</th><th>Objeto</th><th>Status</th><th></th></tr></thead><tbody>{events.map((event) => <tr key={event.id}><td>{new Date(event.created_at).toLocaleString("pt-BR")}</td><td>{event.actor_name}</td><td><span className={styles.action}>{actionLabels[event.action] || event.action}</span></td><td>{event.resource}</td><td>{event.object_id || "—"}</td><td>{event.status_code}</td><td><button className={styles.detailButton} type="button" onClick={() => setSelected(event)}>Detalhes</button></td></tr>)}</tbody></table></div></section>
        )}

        {selected && <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setSelected(null)}><section className={styles.modal} role="dialog" aria-modal="true" aria-label="Detalhes do evento" onMouseDown={(event) => event.stopPropagation()}><header><div><span>Evento #{selected.id}</span><h2>{selected.resource}</h2></div><button type="button" onClick={() => setSelected(null)}>Fechar</button></header><dl><div><dt>Ator</dt><dd>{selected.actor_name}</dd></div><div><dt>Requisição</dt><dd>{selected.method} {selected.path}</dd></div><div><dt>IP</dt><dd>{selected.ip_address || "Não informado"}</dd></div><div><dt>Request ID</dt><dd>{selected.request_id || "—"}</dd></div></dl><h3>Dados registrados</h3><pre>{JSON.stringify(selected.changes, null, 2)}</pre></section></div>}
      </AdminLayout>
    </ProtectedRoute>
  );
}
