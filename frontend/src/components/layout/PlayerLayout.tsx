"use client";

import Link from "next/link";
import { ReactNode } from "react";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { getAuthUser } from "@/lib/auth";

import styles from "./PlayerLayout.module.css";

type PlayerLayoutProps = {
  children: ReactNode;
};

const menuItems = [
  {
    label: "Início",
    href: "/player/home",
  },
  {
    label: "Meu desempenho",
    href: "/player/performance",
  },
  {
    label: "Ranking",
    href: "/player/ranking",
  },
];

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

        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

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
