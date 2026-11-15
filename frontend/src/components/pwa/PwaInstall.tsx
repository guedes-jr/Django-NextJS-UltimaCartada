"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PwaInstall.module.css";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export function PwaInstall({ presentation = "legacy" }: { presentation?: "legacy" | "consultoria" }) {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState(false);
  const installingRef = useRef(false);
  const [installed, setInstalled] = useState(() => typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(presentation === "consultoria" ? "/sw.js?presentation=consultoria" : "/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => undefined);
    const onPrompt = (event: Event) => { event.preventDefault(); setError(false); setPrompt(event as InstallPrompt); };
    const onInstalled = () => { setInstalled(true); setError(false); setPrompt(null); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, [presentation]);

  if (installed) return null;
  async function install() {
    if (!prompt || installingRef.current) return;
    installingRef.current = true;
    setInstalling(true);
    setError(false);
    try {
      await prompt.prompt();
      await prompt.userChoice;
    } catch {
      setError(true);
    } finally {
      // O evento de instalação só pode ser usado uma vez, inclusive após falha.
      setPrompt((current) => current === prompt ? null : current);
      installingRef.current = false;
      setInstalling(false);
    }
  }
  if (!prompt && !error) return null;
  return <aside className={`${styles.installation} ${presentation === "consultoria" ? styles.consultoria : ""}`} aria-label="Instalação do aplicativo">
    <button className={styles.button} type="button" aria-disabled={installing || !prompt} aria-describedby={error ? "pwa-install-error" : undefined} onClick={() => void install()}>{installing ? "Aguardando o navegador…" : error && !prompt ? "Instalação indisponível" : "Instalar aplicativo"}</button>
    {error && <div className={styles.error}>
      <p id="pwa-install-error" role="status">Não foi possível abrir a instalação. Você pode continuar usando o site e tentar novamente pelo menu do navegador.</p>
      <button type="button" onClick={() => setError(false)}>Fechar aviso</button>
    </div>}
  </aside>;
}
