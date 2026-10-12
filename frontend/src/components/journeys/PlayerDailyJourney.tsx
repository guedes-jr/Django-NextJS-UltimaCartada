"use client";

import Image from "next/image";
import { AxiosError } from "axios";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { downloadDailyEvidence, getDailyJourneys, recordDailyIntention, submitDailyEvidence } from "@/services/journeyService";
import { DailyJourneyProgress } from "@/types/journeys";
import styles from "./PlayerDailyJourney.module.css";

function errorText(error: unknown) {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as Record<string, string | string[]>;
    const first = Object.values(data)[0];
    if (typeof first === "string") return first;
    if (Array.isArray(first)) return first[0];
  }
  return "Não foi possível concluir a operação. Tente novamente.";
}

export function PlayerDailyJourney() {
  const [journeys, setJourneys] = useState<DailyJourneyProgress[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [intention, setIntention] = useState("");
  const [evidence, setEvidence] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [pillarStage, setPillarStage] = useState("ALL");
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const previewRef = useRef("");
  const selectedEnrollment = useRef<number | null>(null);
  const loadedDay = useRef("");
  const fileInput = useRef<HTMLInputElement>(null);
  const current = journeys.find((item) => item.enrollment === selectedId) ?? journeys[0];
  const day = current?.current_day;
  const participation = current?.participation;
  const lastFinished = current?.stages.filter((stage) => stage.status === "FINISHED").at(-1);
  const pillarProgress = pillarStage === "ALL" ? current?.pillars : current?.stages.find((stage) => String(stage.order) === pillarStage)?.pillars;

  const load = useCallback(async () => {
    setError("");
    try {
      const data = await getDailyJourneys();
      const item = data.find((entry) => entry.enrollment === selectedEnrollment.current) ?? data[0];
      const key = `${item?.enrollment ?? ""}:${item?.current_day?.id ?? ""}`;
      if (loadedDay.current !== key) {
        loadedDay.current = key;
        setIntention(""); setEvidence(""); setFile(null); replacePreview(""); setFeedback("");
        if (fileInput.current) fileInput.current.value = "";
      }
      setJourneys(data);
    } catch (error) {
      setError(errorText(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
    // Refresh on return to the tab and across midnight/release-time boundaries.
    const onFocus = () => { if (!submitting.current) void load(); };
    window.addEventListener("focus", onFocus);
    const timer = window.setInterval(onFocus, 60000);
    return () => { window.removeEventListener("focus", onFocus); window.clearInterval(timer); };
  }, [load]);

  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
  }, []);

  function replacePreview(url: string) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = url;
    setPreview(url);
  }

  async function submit(event: FormEvent, kind: "intention" | "evidence") {
    event.preventDefault();
    if (!current || !day || submitting.current) return;
    submitting.current = true;
    setBusy(true); setError(""); setFeedback("");
    try {
      if (kind === "intention") {
        await recordDailyIntention(current.enrollment, day.id, intention);
        setFeedback(day.incentive_message || "Intenção registrada.");
        setIntention("");
      } else {
        await submitDailyEvidence(current.enrollment, day.id, evidence, file);
        setFeedback(day.conclusion_message || "Evidência registrada.");
        setEvidence(""); setFile(null); replacePreview("");
        if (fileInput.current) fileInput.current.value = "";
      }
      await load();
    } catch (error) { setError(errorText(error)); }
    finally { submitting.current = false; setBusy(false); }
  }

  function changeJourney(value: string) {
    selectedEnrollment.current = Number(value);
    const next = journeys.find((item) => item.enrollment === Number(value));
    loadedDay.current = `${next?.enrollment ?? ""}:${next?.current_day?.id ?? ""}`;
    setSelectedId(Number(value)); setIntention(""); setEvidence("");
    setFile(null); replacePreview(""); setFeedback(""); setError("");
    if (fileInput.current) fileInput.current.value = "";
  }

  if (loading) return <section className={styles.panel} aria-busy="true">Carregando sua jornada diária...</section>;
  if (!current) return error ? <section className={styles.panel}><p role="alert">{error}</p><button type="button" onClick={() => void load()}>Tentar novamente</button></section> : null;

  return (
    <section className={styles.panel} aria-label="Jornada diária">
      <div className={styles.heading}>
        <div><span>Minha jornada</span><h2>{current.journey_name}</h2><p>{current.group_name}</p></div>
        <div><strong>{current.played_days}/{current.total_days}</strong><span> dias com participação</span><p>{current.points} pontos de Jornada</p></div>
      </div>
      {journeys.length > 1 && <label className={styles.field}>Jornada e grupo<select disabled={busy} value={current.enrollment} onChange={(event) => changeJourney(event.target.value)}>{journeys.map((item) => <option key={item.enrollment} value={item.enrollment}>{item.journey_name} — {item.group_name}</option>)}</select></label>}
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {feedback && <p role="status" className={styles.feedback}>{feedback}</p>}
      <div className={styles.stages}>
        {current.stages.map((stage) => <article key={stage.order}><strong>{stage.name}</strong><span>{stage.status === "FINISHED" ? "Etapa encerrada" : stage.status === "ACTIVE" ? "Etapa atual" : stage.status === "CANCELED" ? "Cancelada" : "Aguardando início"}</span><small>{stage.played_days}/21 dias com participação • {stage.points} pontos</small></article>)}
      </div>
      {lastFinished && current.status !== "COMPLETED" && <aside className={styles.feedback} role="status"><h3>{lastFinished.name} encerrado</h3><p>Esta etapa chegou ao fim. Seu histórico e seus pontos continuam com você na próxima etapa.</p></aside>}
      {current.status === "COMPLETED" ? <div className={styles.feedback}><h3>Jornada encerrada</h3><p>Os três jogos chegaram ao fim. Seu histórico e seus pontos permanecem disponíveis.</p></div> : !day ? <p className={styles.empty}>{current.current_stage ? "A cartada de hoje ainda não está disponível. Ela aparecerá após publicação e horário de liberação." : current.next_stage_start ? `Próxima etapa em ${new Date(`${current.next_stage_start}T00:00:00`).toLocaleDateString("pt-BR")}. Seu progresso permanece salvo.` : "Esta jornada não possui uma etapa ativa hoje."}</p> : (
        <article className={styles.daily} key={`${current.enrollment}-${day.id}`}>
          <span>Jogo {current.current_stage} • Dia {day.day_number}/21 • {day.pillar_label}</span>
          <h3>{day.title}</h3>
          {day.image && <Image className={styles.image} src={day.image} alt={day.title} width={600} height={280} unoptimized />}
          {day.objective && <p><strong>Objetivo:</strong> {day.objective}</p>}
          {day.content && <p className={styles.text}>{day.content}</p>}
          <p className={styles.text}>{day.instruction}</p>
          {day.alternative_instruction && <p><strong>Alternativa:</strong> {day.alternative_instruction}</p>}
          {day.precautions && <p><strong>Cuidados:</strong> {day.precautions}</p>}
          <div className={styles.forms}>
            <form onSubmit={(event) => void submit(event, "intention")}>
              <h4>1. Registrar intenção</h4>
              {participation?.intention_at ? <p role="status">Intenção registrada • {participation.intention_points} pontos</p> : <><label className={styles.field}>Minha intenção (opcional)<textarea maxLength={10000} value={intention} disabled={busy} onChange={(event) => setIntention(event.target.value)} /></label><button disabled={busy} type="submit">{busy ? "Registrando..." : `Registrar intenção • ${day.intention_points} pontos`}</button></>}
            </form>
            {day.evidence_type !== "NONE" && <form onSubmit={(event) => void submit(event, "evidence")}>
              <h4>2. Enviar evidência</h4>
              {day.expected_evidence && <p>{day.expected_evidence}</p>}
              {participation?.evidence_at ? <div role="status"><p>{day.conclusion_message || "Evidência registrada."}</p><p>{participation.evidence_points} pontos</p></div> : !current.can_send_evidence ? <p>O prazo da evidência de hoje terminou. A intenção registrada permanece no seu histórico.</p> : <>
                {current.evidence_due_at && <small>Prazo: {new Date(current.evidence_due_at).toLocaleString("pt-BR")}</small>}
                <label className={styles.field}>Descrição<textarea maxLength={10000} required={day.evidence_type === "TEXT"} value={evidence} disabled={busy} onChange={(event) => setEvidence(event.target.value)} /></label>
                {day.evidence_type !== "TEXT" && <label className={styles.field}>Arquivo (até 10 MB)<input ref={fileInput} type="file" disabled={busy} required accept={day.evidence_type === "IMAGE" ? "image/*" : day.evidence_type === "VIDEO" ? "video/mp4,video/webm" : "image/*,video/mp4,video/webm"} onChange={(event) => {
                  const next = event.target.files?.[0] ?? null;
                  replacePreview("");
                  if (next && next.size > 10 * 1024 * 1024) { setError("O arquivo deve ter no máximo 10 MB."); setFile(null); event.target.value = ""; return; }
                  setError(""); setFile(next);
                  replacePreview(next?.type.startsWith("image/") ? URL.createObjectURL(next) : "");
                }} /></label>}
                {preview && <Image className={styles.image} src={preview} alt="Prévia da evidência selecionada" width={400} height={280} unoptimized />}
                <button type="submit" disabled={busy}>{busy ? "Enviando..." : `Enviar evidência • ${day.evidence_points} pontos`}</button>
              </>}
            </form>}
          </div>
          {participation?.completed_at && <p className={styles.feedback}>Dia jogado. {participation.evidence_at || day.evidence_type === "NONE" ? day.conclusion_message : day.incentive_message}</p>}
        </article>
      )}
      <h3>Progresso por pilar</h3>
      <label className={styles.field}>Período do progresso<select value={pillarStage} onChange={(event) => setPillarStage(event.target.value)}><option value="ALL">Jornada completa (três jogos)</option>{current.stages.map((stage) => <option key={stage.order} value={stage.order}>{stage.name}</option>)}</select></label>
      <p>Um dia conta com intenção e/ou evidência. Dias sem participação não retiram pontos.</p>
      <div className={styles.pillars}>{(pillarProgress ?? []).map((pillar) => <article key={pillar.pillar}><strong>{pillar.label}</strong><progress value={pillar.played_days} max={Math.max(pillar.total_days, 1)} aria-label={`Progresso em ${pillar.label}`} /><span>{pillar.played_days}/{pillar.total_days} cartadas publicadas</span><small>{pillar.evidence_days} com evidência • {pillar.points} pontos</small></article>)}</div>
      <details className={styles.history}><summary>Meu histórico ({current.history.length})</summary>{current.history.length === 0 ? <p>Nenhuma participação registrada ainda.</p> : current.history.map((item) => <article key={item.id}><strong>Jogo {item.stage_order} • Dia {item.day_number} — {item.day_title}</strong><p>{item.total_points} pontos • {item.intention_at ? "Intenção registrada" : "Sem intenção"} • {item.evidence_at ? "Evidência enviada" : "Sem evidência"}</p>{item.intention && <p className={styles.text}>{item.intention}</p>}{item.evidence_text && <p className={styles.text}>{item.evidence_text}</p>}{item.has_file && <button type="button" onClick={() => void downloadDailyEvidence(item.id).catch((error) => setError(errorText(error)))}>Baixar minha evidência</button>}</article>)}</details>
    </section>
  );
}
