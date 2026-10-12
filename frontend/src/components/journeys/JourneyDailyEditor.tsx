"use client";

import { AxiosError } from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { enableDailyJourney, getJourneyDays, saveJourneyDay } from "@/services/journeyService";
import { Journey, JourneyDay, JourneyDayPayload, JourneyPillar } from "@/types/journeys";
import styles from "./JourneyDailyEditor.module.css";

const pillars: Record<JourneyPillar, string> = { BODY: "Atividade física", NUTRITION: "Nutrição", MINDSET: "Mentalidade", COMMUNITY: "Comunidade" };
const textFields = [
  ["objective", "Objetivo"], ["content", "Conteúdo educativo"], ["instruction", "Ação proposta"],
  ["expected_evidence", "Evidência esperada"], ["conclusion_message", "Mensagem de conclusão"],
  ["incentive_message", "Mensagem após a intenção"], ["alternative_instruction", "Alternativa equivalente"], ["precautions", "Cuidados"],
] as const;

function emptyDay(stage: number): JourneyDayPayload {
  return { stage, day_number: 1, pillar: "BODY", title: "", objective: "", content: "", instruction: "",
    expected_evidence: "", conclusion_message: "", incentive_message: "", alternative_instruction: "",
    precautions: "", evidence_type: "TEXT", intention_points: 10, evidence_points: 30,
    release_time: "00:00", is_published: false };
}

export function JourneyDailyEditor({ journey, onClose }: { journey: Journey; onClose: () => void }) {
  const [dailyEnabled, setDailyEnabled] = useState(journey.daily_enabled);
  const [days, setDays] = useState<JourneyDay[]>([]);
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState<number | undefined>();
  const [form, setForm] = useState<JourneyDayPayload>(() => emptyDay(journey.stages[0]?.id ?? 0));
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const submitting = useRef(false);

  useEffect(() => {
    let active = true;
    getJourneyDays(journey.id).then((data) => { if (active) setDays(data); })
      .catch(() => { if (active) setError("Não foi possível carregar as cartadas."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [journey.id]);

  function edit(day?: JourneyDay) {
    setId(day?.id); setImage(null); setError(""); setFeedback("");
    if (day) {
      const { id: _id, stage_order: _order, pillar_label: _label, image: _image, ...payload } = day;
      void _id; void _order; void _label; void _image;
      setForm(payload);
    } else setForm(emptyDay(journey.stages[0]?.id ?? 0));
    setEditing(true);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true; setBusy(true); setError("");
    try {
      await saveJourneyDay(form, id, image);
      setDays(await getJourneyDays(journey.id));
      setEditing(false); setFeedback("Cartada salva.");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as Record<string, string | string[]>;
        setError(Object.entries(data).map(([key, value]) => `${key === "detail" ? "" : `${key}: `}${Array.isArray(value) ? value.join(" ") : value}`).join(" "));
      } else setError("Não foi possível salvar a cartada.");
    } finally { submitting.current = false; setBusy(false); }
  }

  return <Modal title={`${editing ? "Editar cartada diária" : "Conteúdo diário"} — ${journey.name}`} isOpen onClose={() => !busy && onClose()}>
    <div className={styles.editor}>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {feedback && <p role="status">{feedback}</p>}
      {!editing ? <>
        <p>Cadastre as 21 cartadas de cada etapa. Publique somente conteúdo revisado. Cartadas com registros ficam preservadas para o histórico.</p>
        {!dailyEnabled && <div><p>Esta jornada usa rodadas. Ao habilitar o fluxo diário, novas participações passam a usar a cartada do calendário; jogadas anteriores são preservadas.</p><button type="button" disabled={busy || !days.some((day) => day.is_published)} onClick={async () => {
          setBusy(true); setError("");
          try { await enableDailyJourney(journey.id); setDailyEnabled(true); setFeedback("Fluxo diário habilitado."); }
          catch { setError("Não foi possível habilitar o fluxo diário."); }
          finally { setBusy(false); }
        }}>Habilitar fluxo diário</button></div>}
        <button type="button" disabled={busy} onClick={() => edit()}>Nova cartada diária</button>
        {loading ? <p>Carregando...</p> : journey.stages.map((stage) => {
          const entries = days.filter((day) => day.stage === stage.id);
          return <section key={stage.id}><h3>{stage.name} — {entries.length}/21 cadastradas • {entries.filter((day) => day.is_published).length} publicadas</h3>
            {!entries.length && <p>Nenhuma cartada cadastrada nesta etapa.</p>}
            <div className={styles.list}>{entries.map((day) => <article key={day.id}><div><strong>Dia {day.day_number}: {day.title}</strong><small>{pillars[day.pillar]} • {day.is_published ? "Publicada" : "Rascunho"} • {day.release_time.slice(0, 5)}</small></div><button type="button" disabled={busy} onClick={() => edit(day)}>Editar</button></article>)}</div>
          </section>;
        })}
      </> : <form onSubmit={(event) => void save(event)}>
        <div className={styles.row}>
          <label>Etapa<select value={form.stage} disabled={busy} onChange={(event) => setForm({ ...form, stage: Number(event.target.value) })}>{journey.stages.map((stage) => <option key={stage.id} value={stage.id}>{stage.name}</option>)}</select></label>
          <label>Dia (1–21)<input type="number" min={1} max={21} required disabled={busy} value={form.day_number} onChange={(event) => setForm({ ...form, day_number: Number(event.target.value) })} /></label>
          <label>Pilar<select value={form.pillar} disabled={busy} onChange={(event) => setForm({ ...form, pillar: event.target.value as JourneyPillar })}>{Object.entries(pillars).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>
        </div>
        <label>Título<input required maxLength={160} disabled={busy} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
        {textFields.map(([field, label]) => <label key={field}>{label}<textarea disabled={busy} required={field === "instruction"} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} /></label>)}
        <label>Imagem (opcional)<input type="file" accept="image/*" disabled={busy} onChange={(event) => setImage(event.target.files?.[0] ?? null)} /></label>
        <div className={styles.row}>
          <label>Tipo de evidência<select value={form.evidence_type} disabled={busy} onChange={(event) => setForm({ ...form, evidence_type: event.target.value as JourneyDayPayload["evidence_type"] })}><option value="NONE">Nenhuma</option><option value="TEXT">Texto</option><option value="IMAGE">Imagem</option><option value="VIDEO">Vídeo MP4/WebM</option><option value="IMAGE_OR_VIDEO">Imagem ou vídeo</option></select></label>
          <label>Horário de liberação<input type="time" required disabled={busy} value={form.release_time.slice(0, 5)} onChange={(event) => setForm({ ...form, release_time: event.target.value })} /></label>
        </div>
        <div className={styles.row}>
          <label>Pontos por intenção<input type="number" required min={0} max={32767} disabled={busy} value={form.intention_points} onChange={(event) => setForm({ ...form, intention_points: Number(event.target.value) })} /></label>
          <label>Pontos por evidência<input type="number" required min={0} max={32767} disabled={busy} value={form.evidence_points} onChange={(event) => setForm({ ...form, evidence_points: Number(event.target.value) })} /></label>
        </div>
        <label className={styles.check}><input type="checkbox" disabled={busy} checked={form.is_published} onChange={(event) => setForm({ ...form, is_published: event.target.checked })} />Conteúdo revisado: publicar esta cartada</label>
        <div className={styles.actions}><button type="button" disabled={busy} onClick={() => { setEditing(false); setError(""); }}>Voltar</button><button type="submit" disabled={busy}>{busy ? "Salvando..." : "Salvar cartada"}</button></div>
      </form>}
    </div>
  </Modal>;
}
