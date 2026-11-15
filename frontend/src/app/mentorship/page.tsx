"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Modal } from "@/components/ui/Modal";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { completeMentorshipContent, downloadMentorshipDocument, getMentorshipPrograms } from "@/services/mentorshipService";
import { MentorshipContent, MentorshipProgram } from "@/types/mentorship";

import styles from "./MentorshipPage.module.css";

export default function MentorshipPage() {
  const [programs, setPrograms] = useState<MentorshipProgram[]>([]);
  const [selected, setSelected] = useState<MentorshipContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [viewerError, setViewerError] = useState("");
  const workingRef = useRef(false);

  async function reload() { setPrograms(await getMentorshipPrograms()); }
  useEffect(() => { getMentorshipPrograms().then(setPrograms).catch(() => setError("Não foi possível carregar sua mentoria.")).finally(() => setLoading(false)); }, []);
  const allContents = useMemo(() => programs.flatMap((program) => program.modules.flatMap((module) => module.contents)), [programs]);
  const completed = allContents.filter((content) => content.is_completed).length;
  const progress = allContents.length ? Math.round(completed * 100 / allContents.length) : 0;

  async function complete(content: MentorshipContent) {
    if (workingRef.current || content.is_completed) return;
    workingRef.current = true;
    setWorking(true);
    setViewerError("");
    try {
      await completeMentorshipContent(content.id);
      await reload();
      setSelected((current) => current?.id === content.id ? { ...current, is_completed: true } : current);
    } catch {
      setViewerError("Não foi possível atualizar o progresso. Tente novamente.");
    } finally {
      workingRef.current = false;
      setWorking(false);
    }
  }

  async function download(content: MentorshipContent) {
    if (workingRef.current) return;
    workingRef.current = true;
    setWorking(true);
    setViewerError("");
    try {
      await downloadMentorshipDocument(content);
    } catch {
      setViewerError("Não foi possível baixar o documento. Tente novamente.");
    } finally {
      workingRef.current = false;
      setWorking(false);
    }
  }

  function closeContent() {
    if (!workingRef.current) setSelected(null);
  }

  return <ProtectedRoute allowedRoles={["PLAYER"]} requiredProduct="MENTORSHIP"><PlayerLayout><div data-brand-page="mentorship">
    <header className={styles.heading}><div><span>Portal exclusivo</span><h1>A Última Cartada — Mentoria</h1><p>Conteúdos organizados para acompanhar você em cada etapa.</p></div><div className={styles.progress} data-brand-part="mentorship-progress"><strong>{progress}%</strong><span>{completed} de {allContents.length} concluídos</span><i role="progressbar" aria-label="Conteúdos concluídos na mentoria" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><b style={{ width: `${progress}%` }} /></i></div></header>
    <aside className={styles.gameIncluded} aria-label="Game incluído na mentoria"><strong>O Game Cartada Viva está incluído na sua mentoria.</strong><p>Experimente as práticas e acompanhe seu percurso. A participação nas jornadas depende do vínculo com seu grupo.</p><Link href="/player/home">Acessar o Game Cartada Viva</Link></aside>
    {error && <div className={styles.error}>{error}</div>}
    {loading ? <div className={styles.state}>Carregando conteúdos...</div> : programs.length === 0 ? <div className={styles.state}>Os primeiros conteúdos serão publicados em breve.</div> : programs.map((program) => <section className={styles.program} data-brand-part="mentorship-program" key={program.id}><header><span>Programa</span><h2>{program.title}</h2><p>{program.description}</p></header>{program.modules.map((module) => <article className={styles.module} data-brand-part="module" key={module.id}><div className={styles.moduleTitle}><span>{String(module.order).padStart(2,"0")}</span><div><h3>{module.title}</h3><p>{module.description}</p></div></div><div className={styles.contentList}>{module.contents.map((content) => <button type="button" data-brand-part="mentorship-content" data-completed={content.is_completed} className={content.is_completed ? styles.completed : ""} key={content.id} onClick={() => { setViewerError(""); setSelected(content); }}><span>{content.content_type === "VIDEO" ? "▶" : content.content_type === "DOCUMENT" ? "↓" : "↗"}</span><div><strong>{content.title}</strong><small>{content.content_type === "VIDEO" ? "Vídeo" : content.content_type === "DOCUMENT" ? "Documento" : "Material externo"}</small></div>{content.is_completed && <b>Concluído</b>}</button>)}</div></article>)}</section>)}
    {selected && <Modal title={selected.title} isOpen onClose={closeContent} closeDisabled={working} closeOnBackdrop className={styles.viewerDialog}>
      <div data-brand-part="mentorship-modal" aria-busy={working}>
        <p className={styles.contentType}>{selected.content_type === "VIDEO" ? "Vídeo" : selected.content_type === "DOCUMENT" ? "Documento" : "Material externo"}</p>
        <p>{selected.description}</p>
        {viewerError && <p role="alert" className={styles.error}>{viewerError}</p>}
        {selected.content_type === "VIDEO" && <div className={styles.video}><iframe src={selected.video_url} title={selected.title} allowFullScreen /></div>}
        {selected.content_type === "DOCUMENT" && <button type="button" className={styles.primary} disabled={working} onClick={() => void download(selected)}>{working ? "Processando..." : "Baixar documento protegido"}</button>}
        {selected.content_type === "LINK" && <a className={styles.primary} href={selected.external_url} target="_blank" rel="noopener noreferrer">Abrir material</a>}
        <footer><button type="button" aria-disabled={working || selected.is_completed} onClick={() => void complete(selected)}>{selected.is_completed ? "Conteúdo concluído" : working ? "Salvando..." : "Marcar como concluído"}</button></footer>
      </div>
    </Modal>}

  </div></PlayerLayout></ProtectedRoute>;
}
