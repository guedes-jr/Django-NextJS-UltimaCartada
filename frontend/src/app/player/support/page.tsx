"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Modal } from "@/components/ui/Modal";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { createSupportTicket, downloadSupportAttachment, getSupportTickets, replySupportTicket } from "@/services/supportService";
import { SupportCategory, SupportPriority, SupportMessage, SupportTicket } from "@/types/support";
import { getSupportAttachmentError, SUPPORT_ATTACHMENT_ACCEPT, SUPPORT_ATTACHMENT_HINT } from "@/lib/supportAttachments";

import styles from "./PlayerSupportPage.module.css";

const statusLabels: Record<string, string> = { OPEN: "Aberto", IN_PROGRESS: "Em atendimento", WAITING_USER: "Aguardando você", RESOLVED: "Resolvido", CLOSED: "Encerrado" };
const categoryLabels: Record<string, string> = { ACCESS: "Acesso e conta", GAME: "Jogo", MENTORSHIP: "Mentoria", PAYMENT: "Pagamento", TECHNICAL: "Problema técnico", OTHER: "Outro" };

export default function PlayerSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const createFileRef = useRef<HTMLInputElement>(null);
  const replyFileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ category: "TECHNICAL" as SupportCategory, subject: "", priority: "NORMAL" as SupportPriority, message: "", attachment: null as File | null });
  const [reply, setReply] = useState("");
  const [replyFileKey, setReplyFileKey] = useState(0);
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const loadingRef = useRef(true);
  const historyHeadingRef = useRef<HTMLHeadingElement>(null);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [createError, setCreateError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function reload(preferredId?: number) {
    const data = await getSupportTickets();
    setTickets(data);
    const targetId = preferredId ?? selected?.id;
    if (targetId) setSelected(data.find((ticket) => ticket.id === targetId) ?? null);
  }

  useEffect(() => {
    let canceled = false;
    getSupportTickets().then((data) => {
      if (canceled) return;
      setTickets(data);
      setLoadError("");
      const requested = Number(new URLSearchParams(window.location.search).get("ticket"));
      setSelected((current) => data.find((ticket) => ticket.id === (current?.id ?? requested)) ?? null);
      if (loadAttempt > 0) requestAnimationFrame(() => { if (!canceled) historyHeadingRef.current?.focus(); });
    }).catch(() => { if (!canceled) setLoadError("Não foi possível carregar seus chamados."); })
      .finally(() => { if (!canceled) { loadingRef.current = false; setLoading(false); } });
    return () => { canceled = true; };
  }, [loadAttempt]);

  async function create(event: FormEvent) {
    event.preventDefault();
    if (savingRef.current) return;
    const attachmentError = getSupportAttachmentError(form.attachment);
    if (attachmentError) { setCreateError(attachmentError); createFileRef.current?.focus(); return; }
    savingRef.current = true;
    try { setSaving(true); setError(""); setCreateError(""); const ticket = await createSupportTicket(form); setTickets((current) => [ticket, ...current]); setSelected(ticket); setReply(""); setReplyFile(null); setReplyFileKey((value) => value + 1); setShowCreate(false); setForm({ category: "TECHNICAL", subject: "", priority: "NORMAL", message: "", attachment: null }); setMessage("Chamado aberto. Nossa equipe foi notificada."); }
    catch { setCreateError("Não foi possível abrir o chamado. Confira os campos e o anexo."); }
    finally { savingRef.current = false; setSaving(false); }
  }

  async function sendReply(event: FormEvent) {
    event.preventDefault(); if (!selected || savingRef.current) return;
    const attachmentError = getSupportAttachmentError(replyFile);
    if (attachmentError) { setError(attachmentError); replyFileRef.current?.focus(); return; }
    savingRef.current = true;
    try { setSaving(true); setError(""); await replySupportTicket(selected.id, reply, replyFile); setReply(""); setReplyFile(null); setReplyFileKey((value) => value + 1); setMessage("Resposta enviada."); try { await reload(selected.id); } catch { setError("Sua resposta foi enviada, mas não foi possível atualizar a conversa. Recarregue a página para consultar o histórico."); } }
    catch { setError("Não foi possível enviar a resposta."); }
    finally { savingRef.current = false; setSaving(false); }
  }

  async function downloadAttachment(ticketId: number, attachment: SupportMessage) {
    try { await downloadSupportAttachment(ticketId, attachment); }
    catch { setError("Não foi possível baixar o anexo. Tente novamente."); }
  }

  return <ProtectedRoute allowedRoles={["PLAYER"]}><PlayerLayout>
    <header className={styles.heading}><div><span>Central de ajuda</span><h1>Meus chamados</h1><p>Acompanhe todas as conversas com nossa equipe em um só lugar.</p></div><button disabled={saving} onClick={() => { setCreateError(""); setShowCreate(true); }}>Abrir novo chamado</button></header>
    {message && <div role="status" className={styles.success}>{message}</div>}{error && <div id="support-operation-error" role="alert" className={styles.error}>{error}</div>}
    {loadError && <div className={styles.error}><p role="alert">{loadError}</p><button className={styles.retryButton} type="button" aria-disabled={loading} onClick={() => { if (loadingRef.current) return; loadingRef.current = true; setLoading(true); setLoadAttempt((value) => value + 1); }}>{loading ? "Carregando chamados..." : "Tentar novamente"}</button></div>}
    <div className={styles.workspace}><aside><h2 ref={historyHeadingRef} tabIndex={-1}>Histórico</h2>{loading ? <p role="status">Carregando...</p> : loadError ? <p>Histórico indisponível. Tente novamente.</p> : tickets.length === 0 ? <p>Você ainda não abriu chamados.</p> : tickets.map((ticket) => <button className={selected?.id === ticket.id ? styles.selected : ""} key={ticket.id} disabled={saving} aria-pressed={selected?.id === ticket.id} onClick={() => { setSelected(ticket); setReply(""); setReplyFile(null); setReplyFileKey((value) => value + 1); }}><span>#{ticket.protocol.slice(0, 8)}</span><strong>{ticket.subject}</strong><small>{statusLabels[ticket.status]} • {new Date(ticket.updated_at).toLocaleDateString("pt-BR")}</small></button>)}</aside>
      <section className={styles.conversation} aria-label="Conversa do chamado">{selected ? <><header className={styles.ticketHeader}><div><span>#{selected.protocol.slice(0, 8)} • {categoryLabels[selected.category]}</span><h2>{selected.subject}</h2></div><b className={styles[selected.status.toLowerCase()]}>{statusLabels[selected.status]}</b></header><section className={styles.messages}>{selected.messages.map((item) => <article className={item.author_is_staff ? styles.staffMessage : styles.userMessage} key={item.id}><header><strong>{item.author_name}</strong><time>{new Date(item.created_at).toLocaleString("pt-BR")}</time></header><p>{item.message}</p>{item.attachment_available && <button onClick={() => void downloadAttachment(selected.id, item)}>Baixar anexo</button>}</article>)}</section>{selected.status === "CLOSED" ? <div className={styles.closed}>Este chamado foi encerrado. Se ainda precisar de ajuda, abra um novo chamado.</div> : <form className={styles.reply} onSubmit={sendReply}><label>Responder<textarea disabled={saving} required minLength={3} maxLength={5000} value={reply} onChange={(e) => setReply(e.target.value)} /></label><div><div className={styles.attachment}><input ref={replyFileRef} key={replyFileKey} disabled={saving} aria-label="Anexo da resposta" aria-describedby={`support-reply-attachment-hint${error ? " support-operation-error" : ""}`} aria-invalid={Boolean(getSupportAttachmentError(replyFile))} type="file" accept={SUPPORT_ATTACHMENT_ACCEPT} onChange={(e) => { const next = e.target.files?.[0] ?? null; setReplyFile(next); setError(getSupportAttachmentError(next) ?? ""); }} /><small id="support-reply-attachment-hint">{SUPPORT_ATTACHMENT_HINT}</small>{replyFile && <button className={styles.removeAttachment} type="button" disabled={saving} onClick={() => { setReplyFile(null); setReplyFileKey((value) => value + 1); setError(""); requestAnimationFrame(() => replyFileRef.current?.focus()); }}>Remover anexo da resposta</button>}</div><button disabled={saving}>{saving ? "Enviando..." : "Enviar resposta"}</button></div></form>}</> : <div className={styles.empty}>Selecione um chamado para acompanhar a conversa.</div>}</section>
    </div>
    <Modal title="Como podemos ajudar?" isOpen={showCreate} onClose={() => { if (!savingRef.current) setShowCreate(false); }} closeDisabled={saving} closeOnBackdrop>
      <form className={styles.modal} onSubmit={create} aria-busy={saving}>
        {createError && <div id="support-create-error" role="alert" className={styles.error}>{createError}</div>}
        <fieldset disabled={saving} className={styles.fields}>
        <label>Categoria<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as SupportCategory })}>{Object.entries(categoryLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>Assunto<input required minLength={5} maxLength={180} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></label><label>Prioridade<select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as SupportPriority })}><option value="LOW">Baixa</option><option value="NORMAL">Normal</option><option value="HIGH">Alta</option><option value="URGENT">Urgente</option></select></label><label>Descreva sua dúvida<textarea required minLength={3} maxLength={5000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label><label>Anexo opcional<input ref={createFileRef} type="file" aria-describedby={`support-create-attachment-hint${createError ? " support-create-error" : ""}`} aria-invalid={Boolean(getSupportAttachmentError(form.attachment))} accept={SUPPORT_ATTACHMENT_ACCEPT} onChange={(e) => { const next = e.target.files?.[0] ?? null; setForm({ ...form, attachment: next }); setCreateError(getSupportAttachmentError(next) ?? ""); }} /><small id="support-create-attachment-hint">{SUPPORT_ATTACHMENT_HINT}</small></label>{form.attachment && <button className={styles.removeAttachment} type="button" onClick={() => { setForm({ ...form, attachment: null }); if (createFileRef.current) { createFileRef.current.value = ""; createFileRef.current.focus(); } setCreateError(""); }}>Remover anexo</button>}</fieldset><button disabled={saving}>{saving ? "Abrindo..." : "Abrir chamado"}</button></form>
    </Modal>
  </PlayerLayout></ProtectedRoute>;
}
