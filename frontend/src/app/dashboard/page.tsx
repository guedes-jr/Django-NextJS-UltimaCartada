"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { hasProduct } from "@/lib/auth";
import styles from "./DashboardPage.module.css";

export default function UnifiedDashboardPage() {
  return <ProtectedRoute allowedRoles={["PLAYER"]}>{(user) => <PlayerLayout>
    <div data-brand-page="dashboard">
      <header className={styles.heading}><span>Seu espaço</span><h1>Olá, {user.first_name || user.username}</h1><p>Acesse suas experiências com a mesma conta. O Game Cartada Viva está incluído na Mentoria A Última Cartada.</p></header>
      <section className={styles.grid}>
        {hasProduct(user, "MENTORSHIP") && <article className={styles.mentorship} data-brand-offer="mentorship"><span>Conteúdo exclusivo</span><h2>A Última Cartada — Mentoria</h2><p>Assista às aulas, consulte documentos e acompanhe seu progresso.</p><Link href="/mentorship">Acessar a mentoria</Link></article>}
        {hasProduct(user, "GAME") && <article className={styles.game} data-brand-offer="game"><span>{hasProduct(user, "MENTORSHIP") ? "Incluído na sua mentoria" : "Game de hábitos"}</span><h2>Cartada Viva — Game</h2><p>Continue suas práticas, envie evidências e acompanhe a comunidade.</p><Link href="/player/home">Acessar o jogo</Link></article>}
        {!hasProduct(user, "GAME") && !hasProduct(user, "MENTORSHIP") && <div className={styles.empty}>Nenhum produto ativo nesta conta. Entre em contato com o suporte.</div>}
      </section>
    </div>
  </PlayerLayout>}</ProtectedRoute>;
}
