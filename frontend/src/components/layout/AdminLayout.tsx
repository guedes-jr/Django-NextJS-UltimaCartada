"use client";

import Link from "next/link";
import { ReactNode } from "react";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { getAuthUser } from "@/lib/auth";

import styles from "./AdminLayout.module.css";

type AdminLayoutProps = {
  children: ReactNode;
};

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    label: "Jogadores",
    href: "/admin/players",
  },
  {
    label: "Grupos",
    href: "/admin/groups",
  },
  {
    label: "Jogos",
    href: "/admin/games",
  },
  {
    label: "Cartas",
    href: "/admin/cards",
  },
  {
    label: "Jogadas",
    href: "/admin/plays",
  },
  {
    label: "Evidências",
    href: "/admin/evidences",
  },
  {
    label: "Desempenho",
    href: "/admin/performance",
  },
];

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
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
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
