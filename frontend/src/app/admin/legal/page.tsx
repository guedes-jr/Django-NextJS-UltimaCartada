"use client";

import { FormEvent, useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { createLegalDocument, getAllLegalDocuments, publishLegalDocument, updateLegalDocument } from "@/services/legalService";
import { LegalDocument, LegalKind } from "@/types/legal";
import styles from "./LegalAdminPage.module.css";

type FormData = { kind: LegalKind; version: string; title: string; body: string; requires_acceptance: boolean };
const emptyForm: FormData = { kind: "TERMS", version: "", title: "", body: "", requires_acceptance: true };

export default function LegalAdminPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function reload() { setDocuments(await getAllLegalDocuments()); }
  useEffect(() => { getAllLegalDocuments().then(setDocuments).catch(() => setError("Não foi possível carregar os documentos.")).finally(() => setLoading(false)); }, []);

  function edit(document: LegalDocument) {
    setEditingId(document.id);
    setForm({ kind: document.kind, version: document.version, title: document.title, body: document.body, requires_acceptance: document.requires_acceptance });
    setError(""); setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function revise(document: LegalDocument) {
    setEditingId(null);
    setForm({ kind: document.kind, version: "", title: document.title, body: document.body, requires_acceptance: document.requires_acceptance });
    setError(""); setMessage("Informe uma nova versão, ajuste o texto e salve o rascunho. A versão vigente permanece intacta.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    try {
      setSaving(true); setError(""); setMessage("");
      if (editingId) await updateLegalDocument(editingId, form);
      else await createLegalDocument(form);
      await reload();
      setForm(emptyForm); setEditingId(null);
      setMessage("Rascunho salvo. Revise os dados e o texto antes de publicar.");
    } catch { setError("Não foi possível salvar. Confira os campos e use uma versão diferente para cada documento."); }
    finally { setSaving(false); }
  }

  async function publish(document: LegalDocument) {
    if (!window.confirm(`Publicar a versão ${document.version} de ${document.title}? A versão anterior deixará de ser vigente e poderá ser exigido novo aceite.`)) return;
    try { setSaving(true); setError(""); await publishLegalDocument(document.id); await reload(); setMessage("Versão publicada. Os usuários receberão solicitação de aceite, se configurada."); }
    catch { setError("Não foi possível publicar. Remova todos os campos [PREENCHER:] e a indicação de minuta; confira também a revisão jurídica."); }
    finally { setSaving(false); }
  }

  return <ProtectedRoute allowedRoles={["DEV", "GENERAL_ADMIN", "ADMIN"]}><AdminLayout>
    <header className={styles.heading}><span>Governança</span><h1>Documentos legais</h1><p>Minutas padrão estão disponíveis para edição. Substitua todos os campos [PREENCHER:] e obtenha revisão jurídica antes de publicar.</p></header>
    {message && <div className={styles.success} role="status">{message}</div>}{error && <div className={styles.error} role="alert">{error}</div>}
    <form className={styles.form} onSubmit={save}>
      <h2>{editingId ? "Editar rascunho" : "Nova versão em rascunho"}</h2>
      <div className={styles.grid}>
        <label>Tipo<select value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value as LegalKind })}><option value="TERMS">Termos de Uso</option><option value="PRIVACY">Política de Privacidade</option></select></label>
        <label>Versão<input required value={form.version} onChange={(event) => setForm({ ...form, version: event.target.value })} placeholder="Ex.: 1.0" /></label>
        <label className={styles.wide}>Título<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
        <label className={styles.wide}>Texto jurídico<textarea required minLength={100} value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} /></label>
        <label className={styles.check}><input type="checkbox" checked={form.requires_acceptance} onChange={(event) => setForm({ ...form, requires_acceptance: event.target.checked })} />Exigir aceite desta versão</label>
      </div>
      <div className={styles.actions}><button disabled={saving}>{saving ? "Salvando..." : "Salvar rascunho"}</button>{editingId && <button type="button" className={styles.secondary} disabled={saving} onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancelar edição</button>}</div>
    </form>
    <section className={styles.list}><h2>Versões cadastradas</h2>{loading ? <p>Carregando...</p> : documents.length === 0 ? <p>Nenhum documento cadastrado.</p> : documents.map((document) => <article key={document.id}><div><strong>{document.title}</strong><span>{document.kind === "TERMS" ? "Termos de Uso" : "Política de Privacidade"} · versão {document.version} · {document.is_published ? "Vigente" : document.published_at ? "Arquivada" : "Rascunho"}</span></div><div className={styles.actions}>{!document.published_at && <><button type="button" className={styles.secondary} disabled={saving} onClick={() => edit(document)}>Editar</button><button type="button" disabled={saving} onClick={() => void publish(document)}>Publicar</button></>}{document.published_at && <button type="button" className={styles.secondary} disabled={saving} onClick={() => revise(document)}>Criar nova versão</button>}</div></article>)}</section>
  </AdminLayout></ProtectedRoute>;
}
