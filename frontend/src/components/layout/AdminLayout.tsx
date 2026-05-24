"use client";

import { ReactNode } from "react";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { getAuthUser } from "@/lib/auth";

import styles from "./AdminLayout.module.css";

type AdminLayoutProps = {
  children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const user = getAuthUser();

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logo}>♦</div>
          <div>
            <strong>Cartada Viva</strong>
            <span>Painel Admin</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/players">Jogadores</a>
          <a href="/admin/groups">Grupos</a>
          <a href="/admin/games">Jogos</a>
          <a href="/admin/cards">Cartas</a>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <span>Bem-vindo(a)</span>
            <strong>{user?.full_name || user?.username}</strong>
          </div>

          <LogoutButton className={styles.logoutButton} />
        </header>

        <section className={styles.content}>{children}</section>
      </main>
    </div>
  );
}
