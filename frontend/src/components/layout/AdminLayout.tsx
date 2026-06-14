"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { getAuthUser, isAdminRole, UserRole } from "@/lib/auth";

import styles from "./AdminLayout.module.css";

type AdminLayoutProps = {
  children: ReactNode;
};

const menuItems: Array<{ label: string; href: string; roles: UserRole[] }> = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    roles: ["DEV", "GENERAL_ADMIN", "GAME_MEDIATOR", "ADMIN"],
  },
  {
    label: "Jogadores",
    href: "/admin/players",
    roles: ["DEV", "GENERAL_ADMIN", "ADMIN"],
  },
  {
    label: "Grupos",
    href: "/admin/groups",
    roles: ["DEV", "GENERAL_ADMIN", "ADMIN"],
  },
  {
    label: "Jogos",
    href: "/admin/games",
    roles: ["DEV", "GENERAL_ADMIN", "GAME_MEDIATOR", "ADMIN"],
  },
  {
    label: "Rodadas",
    href: "/admin/rounds",
    roles: ["DEV", "GENERAL_ADMIN", "GAME_MEDIATOR", "ADMIN"],
  },
  {
    label: "Cartas",
    href: "/admin/cards",
    roles: ["DEV", "GENERAL_ADMIN", "ADMIN"],
  },
  {
    label: "Jogadas",
    href: "/admin/plays",
    roles: ["DEV", "GENERAL_ADMIN", "GAME_MEDIATOR", "ADMIN"],
  },
  {
    label: "Evidências",
    href: "/admin/evidences",
    roles: ["DEV", "GENERAL_ADMIN", "GAME_MEDIATOR", "ADMIN"],
  },
  {
    label: "Desempenho",
    href: "/admin/performance",
    roles: ["DEV", "GENERAL_ADMIN", "GAME_MEDIATOR", "ADMIN"],
  },
  {
    label: "Relatórios",
    href: "/admin/reports",
    roles: ["DEV", "GENERAL_ADMIN", "GAME_MEDIATOR", "ADMIN"],
  },
  {
    label: "Configurações",
    href: "/admin/settings",
    roles: ["DEV", "GENERAL_ADMIN", "GAME_MEDIATOR", "ADMIN"],
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

  const visibleMenuItems = menuItems.filter((item) => {
    if (!user?.role) {
      return false;
    }

    if (item.roles.includes(user.role)) {
      return true;
    }

    return item.roles.includes("ADMIN") && isAdminRole(user.role);
  });

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
          {visibleMenuItems.map((item) => (
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
