"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

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
    label: "Rodadas",
    href: "/admin/rounds",
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
  {
    label: "Relatórios",
    href: "/admin/reports",
  },
  {
    label: "Configurações",
    href: "/admin/settings",
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const user = getAuthUser();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <div className={styles.page}>
      <aside
        className={`${styles.sidebar} ${isMenuOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.brand}>
          <div className={styles.logo}>♦</div>
          <div>
            <strong>Cartada Viva</strong>
            <span>Painel Admin</span>
          </div>
        </div>

        <nav className={styles.nav} id="admin-navigation">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? styles.activeLink : ""}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {isMenuOpen && (
        <button
          className={styles.overlay}
          type="button"
          aria-label="Fechar menu"
          onClick={closeMenu}
        />
      )}

      <main className={styles.main}>
        <header className={styles.header}>
          <button
            className={styles.menuButton}
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="admin-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? "Fechar menu" : "Menu"}
          </button>

          <div className={styles.userInfo}>
            <span>Bem-vindo(a)</span>
            <strong>
              {user?.full_name || user?.first_name || user?.username}
            </strong>
          </div>

          <LogoutButton className={styles.logoutButton} />
        </header>

        <section className={styles.content}>{children}</section>
      </main>
    </div>
  );
}
