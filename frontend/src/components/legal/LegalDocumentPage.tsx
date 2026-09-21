"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getCurrentLegalDocuments } from "@/services/legalService";
import { LegalDocument, LegalKind } from "@/types/legal";

import styles from "./LegalDocumentPage.module.css";

export function LegalDocumentPage({ kind }: { kind: LegalKind }) {
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const title = kind === "TERMS" ? "Termos de Uso" : "Política de Privacidade";

  useEffect(() => {
    getCurrentLegalDocuments()
      .then((items) => setDocument(items.find((item) => item.kind === kind) ?? null))
      .catch(() => setError("Não foi possível carregar o documento."))
      .finally(() => setLoading(false));
  }, [kind]);

  return <main className={styles.page}><header><Link href="/">← Início</Link><span>A Última Cartada</span></header><article><span className={styles.eyebrow}>Informações legais</span><h1>{title}</h1>{loading ? <p>Carregando...</p> : error ? <p role="alert">{error}</p> : document ? <><p className={styles.version}>Versão {document.version} · Publicada em {new Date(document.published_at ?? "").toLocaleDateString("pt-BR")}</p><div className={styles.body}>{document.body}</div></> : <div className={styles.pending}><h2>Documento em preparação</h2><p>O texto está em revisão e ainda não foi publicado. Esta página não substitui um documento jurídico válido.</p></div>}<nav><Link href="/terms">Termos de Uso</Link><Link href="/privacy">Política de Privacidade</Link></nav></article></main>;
}
