"use client";

import { FormEvent, useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { getAuthUser } from "@/lib/auth";
import { downloadSupportAttachment, getSupportTickets, reopenSupportTicket, replySupportTicket, updateSupportWorkflow } from "@/services/supportService";
import { SupportCategory, SupportFilters, SupportPriority, SupportStatus, SupportTicket } from "@/types/support";

import styles from "./AdminSupportPage.module.css";

const statusLabels: Record<string,string> = { OPEN:"Aberto", IN_PROGRESS:"Em atendimento", WAITING_USER:"Aguardando usuário", RESOLVED:"Resolvido", CLOSED:"Encerrado" };
const categoryLabels: Record<string,string> = { ACCESS:"Acesso", GAME:"Jogo", MENTORSHIP:"Mentoria", PAYMENT:"Pagamento", TECHNICAL:"Técnico", OTHER:"Outro" };

export default function AdminSupportPage() {
  const user = getAuthUser();
  const [tickets,setTickets] = useState<SupportTicket[]>([]);
  const [selected,setSelected] = useState<SupportTicket|null>(null);
  const [filters,setFilters] = useState<SupportFilters>({});
  const [reply,setReply] = useState("");
  const [file,setFile] = useState<File|null>(null);
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState("");

  async function load(nextFilters=filters, preferredId?:number) {
    try { setLoading(true); const data=await getSupportTickets(nextFilters); setTickets(data); const target=preferredId??selected?.id; if(target)setSelected(data.find((ticket)=>ticket.id===target)??null); }
    catch { setError("Não foi possível carregar a fila de suporte."); }
    finally { setLoading(false); }
  }

  useEffect(()=>{ getSupportTickets().then((data)=>{ setTickets(data); const requested=Number(new URLSearchParams(window.location.search).get("ticket")); if(requested)setSelected(data.find((ticket)=>ticket.id===requested)??null); }).catch(()=>setError("Não foi possível carregar a fila de suporte.")).finally(()=>setLoading(false)); },[]);

  async function workflow(payload:{status?:SupportStatus;priority?:SupportPriority;assignee?:number|null}) { if(!selected)return; try{setSaving(true);await updateSupportWorkflow(selected.id,payload);await load(filters,selected.id);}catch{setError("Não foi possível atualizar o chamado.");}finally{setSaving(false);} }
  async function sendReply(event:FormEvent){event.preventDefault();if(!selected)return;try{setSaving(true);await replySupportTicket(selected.id,reply,file);await load(filters,selected.id);setReply("");setFile(null);}catch{setError("Não foi possível responder.");}finally{setSaving(false);}}
  async function reopen(){if(!selected)return;try{setSaving(true);await reopenSupportTicket(selected.id);await load(filters,selected.id);}catch{setError("Não foi possível reabrir o chamado.");}finally{setSaving(false);}}

  const openCount=tickets.filter((ticket)=>!["RESOLVED","CLOSED"].includes(ticket.status)).length;
  return <ProtectedRoute allowedRoles={["DEV","GENERAL_ADMIN","ADMIN"]}><AdminLayout>
    <header className={styles.heading}><div><span>Atendimento</span><h1>Fila de suporte</h1><p>Organize prioridades, responsáveis e conversas com os participantes.</p></div><strong>{openCount} em atendimento</strong></header>
    {error&&<div className={styles.error}>{error}</div>}
    <section className={styles.filters}><label>Status<select value={filters.status??""} onChange={(e)=>setFilters({...filters,status:(e.target.value||undefined) as SupportStatus|undefined})}><option value="">Todos</option>{Object.entries(statusLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><label>Prioridade<select value={filters.priority??""} onChange={(e)=>setFilters({...filters,priority:(e.target.value||undefined) as SupportPriority|undefined})}><option value="">Todas</option><option value="LOW">Baixa</option><option value="NORMAL">Normal</option><option value="HIGH">Alta</option><option value="URGENT">Urgente</option></select></label><label>Categoria<select value={filters.category??""} onChange={(e)=>setFilters({...filters,category:(e.target.value||undefined) as SupportCategory|undefined})}><option value="">Todas</option>{Object.entries(categoryLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><button onClick={()=>void load()}>Filtrar fila</button></section>
    <div className={styles.workspace}><aside>{loading?<p>Carregando...</p>:tickets.length===0?<p>Nenhum chamado encontrado.</p>:tickets.map((ticket)=><button className={selected?.id===ticket.id?styles.selected:""} key={ticket.id} onClick={()=>setSelected(ticket)}><div><span>#{ticket.protocol.slice(0,8)}</span><b className={styles[ticket.priority.toLowerCase()]}>{ticket.priority}</b></div><strong>{ticket.subject}</strong><small>{ticket.requester_name} • {statusLabels[ticket.status]}</small><time>{new Date(ticket.updated_at).toLocaleString("pt-BR")}</time></button>)}</aside><main>{selected?<><header className={styles.ticketHeader}><div><span>#{selected.protocol.slice(0,8)} • {categoryLabels[selected.category]}</span><h2>{selected.subject}</h2><p>Solicitante: {selected.requester_name}</p></div><b>{statusLabels[selected.status]}</b></header><section className={styles.workflow}><label>Status<select value={selected.status} onChange={(e)=>void workflow({status:e.target.value as SupportStatus})}>{Object.entries(statusLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><label>Prioridade<select value={selected.priority} onChange={(e)=>void workflow({priority:e.target.value as SupportPriority})}><option value="LOW">Baixa</option><option value="NORMAL">Normal</option><option value="HIGH">Alta</option><option value="URGENT">Urgente</option></select></label><div><span>Responsável</span><strong>{selected.assignee_name}</strong>{!selected.assignee&&<button disabled={saving} onClick={()=>void workflow({assignee:user?.id})}>Atribuir a mim</button>}</div>{["RESOLVED","CLOSED"].includes(selected.status)&&<button onClick={()=>void reopen()}>Reabrir chamado</button>}</section><section className={styles.messages}>{selected.messages.map((item)=><article className={item.author_is_staff?styles.staff:styles.requester} key={item.id}><header><strong>{item.author_name}</strong><time>{new Date(item.created_at).toLocaleString("pt-BR")}</time></header><p>{item.message}</p>{item.attachment_available&&<button onClick={()=>void downloadSupportAttachment(selected.id,item)}>Baixar anexo</button>}</article>)}</section>{selected.status!=="CLOSED"&&<form className={styles.reply} onSubmit={sendReply}><textarea required minLength={3} placeholder="Escreva uma resposta..." value={reply} onChange={(e)=>setReply(e.target.value)}/><div><input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.doc,.docx" onChange={(e)=>setFile(e.target.files?.[0]??null)}/><button disabled={saving}>{saving?"Enviando...":"Responder"}</button></div></form>}<details className={styles.history}><summary>Histórico do chamado ({selected.history.length})</summary>{selected.history.map((item)=><div key={item.id}><time>{new Date(item.created_at).toLocaleString("pt-BR")}</time><span>{item.actor_name}: {item.event} {item.from_value&&`${item.from_value} → `}{item.to_value}</span></div>)}</details></>:<div className={styles.empty}>Selecione um chamado da fila.</div>}</main></div>
  </AdminLayout></ProtectedRoute>;
}
