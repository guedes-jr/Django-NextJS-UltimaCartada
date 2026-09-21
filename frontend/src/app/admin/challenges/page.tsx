"use client";

import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { getAuthUser, isAdminRole } from "@/lib/auth";
import {
  cancelFlashChallenge,
  createFlashChallenge,
  getChallengeSubmissions,
  getFlashChallenges,
  publishFlashChallenge,
  reviewChallengeSubmission,
} from "@/services/challengeService";
import { getGroups } from "@/services/groupService";
import { CreateFlashChallengePayload, FlashChallenge, FlashChallengeSubmission } from "@/types/challenges";
import { PlayerGroup } from "@/types/groups";

import styles from "./AdminChallengesPage.module.css";

const initialForm: CreateFlashChallengePayload = {
  title: "", description: "", instruction: "", groups: [] as number[],
  starts_at: "", ends_at: "", points: 5, evidence_type: "ANY",
  status: "DRAFT",
};

const availabilityLabels: Record<string, string> = { DRAFT: "Rascunho", SCHEDULED: "Agendado", ACTIVE: "Ativo", CLOSED: "Encerrado", CANCELED: "Cancelado" };

export default function AdminChallengesPage() {
  const user = getAuthUser();
  const canManage = Boolean(user?.role && isAdminRole(user.role));
  const [challenges, setChallenges] = useState<FlashChallenge[]>([]);
  const [submissions, setSubmissions] = useState<FlashChallengeSubmission[]>([]);
  const [groups, setGroups] = useState<PlayerGroup[]>([]);
  const [form, setForm] = useState(initialForm);
  const [reviewing, setReviewing] = useState<FlashChallengeSubmission | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function reload() {
    const [challengeData, submissionData] = await Promise.all([getFlashChallenges(), getChallengeSubmissions()]);
    setChallenges(challengeData);
    setSubmissions(submissionData);
  }

  useEffect(() => {
    Promise.all([getFlashChallenges(), getChallengeSubmissions(), getGroups()])
      .then(([challengeData, submissionData, groupData]) => { setChallenges(challengeData); setSubmissions(submissionData); setGroups(groupData); })
      .catch(() => setError("Não foi possível carregar os desafios."))
      .finally(() => setLoading(false));
  }, []);

  async function createChallenge(event: React.FormEvent) {
    event.preventDefault();
    try {
      setSaving(true); setError(""); setMessage("");
      await createFlashChallenge({ ...form, starts_at: new Date(form.starts_at).toISOString(), ends_at: new Date(form.ends_at).toISOString() });
      setForm(initialForm); await reload(); setMessage("Desafio cadastrado com sucesso.");
    } catch { setError("Confira os grupos, horários e campos obrigatórios."); }
    finally { setSaving(false); }
  }

  async function action(id: number, type: "publish" | "cancel") {
    try {
      setSaving(true);
      if (type === "publish") await publishFlashChallenge(id);
      else await cancelFlashChallenge(id);
      await reload();
      setMessage(type === "publish" ? "Desafio publicado." : "Desafio cancelado.");
    }
    catch { setError("Não foi possível alterar o desafio."); }
    finally { setSaving(false); }
  }

  async function review(decision: "approve" | "reject") {
    if (!reviewing) return;
    try { setSaving(true); await reviewChallengeSubmission(reviewing.id, decision, notes); await reload(); setReviewing(null); setNotes(""); setMessage(decision === "approve" ? "Participação aprovada e pontuada." : "Participação rejeitada."); }
    catch { setError("Não foi possível revisar a participação."); }
    finally { setSaving(false); }
  }

  return <ProtectedRoute allowedRoles={["DEV", "GENERAL_ADMIN", "ADMIN", "GAME_MEDIATOR"]}><AdminLayout>
    <header className={styles.heading}><div><span>Engajamento em tempo real</span><h1>Desafios-relâmpago</h1><p>Agende ações rápidas, acompanhe participações e libere pontos após revisão.</p></div></header>
    {message && <div className={styles.success}>{message}</div>}{error && <div className={styles.error}>{error}</div>}
    {canManage && <form className={styles.form} onSubmit={createChallenge}><h2>Novo desafio</h2><div className={styles.formGrid}>
      <label>Título<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
      <label>Pontos<input required min={1} type="number" value={form.points} onChange={(e) => setForm({ ...form, points: Number(e.target.value) })} /></label>
      <label>Abertura<input required type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></label>
      <label>Encerramento<input required type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} /></label>
      <label>Tipo de evidência<select value={form.evidence_type} onChange={(e) => setForm({ ...form, evidence_type: e.target.value as "TEXT" | "FILE" | "ANY" })}><option value="ANY">Texto ou arquivo</option><option value="TEXT">Somente texto</option><option value="FILE">Somente arquivo</option></select></label>
      <label>Status inicial<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "DRAFT" | "PUBLISHED" })}><option value="DRAFT">Rascunho</option><option value="PUBLISHED">Publicado/agendado</option></select></label>
      <label className={styles.wide}>Descrição<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
      <label className={styles.wide}>Instrução<textarea required value={form.instruction} onChange={(e) => setForm({ ...form, instruction: e.target.value })} /></label>
      <fieldset className={styles.wide}><legend>Grupos participantes</legend><div className={styles.groupOptions}>{groups.map((group) => <label key={group.id}><input type="checkbox" checked={form.groups.includes(group.id)} onChange={(e) => setForm({ ...form, groups: e.target.checked ? [...form.groups, group.id] : form.groups.filter((id) => id !== group.id) })} />{group.name}</label>)}</div></fieldset>
    </div><button disabled={saving || form.groups.length === 0}>{saving ? "Salvando..." : "Cadastrar desafio"}</button></form>}
    <section className={styles.card}><header><h2>Agenda de desafios</h2><span>{challenges.length} cadastrados</span></header>{loading ? <p>Carregando...</p> : challenges.length === 0 ? <p>Nenhum desafio cadastrado.</p> : <div className={styles.challengeGrid}>{challenges.map((challenge) => <article key={challenge.id}><div><span className={`${styles.badge} ${styles[challenge.availability_status.toLowerCase()]}`}>{availabilityLabels[challenge.availability_status]}</span><strong>+{challenge.points} pts</strong></div><h3>{challenge.title}</h3><p>{challenge.group_names.join(", ")}</p><small>{new Date(challenge.starts_at).toLocaleString("pt-BR")} → {new Date(challenge.ends_at).toLocaleString("pt-BR")}</small><footer><span>{challenge.submissions_count} participações</span>{canManage && challenge.status === "DRAFT" && <button onClick={() => void action(challenge.id, "publish")}>Publicar</button>}{canManage && challenge.status !== "CANCELED" && <button className={styles.danger} onClick={() => void action(challenge.id, "cancel")}>Cancelar</button>}</footer></article>)}</div>}</section>
    <section className={styles.card}><header><h2>Participações para revisão</h2><span>{submissions.filter((item) => item.status === "PENDING").length} pendentes</span></header>{submissions.length === 0 ? <p>Nenhuma participação recebida.</p> : <div className={styles.tableWrapper}><table><thead><tr><th>Jogador</th><th>Desafio</th><th>Grupo</th><th>Status</th><th>Pontos</th><th></th></tr></thead><tbody>{submissions.map((submission) => <tr key={submission.id}><td>{submission.player_name}</td><td>{submission.challenge_title}</td><td>{submission.group_name}</td><td>{submission.status}</td><td>{submission.points_awarded}</td><td><button disabled={submission.status !== "PENDING"} onClick={() => { setReviewing(submission); setNotes(""); }}>Revisar</button></td></tr>)}</tbody></table></div>}</section>
    {reviewing && <div className={styles.backdrop} onMouseDown={() => setReviewing(null)}><section className={styles.modal} onMouseDown={(e) => e.stopPropagation()}><header><div><span>{reviewing.player_name}</span><h2>{reviewing.challenge_title}</h2></div><button onClick={() => setReviewing(null)}>Fechar</button></header>{reviewing.text && <blockquote>{reviewing.text}</blockquote>}{reviewing.file && <a href={reviewing.file} target="_blank" rel="noreferrer">Abrir arquivo enviado</a>}<label>Observação<textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></label><footer><button className={styles.danger} disabled={saving} onClick={() => void review("reject")}>Rejeitar</button><button disabled={saving} onClick={() => void review("approve")}>Aprovar e pontuar</button></footer></section></div>}
  </AdminLayout></ProtectedRoute>;
}
