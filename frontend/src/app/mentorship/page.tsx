"use client";

import { useEffect, useMemo, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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

  async function reload() { setPrograms(await getMentorshipPrograms()); }
  useEffect(() => { getMentorshipPrograms().then(setPrograms).catch(() => setError("Não foi possível carregar sua mentoria.")).finally(() => setLoading(false)); }, []);
  const allContents = useMemo(() => programs.flatMap((program) => program.modules.flatMap((module) => module.contents)), [programs]);
  const completed = allContents.filter((content) => content.is_completed).length;
  const progress = allContents.length ? Math.round(completed * 100 / allContents.length) : 0;

  async function complete(content: MentorshipContent) {
    try { setWorking(true); await completeMentorshipContent(content.id); await reload(); setSelected((current) => current ? { ...current, is_completed: true } : current); }
    catch { setError("Não foi possível atualizar o progresso."); }
    finally { setWorking(false); }
  }

  return <ProtectedRoute allowedRoles={["PLAYER"]} requiredProduct="MENTORSHIP"><PlayerLayout>
    <header className={styles.heading}><div><span>Portal exclusivo</span><h1>Minha mentoria</h1><p>Conteúdos organizados para acompanhar você em cada etapa.</p></div><div className={styles.progress}><strong>{progress}%</strong><span>{completed} de {allContents.length} concluídos</span><i><b style={{ width: `${progress}%` }} /></i></div></header>
    {error && <div className={styles.error}>{error}</div>}
    {loading ? <div className={styles.state}>Carregando conteúdos...</div> : programs.length === 0 ? <div className={styles.state}>Os primeiros conteúdos serão publicados em breve.</div> : programs.map((program) => <section className={styles.program} key={program.id}><header><span>Programa</span><h2>{program.title}</h2><p>{program.description}</p></header>{program.modules.map((module) => <article className={styles.module} key={module.id}><div className={styles.moduleTitle}><span>{String(module.order).padStart(2,"0")}</span><div><h3>{module.title}</h3><p>{module.description}</p></div></div><div className={styles.contentList}>{module.contents.map((content) => <button type="button" className={content.is_completed ? styles.completed : ""} key={content.id} onClick={() => setSelected(content)}><span>{content.content_type === "VIDEO" ? "▶" : content.content_type === "DOCUMENT" ? "↓" : "↗"}</span><div><strong>{content.title}</strong><small>{content.content_type === "VIDEO" ? "Vídeo" : content.content_type === "DOCUMENT" ? "Documento" : "Material externo"}</small></div>{content.is_completed && <b>Concluído</b>}</button>)}</div></article>)}</section>)}
    {selected && <div className={styles.backdrop} onMouseDown={() => setSelected(null)}><section className={styles.modal} onMouseDown={(event) => event.stopPropagation()}><header><div><span>{selected.content_type}</span><h2>{selected.title}</h2></div><button onClick={() => setSelected(null)}>Fechar</button></header><p>{selected.description}</p>{selected.content_type === "VIDEO" && <div className={styles.video}><iframe src={selected.video_url} title={selected.title} allowFullScreen /></div>}{selected.content_type === "DOCUMENT" && <button className={styles.primary} onClick={() => void downloadMentorshipDocument(selected)}>Baixar documento protegido</button>}{selected.content_type === "LINK" && <a className={styles.primary} href={selected.external_url} target="_blank" rel="noreferrer">Abrir material</a>}<footer><button disabled={working || selected.is_completed} onClick={() => void complete(selected)}>{selected.is_completed ? "Conteúdo concluído" : working ? "Salvando..." : "Marcar como concluído"}</button></footer></section></div>}
  </PlayerLayout></ProtectedRoute>;
}
