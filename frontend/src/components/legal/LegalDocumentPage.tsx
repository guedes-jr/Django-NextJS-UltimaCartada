"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getCurrentLegalDocuments } from "@/services/legalService";
import { LegalDocument, LegalKind } from "@/types/legal";

import styles from "./LegalDocumentPage.module.css";

export function LegalDocumentPage({ kind, brandName = "Magaly Abreu" }: { kind: LegalKind; brandName?: string }) {
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const title = kind === "TERMS" ? "Termos de Uso" : "Política de Privacidade";

  useEffect(() => {
    let canceled = false;
    getCurrentLegalDocuments()
      .then((items) => { if (!canceled) setDocument(items.find((item) => item.kind === kind) ?? null); })
      .catch(() => { if (!canceled) setError("Não foi possível carregar o documento."); })
      .finally(() => { if (!canceled) setLoading(false); });
    return () => { canceled = true; };
  }, [kind, attempt]);

  return <main className={styles.page}><header><Link href="/">← Início</Link><span>{brandName}</span></header><article><span className={styles.eyebrow}>Informações legais</span><h1>{title}</h1>{loading ? <p role="status">Carregando...</p> : error ? <p role="alert">{error}</p> : document ? <><p className={styles.version}>Versão {document.version} · Publicada em {new Date(document.published_at ?? "").toLocaleDateString("pt-BR")}</p><div className={styles.body}>{document.body}</div></> : <div className={styles.pending}><h2>Documento em preparação</h2><p>O texto está em revisão e ainda não foi publicado. Esta página não substitui um documento jurídico válido.</p></div>}{(error || (loading && attempt > 0)) && <button type="button" aria-disabled={loading} className={styles.retryButton} onClick={() => { if (loading) return; setError(""); setLoading(true); setAttempt((value) => value + 1); }}>{loading ? "Carregando..." : "Tentar novamente"}</button>}<nav><Link href="/terms">Termos de Uso</Link><Link href="/privacy">Política de Privacidade</Link></nav></article></main>;
}
