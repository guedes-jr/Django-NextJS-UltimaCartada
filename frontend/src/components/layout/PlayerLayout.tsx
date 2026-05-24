"use client";

import { ReactNode } from "react";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { getAuthUser } from "@/lib/auth";

import styles from "./PlayerLayout.module.css";

type PlayerLayoutProps = {
  children: ReactNode;
};

export function PlayerLayout({ children }: PlayerLayoutProps) {
  const user = getAuthUser();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>♦</div>
          <div>
            <strong>Cartada Viva</strong>
            <span>Área do Jogador</span>
          </div>
        </div>

        <LogoutButton className={styles.logoutButton} />
      </header>

      <main className={styles.main}>
        <section className={styles.welcome}>
          <span>Olá,</span>
          <strong>{user?.full_name || user?.username}</strong>
        </section>

        {children}
      </main>
    </div>
  );
}
