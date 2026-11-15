"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { acceptLegalDocument, getPendingLegalDocuments } from "@/services/legalService";
import { LegalDocument } from "@/types/legal";

import styles from "./LegalAcceptanceGate.module.css";

export function LegalAcceptanceGate({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<LegalDocument[] | null>(null);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const savingRef = useRef(false);
  const checkingRef = useRef(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let canceled = false;
    async function checkDocuments() {
      checkingRef.current = true;
      setChecking(true);
      try {
        const items = await getPendingLegalDocuments();
        if (canceled) return;
        setPending(items);
        setError("");
        if (attempt > 0 && items.length > 0) requestAnimationFrame(() => {
          if (!canceled) titleRef.current?.focus();
        });
      } catch {
        if (!canceled) setError("Não foi possível verificar os documentos legais.");
      } finally {
        if (!canceled) {
          checkingRef.current = false;
          setChecking(false);
        }
      }
    }
    void checkDocuments();
    return () => { canceled = true; };
  }, [attempt]);

  async function accept() {
    if (!pending || !checked || savingRef.current) return;
    savingRef.current = true;
    try {
      setSaving(true);
      setError("");
      for (const document of pending) await acceptLegalDocument(document.id);
      setPending([]);
    } catch {
      setError("Não foi possível registrar o aceite. Tente novamente.");
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  if (error && pending === null) return <main className={styles.state}><p role="alert">{error}</p><button type="button" aria-disabled={checking} onClick={() => {
    if (checkingRef.current) return;
    checkingRef.current = true;
    setAttempt((value) => value + 1);
  }}>{checking ? "Verificando documentos..." : "Tentar novamente"}</button></main>;
  if (pending === null) return <main className={styles.state} role="status">Verificando documentos legais...</main>;
  if (pending.length === 0) return children;
  return <main className={styles.page}><section><span>Atualização importante</span><h1 ref={titleRef} tabIndex={-1}>Revise os documentos vigentes</h1><p>Para continuar, leia as versões atuais e registre seu aceite.</p><div className={styles.documents}>{pending.map((document) => <article key={document.id}><strong>{document.title}</strong><small>Versão {document.version}</small><Link href={document.kind === "TERMS" ? "/terms" : "/privacy"} target="_blank" rel="noopener noreferrer">Ler documento</Link></article>)}</div><label><input type="checkbox" disabled={saving} checked={checked} onChange={(event) => setChecked(event.target.checked)} />Li e aceito os documentos listados acima.</label>{error && <p role="alert" className={styles.error}>{error}</p>}<button type="button" disabled={!checked || saving} onClick={() => void accept()}>{saving ? "Registrando..." : "Aceitar e continuar"}</button></section></main>;
}
