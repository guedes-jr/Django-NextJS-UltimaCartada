"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { acceptLegalDocument, getPendingLegalDocuments } from "@/services/legalService";
import { LegalDocument } from "@/types/legal";

import styles from "./LegalAcceptanceGate.module.css";

export function LegalAcceptanceGate({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<LegalDocument[] | null>(null);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getPendingLegalDocuments()
      .then(setPending)
      .catch(() => setError("Não foi possível verificar os documentos legais."));
  }, []);

  async function accept() {
    if (!pending || !checked) return;
    try {
      setSaving(true);
      setError("");
      for (const document of pending) await acceptLegalDocument(document.id);
      setPending([]);
    } catch {
      setError("Não foi possível registrar o aceite. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  if (error && pending === null) return <main className={styles.state} role="alert">{error}</main>;
  if (pending === null) return <main className={styles.state}>Verificando documentos legais...</main>;
  if (pending.length === 0) return children;
  return <main className={styles.page}><section><span>Atualização importante</span><h1>Revise os documentos vigentes</h1><p>Para continuar, leia as versões atuais e registre seu aceite.</p><div className={styles.documents}>{pending.map((document) => <article key={document.id}><strong>{document.title}</strong><small>Versão {document.version}</small><Link href={document.kind === "TERMS" ? "/terms" : "/privacy"} target="_blank">Ler documento</Link></article>)}</div><label><input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} />Li e aceito os documentos listados acima.</label>{error && <p role="alert" className={styles.error}>{error}</p>}<button type="button" disabled={!checked || saving} onClick={() => void accept()}>{saving ? "Registrando..." : "Aceitar e continuar"}</button></section></main>;
}
