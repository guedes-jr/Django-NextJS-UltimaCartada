"use client";

import { FormEvent, useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  createEntitlement, createMentorshipContent, createMentorshipModule, createMentorshipProgram,
  getEntitlements, getMentorshipContents, getMentorshipModules, getMentorshipPrograms,
  setEntitlementActive, updateMentorshipContent, updateMentorshipModule, updateMentorshipProgram,
} from "@/services/mentorshipService";
import { getPlayers } from "@/services/playerService";
import { MentorshipContent, MentorshipContentType, MentorshipModule, MentorshipProgram, ProductEntitlement } from "@/types/mentorship";
import { PlayerProfile } from "@/types/players";

import styles from "./AdminMentorshipPage.module.css";

export default function AdminMentorshipPage() {
  const [programs, setPrograms] = useState<MentorshipProgram[]>([]);
  const [modules, setModules] = useState<MentorshipModule[]>([]);
  const [contents, setContents] = useState<MentorshipContent[]>([]);
  const [entitlements, setEntitlements] = useState<ProductEntitlement[]>([]);
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [programForm, setProgramForm] = useState({ title: "", description: "", is_published: false });
  const [moduleForm, setModuleForm] = useState({ program: 0, title: "", description: "", order: 1, is_published: false });
  const [contentForm, setContentForm] = useState({ module: 0, title: "", description: "", content_type: "VIDEO" as MentorshipContentType, order: 1, video_url: "", external_url: "", document: null as File | null, is_published: false, is_visible: true });
  const [selectedUser, setSelectedUser] = useState(0);
  const [replacementFiles, setReplacementFiles] = useState<Record<number, File | null>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function reload() {
    const [programData, moduleData, contentData, entitlementData] = await Promise.all([getMentorshipPrograms(), getMentorshipModules(), getMentorshipContents(), getEntitlements()]);
    setPrograms(programData); setModules(moduleData); setContents(contentData); setEntitlements(entitlementData);
  }

  useEffect(() => {
    Promise.all([getMentorshipPrograms(), getMentorshipModules(), getMentorshipContents(), getEntitlements(), getPlayers()])
      .then(([programData, moduleData, contentData, entitlementData, playerData]) => { setPrograms(programData); setModules(moduleData); setContents(contentData); setEntitlements(entitlementData); setPlayers(playerData); })
      .catch(() => setError("Não foi possível carregar a gestão da mentoria."))
      .finally(() => setLoading(false));
  }, []);

  async function execute(action: () => Promise<unknown>, success: string) {
    try { setSaving(true); setError(""); await action(); await reload(); setMessage(success); }
    catch { setError("Não foi possível concluir a operação. Verifique os dados e a ordem dos itens."); }
    finally { setSaving(false); }
  }

  async function addProgram(event: FormEvent) { event.preventDefault(); await execute(() => createMentorshipProgram(programForm), "Programa criado."); setProgramForm({ title: "", description: "", is_published: false }); }
  async function addModule(event: FormEvent) { event.preventDefault(); await execute(() => createMentorshipModule(moduleForm), "Módulo criado."); setModuleForm({ ...moduleForm, title: "", description: "", order: moduleForm.order + 1 }); }
  async function addContent(event: FormEvent) { event.preventDefault(); await execute(() => createMentorshipContent(contentForm), "Conteúdo criado."); setContentForm({ ...contentForm, title: "", description: "", order: contentForm.order + 1, video_url: "", external_url: "", document: null }); }

  const mentorshipAccess = entitlements.filter((item) => item.product === "MENTORSHIP");
  async function grantAccess() {
    if (!selectedUser) return;
    const existing = mentorshipAccess.find((item) => item.user === selectedUser);
    await execute(() => existing ? setEntitlementActive(existing.id, true) : createEntitlement(selectedUser, "MENTORSHIP"), "Acesso à mentoria ativado.");
  }

  return <ProtectedRoute allowedRoles={["DEV", "GENERAL_ADMIN", "ADMIN"]}><AdminLayout>
    <header className={styles.heading}><span>Conteúdo e acessos</span><h1>Gestão da mentoria</h1><p>Organize programas, publique materiais e controle quem possui acesso.</p></header>
    {message && <div className={styles.success}>{message}</div>}{error && <div className={styles.error}>{error}</div>}
    <section className={styles.access}><div><h2>Acessos à mentoria</h2><p>Revogar o acesso não apaga o progresso do participante.</p></div><div className={styles.grant}><select value={selectedUser} onChange={(e) => setSelectedUser(Number(e.target.value))}><option value={0}>Selecione o jogador</option>{players.map((profile) => <option key={profile.id} value={profile.user.id}>{profile.user.full_name || profile.user.username}</option>)}</select><button disabled={!selectedUser || saving} onClick={() => void grantAccess()}>Conceder acesso</button></div><div className={styles.accessList}>{mentorshipAccess.map((item) => <article key={item.id}><div><strong>{item.user_name}</strong><span>@{item.username}</span></div><b className={item.is_current ? styles.active : styles.inactive}>{item.is_current ? "Ativo" : "Inativo"}</b><button onClick={() => void execute(() => setEntitlementActive(item.id, !item.is_active), item.is_active ? "Acesso revogado." : "Acesso reativado.")}>{item.is_active ? "Revogar" : "Reativar"}</button></article>)}</div></section>
    <div className={styles.forms}>
      <form onSubmit={addProgram}><h2>1. Programa</h2><label>Título<input required value={programForm.title} onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })} /></label><label>Descrição<textarea value={programForm.description} onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })} /></label><label className={styles.check}><input type="checkbox" checked={programForm.is_published} onChange={(e) => setProgramForm({ ...programForm, is_published: e.target.checked })} />Publicar agora</label><button disabled={saving}>Criar programa</button></form>
      <form onSubmit={addModule}><h2>2. Módulo</h2><label>Programa<select required value={moduleForm.program || ""} onChange={(e) => setModuleForm({ ...moduleForm, program: Number(e.target.value) })}><option value="">Selecione</option>{programs.map((program) => <option key={program.id} value={program.id}>{program.title}</option>)}</select></label><label>Título<input required value={moduleForm.title} onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} /></label><label>Ordem<input type="number" min={1} value={moduleForm.order} onChange={(e) => setModuleForm({ ...moduleForm, order: Number(e.target.value) })} /></label><label>Descrição<textarea value={moduleForm.description} onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })} /></label><label className={styles.check}><input type="checkbox" checked={moduleForm.is_published} onChange={(e) => setModuleForm({ ...moduleForm, is_published: e.target.checked })} />Publicar agora</label><button disabled={saving || !moduleForm.program}>Criar módulo</button></form>
      <form onSubmit={addContent}><h2>3. Conteúdo</h2><label>Módulo<select required value={contentForm.module || ""} onChange={(e) => setContentForm({ ...contentForm, module: Number(e.target.value) })}><option value="">Selecione</option>{modules.map((module) => <option key={module.id} value={module.id}>{module.title}</option>)}</select></label><label>Título<input required value={contentForm.title} onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })} /></label><label>Tipo<select value={contentForm.content_type} onChange={(e) => setContentForm({ ...contentForm, content_type: e.target.value as MentorshipContentType })}><option value="VIDEO">Vídeo</option><option value="DOCUMENT">Documento</option><option value="LINK">Link</option></select></label><label>Ordem<input type="number" min={1} value={contentForm.order} onChange={(e) => setContentForm({ ...contentForm, order: Number(e.target.value) })} /></label>{contentForm.content_type === "VIDEO" && <label>URL do vídeo<input type="url" required value={contentForm.video_url} onChange={(e) => setContentForm({ ...contentForm, video_url: e.target.value })} /></label>}{contentForm.content_type === "LINK" && <label>URL externa<input type="url" required value={contentForm.external_url} onChange={(e) => setContentForm({ ...contentForm, external_url: e.target.value })} /></label>}{contentForm.content_type === "DOCUMENT" && <label>Documento<input type="file" required accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" onChange={(e) => setContentForm({ ...contentForm, document: e.target.files?.[0] ?? null })} /></label>}<label>Descrição<textarea value={contentForm.description} onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })} /></label><label className={styles.check}><input type="checkbox" checked={contentForm.is_published} onChange={(e) => setContentForm({ ...contentForm, is_published: e.target.checked })} />Publicar agora</label><button disabled={saving || !contentForm.module}>Criar conteúdo</button></form>
    </div>
    <section className={styles.library}><header><h2>Biblioteca cadastrada</h2><span>{contents.length} conteúdos</span></header>{loading ? <p>Carregando...</p> : programs.map((program) => <article className={styles.program} key={program.id}><header><div><strong>{program.title}</strong><span>{program.is_published ? "Publicado" : "Rascunho"}</span></div><button onClick={() => void execute(() => updateMentorshipProgram(program.id, { is_published: !program.is_published }), "Programa atualizado.")}>{program.is_published ? "Ocultar" : "Publicar"}</button></header>{modules.filter((module) => module.program === program.id).map((module) => <div className={styles.module} key={module.id}><header><strong>{module.order}. {module.title}</strong><button onClick={() => void execute(() => updateMentorshipModule(module.id, { is_published: !module.is_published }), "Módulo atualizado.")}>{module.is_published ? "Ocultar" : "Publicar"}</button></header>{contents.filter((content) => content.module === module.id).map((content) => <div className={styles.content} key={content.id}><div><strong>{content.title}</strong><span>{content.content_type} • {content.is_published ? "publicado" : "rascunho"} • {content.is_visible ? "visível" : "oculto"}</span></div><div className={styles.actions}><button onClick={() => void execute(() => updateMentorshipContent(content.id, { is_published: !content.is_published }), "Conteúdo atualizado.")}>{content.is_published ? "Despublicar" : "Publicar"}</button><button onClick={() => void execute(() => updateMentorshipContent(content.id, { is_visible: !content.is_visible }), "Visibilidade atualizada.")}>{content.is_visible ? "Ocultar" : "Exibir"}</button>{content.content_type === "DOCUMENT" && <><input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setReplacementFiles({ ...replacementFiles, [content.id]: e.target.files?.[0] ?? null })} /><button disabled={!replacementFiles[content.id]} onClick={() => void execute(() => updateMentorshipContent(content.id, { document: replacementFiles[content.id]! }), "Documento substituído.")}>Substituir</button></>}</div></div>)}</div>)}</article>)}</section>
  </AdminLayout></ProtectedRoute>;
}
