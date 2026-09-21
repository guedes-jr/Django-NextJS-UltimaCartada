"use client";

import Link from "next/link";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { getAuthUser, hasProduct } from "@/lib/auth";

import styles from "./DashboardPage.module.css";

export default function UnifiedDashboardPage() {
  const user = getAuthUser();
  return <ProtectedRoute allowedRoles={["PLAYER"]}><PlayerLayout>
    <header className={styles.heading}><span>Seu espaço</span><h1>Olá, {user?.first_name || user?.username}</h1><p>Acesse todos os produtos contratados usando a mesma conta.</p></header>
    <section className={styles.grid}>
      {hasProduct(user, "GAME") && <article className={styles.game}><span>Jogo terapêutico</span><h2>Minha jornada no jogo</h2><p>Continue suas rodadas, envie evidências e acompanhe a comunidade.</p><Link href="/player/home">Acessar o jogo</Link></article>}
      {hasProduct(user, "MENTORSHIP") && <article className={styles.mentorship}><span>Conteúdo exclusivo</span><h2>Minha mentoria</h2><p>Assista às aulas, consulte documentos e acompanhe seu progresso.</p><Link href="/mentorship">Acessar a mentoria</Link></article>}
      {!hasProduct(user, "GAME") && !hasProduct(user, "MENTORSHIP") && <div className={styles.empty}>Nenhum produto ativo nesta conta. Entre em contato com o suporte.</div>}
    </section>
  </PlayerLayout></ProtectedRoute>;
}
