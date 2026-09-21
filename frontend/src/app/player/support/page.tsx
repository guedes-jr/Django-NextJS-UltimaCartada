"use client";

import { FormEvent, useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { createSupportTicket, downloadSupportAttachment, getSupportTickets, replySupportTicket } from "@/services/supportService";
import { SupportCategory, SupportPriority, SupportTicket } from "@/types/support";

import styles from "./PlayerSupportPage.module.css";

const statusLabels: Record<string, string> = { OPEN: "Aberto", IN_PROGRESS: "Em atendimento", WAITING_USER: "Aguardando você", RESOLVED: "Resolvido", CLOSED: "Encerrado" };
const categoryLabels: Record<string, string> = { ACCESS: "Acesso e conta", GAME: "Jogo", MENTORSHIP: "Mentoria", PAYMENT: "Pagamento", TECHNICAL: "Problema técnico", OTHER: "Outro" };

export default function PlayerSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ category: "TECHNICAL" as SupportCategory, subject: "", priority: "NORMAL" as SupportPriority, message: "", attachment: null as File | null });
  const [reply, setReply] = useState("");
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function reload(preferredId?: number) {
    const data = await getSupportTickets();
    setTickets(data);
    const targetId = preferredId ?? selected?.id;
    if (targetId) setSelected(data.find((ticket) => ticket.id === targetId) ?? null);
  }

  useEffect(() => {
    getSupportTickets().then((data) => {
      setTickets(data);
      const requested = Number(new URLSearchParams(window.location.search).get("ticket"));
      if (requested) setSelected(data.find((ticket) => ticket.id === requested) ?? null);
    }).catch(() => setError("Não foi possível carregar seus chamados.")).finally(() => setLoading(false));
  }, []);

  async function create(event: FormEvent) {
    event.preventDefault();
    try { setSaving(true); setError(""); const ticket = await createSupportTicket(form); await reload(ticket.id); setShowCreate(false); setForm({ category: "TECHNICAL", subject: "", priority: "NORMAL", message: "", attachment: null }); setMessage("Chamado aberto. Nossa equipe foi notificada."); }
    catch { setError("Não foi possível abrir o chamado. Confira os campos e o anexo."); }
    finally { setSaving(false); }
  }

  async function sendReply(event: FormEvent) {
    event.preventDefault(); if (!selected) return;
    try { setSaving(true); setError(""); await replySupportTicket(selected.id, reply, replyFile); await reload(selected.id); setReply(""); setReplyFile(null); setMessage("Resposta enviada."); }
    catch { setError("Não foi possível enviar a resposta."); }
    finally { setSaving(false); }
  }

  return <ProtectedRoute allowedRoles={["PLAYER"]}><PlayerLayout>
    <header className={styles.heading}><div><span>Central de ajuda</span><h1>Meus chamados</h1><p>Acompanhe todas as conversas com nossa equipe em um só lugar.</p></div><button onClick={() => setShowCreate(true)}>Abrir novo chamado</button></header>
    {message && <div className={styles.success}>{message}</div>}{error && <div className={styles.error}>{error}</div>}
    <div className={styles.workspace}><aside><h2>Histórico</h2>{loading ? <p>Carregando...</p> : tickets.length === 0 ? <p>Você ainda não abriu chamados.</p> : tickets.map((ticket) => <button className={selected?.id === ticket.id ? styles.selected : ""} key={ticket.id} onClick={() => setSelected(ticket)}><span>#{ticket.protocol.slice(0, 8)}</span><strong>{ticket.subject}</strong><small>{statusLabels[ticket.status]} • {new Date(ticket.updated_at).toLocaleDateString("pt-BR")}</small></button>)}</aside>
      <main>{selected ? <><header className={styles.ticketHeader}><div><span>#{selected.protocol.slice(0, 8)} • {categoryLabels[selected.category]}</span><h2>{selected.subject}</h2></div><b className={styles[selected.status.toLowerCase()]}>{statusLabels[selected.status]}</b></header><section className={styles.messages}>{selected.messages.map((item) => <article className={item.author_is_staff ? styles.staffMessage : styles.userMessage} key={item.id}><header><strong>{item.author_name}</strong><time>{new Date(item.created_at).toLocaleString("pt-BR")}</time></header><p>{item.message}</p>{item.attachment_available && <button onClick={() => void downloadSupportAttachment(selected.id, item)}>Baixar anexo</button>}</article>)}</section>{selected.status === "CLOSED" ? <div className={styles.closed}>Este chamado foi encerrado. Se ainda precisar de ajuda, abra um novo chamado.</div> : <form className={styles.reply} onSubmit={sendReply}><label>Responder<textarea required minLength={3} value={reply} onChange={(e) => setReply(e.target.value)} /></label><div><input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.doc,.docx" onChange={(e) => setReplyFile(e.target.files?.[0] ?? null)} /><button disabled={saving}>{saving ? "Enviando..." : "Enviar resposta"}</button></div></form>}</> : <div className={styles.empty}>Selecione um chamado para acompanhar a conversa.</div>}</main>
    </div>
    {showCreate && <div className={styles.backdrop} onMouseDown={() => setShowCreate(false)}><form className={styles.modal} onSubmit={create} onMouseDown={(e) => e.stopPropagation()}><header><div><span>Novo atendimento</span><h2>Como podemos ajudar?</h2></div><button type="button" onClick={() => setShowCreate(false)}>Fechar</button></header><label>Categoria<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as SupportCategory })}>{Object.entries(categoryLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>Assunto<input required minLength={5} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></label><label>Prioridade<select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as SupportPriority })}><option value="LOW">Baixa</option><option value="NORMAL">Normal</option><option value="HIGH">Alta</option><option value="URGENT">Urgente</option></select></label><label>Descreva sua dúvida<textarea required minLength={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label><label>Anexo opcional<input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.doc,.docx" onChange={(e) => setForm({ ...form, attachment: e.target.files?.[0] ?? null })} /><small>Até 10 MB.</small></label><button disabled={saving}>{saving ? "Abrindo..." : "Abrir chamado"}</button></form></div>}
  </PlayerLayout></ProtectedRoute>;
}
