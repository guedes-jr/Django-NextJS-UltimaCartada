"use client";

import { useEffect, useRef, useState } from "react";

import { getChallengeRanking, getFlashChallenges, submitFlashChallenge } from "@/services/challengeService";
import { ChallengeRankingEntry, FlashChallenge } from "@/types/challenges";

import { Modal } from "@/components/ui/Modal";

import styles from "./PlayerFlashChallenges.module.css";

export function PlayerFlashChallenges() {
  const [challenges, setChallenges] = useState<FlashChallenge[]>([]);
  const [rankings, setRankings] = useState<Record<number, ChallengeRankingEntry[]>>({});
  const [selected, setSelected] = useState<FlashChallenge | null>(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [submitError, setSubmitError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function reload() {
    const data = await getFlashChallenges();
    setChallenges(data);
    const entries = await Promise.all(data.map(async (challenge) => [challenge.id, await getChallengeRanking(challenge.id)] as const));
    setRankings(Object.fromEntries(entries));
  }

  useEffect(() => {
    getFlashChallenges()
      .then(async (data) => {
        setChallenges(data);
        const entries = await Promise.all(data.map(async (challenge) => [challenge.id, await getChallengeRanking(challenge.id)] as const));
        setRankings(Object.fromEntries(entries));
      })
      .catch(() => setError("Não foi possível carregar os desafios-relâmpago."))
      .finally(() => setLoading(false));
  }, []);

  async function submit() {
    if (!selected || submittingRef.current) return;
    const group = selected.groups[0];
    if (!group) return;
    submittingRef.current = true;
    try {
      setSubmitting(true);
      setSubmitError("");
      const submission = await submitFlashChallenge({ challenge: selected.id, group, text, file });
      setChallenges((current) => current.map((item) => item.id === selected.id ? { ...item, player_submission: submission } : item));
      setSelected(null);
      setText("");
      setFile(null);
      setMessage("Participação enviada. Você será avisado após a revisão.");
      try { await reload(); } catch { setError("Participação enviada, mas não foi possível atualizar os desafios. Recarregue para consultar o status."); }
    } catch {
      setSubmitError("Não foi possível enviar. Confira a evidência e tente novamente.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  if (loading) return null;
  if (challenges.length === 0) return error ? <p role="alert" className={styles.error}>{error}</p> : null;

  return (
    <section className={styles.section}>
      <header><div><span>Tempo limitado</span><h2>Desafios-relâmpago</h2></div><strong>{challenges.length} ativo{challenges.length > 1 ? "s" : ""}</strong></header>
      {message && <p role="status" className={styles.success}>{message}</p>}
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <div className={styles.grid}>
        {challenges.map((challenge) => (
          <article key={challenge.id}>
            <div className={styles.points}>+{challenge.points} pts</div>
            <h3>{challenge.title}</h3>
            <p>{challenge.instruction}</p>
            <small>Até {new Date(challenge.ends_at).toLocaleString("pt-BR")}</small>
            {(rankings[challenge.id]?.length ?? 0) > 0 && <div className={styles.ranking}><strong>Ranking relâmpago</strong>{rankings[challenge.id].slice(0, 3).map((entry) => <span key={`${entry.player_id}-${entry.group_id}`}>{entry.position}. {entry.player_name} <b>{entry.points} pts</b></span>)}</div>}
            {challenge.player_submission ? <span className={styles.submitted}>Enviado • {challenge.player_submission.status === "PENDING" ? "em revisão" : challenge.player_submission.status === "APPROVED" ? `aprovado (+${challenge.player_submission.points_awarded})` : "revisado"}</span> : <button type="button" onClick={() => { setSelected(challenge); setError(""); setSubmitError(""); setText(""); setFile(null); }}>Participar agora</button>}
          </article>
        ))}
      </div>
      <Modal title={selected?.title ?? "Participar do desafio"} isOpen={Boolean(selected)} closeDisabled={submitting} closeOnBackdrop onClose={() => { if (!submittingRef.current) setSelected(null); }}>
        {selected && <div className={styles.modal} aria-busy={submitting}>
          <p>Vale {selected.points} pontos</p><p>{selected.instruction}</p>
          {submitError && <p role="alert" className={styles.error}>{submitError}</p>}
          {selected.evidence_type !== "FILE" && <label>Conte como realizou<textarea disabled={submitting} value={text} onChange={(event) => setText(event.target.value)} /></label>}
          {selected.evidence_type !== "TEXT" && <label>Foto ou arquivo<input disabled={submitting} type="file" accept="image/*,video/*,.pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label>}
          <button className={styles.submitButton} type="button" disabled={submitting} onClick={() => void submit()}>{submitting ? "Enviando..." : "Enviar participação"}</button>
        </div>}
      </Modal>
    </section>
  );
}
