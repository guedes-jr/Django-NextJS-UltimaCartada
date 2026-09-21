"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { getAuthUser, isAdminRole, UserRole } from "@/lib/auth";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notificationService";
import { Notification } from "@/types/notifications";

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
    label: "Jornadas",
    href: "/admin/journeys",
    roles: ["DEV", "GENERAL_ADMIN", "ADMIN"],
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
    label: "Auditoria",
    href: "/admin/audit",
    roles: ["DEV", "GENERAL_ADMIN", "ADMIN"],
  },
  {
    label: "Desafios",
    href: "/admin/challenges",
    roles: ["DEV", "GENERAL_ADMIN", "GAME_MEDIATOR", "ADMIN"],
  },
  {
    label: "Mentoria",
    href: "/admin/mentorship",
    roles: ["DEV", "GENERAL_ADMIN", "ADMIN"],
  },
  {
    label: "Suporte",
    href: "/admin/support",
    roles: ["DEV", "GENERAL_ADMIN", "ADMIN"],
  },
  {
    label: "Documentos legais",
    href: "/admin/legal",
    roles: ["DEV", "GENERAL_ADMIN", "ADMIN"],
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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  async function loadNotifications() {
    try {
      setNotifications((await getNotifications()).slice(0, 8));
    } catch {
      // The layout remains usable if notifications are temporarily unavailable.
    }
  }

  useEffect(() => {
    getNotifications()
      .then((items) => setNotifications(items.slice(0, 8)))
      .catch(() => undefined);
    const interval = window.setInterval(() => void loadNotifications(), 60000);
    return () => window.clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  async function readNotification(notification: Notification) {
    if (!notification.is_read) {
      await markNotificationRead(notification.id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, is_read: true } : item
        )
      );
    }
    setIsNotificationsOpen(false);
  }

  async function readAllNotifications() {
    await markAllNotificationsRead();
    setNotifications((current) =>
      current.map((item) => ({ ...item, is_read: true }))
    );
  }

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
          <Image
            className={styles.brandLogo}
            src="/ultima-cartada-logo.png"
            alt="A Última Cartada"
            width={220}
            height={220}
            priority
          />
          <span>Painel administrativo</span>
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

          <div className={styles.notificationArea}>
            <button
              className={styles.notificationButton}
              type="button"
              aria-label={`Notificações${unreadCount ? `: ${unreadCount} não lidas` : ""}`}
              aria-expanded={isNotificationsOpen}
              onClick={() => setIsNotificationsOpen((current) => !current)}
            >
              <Bell aria-hidden="true" />
              {unreadCount > 0 && <span>{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>
            {isNotificationsOpen && (
              <section className={styles.notificationPanel} aria-label="Central de notificações">
                <header><strong>Notificações</strong>{unreadCount > 0 && <button type="button" onClick={() => void readAllNotifications()}>Marcar todas como lidas</button>}</header>
                {notifications.length === 0 ? <p>Nenhuma notificação por enquanto.</p> : (
                  <div className={styles.notificationList}>
                    {notifications.map((notification) => (
                      <Link
                        key={notification.id}
                        href={notification.link || "#"}
                        className={!notification.is_read ? styles.unreadNotification : ""}
                        onClick={() => void readNotification(notification)}
                      >
                        <strong>{notification.title}</strong>
                        <span>{notification.message}</span>
                        <small>{new Date(notification.created_at).toLocaleString("pt-BR")}</small>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>

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
