"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { PlayerOnboardingTour } from "@/components/onboarding/PlayerOnboardingTour";
import { getAuthUser, hasProduct } from "@/lib/auth";

import styles from "./PlayerLayout.module.css";

type PlayerLayoutProps = {
  children: ReactNode;
};

const menuItems = [
  {
    label: "Visão geral",
    href: "/dashboard",
    product: null,
  },
  {
    label: "Início",
    href: "/player/home",
    product: "GAME" as const,
  },
  {
    label: "Meu desempenho",
    href: "/player/performance",
    product: "GAME" as const,
  },
  {
    label: "Comunidade",
    href: "/player/community",
    product: "GAME" as const,
  },
  {
    label: "Ranking",
    href: "/player/ranking",
    product: "GAME" as const,
  },
  {
    label: "Minha mentoria",
    href: "/mentorship",
    product: "MENTORSHIP" as const,
  },
  {
    label: "Configurações",
    href: "/player/settings",
    product: null,
  },
  {
    label: "Suporte",
    href: "/player/support",
    product: null,
  },
];

export function PlayerLayout({ children }: PlayerLayoutProps) {
  const user = getAuthUser();
  const pathname = usePathname();
  const [menuOpenAtPath, setMenuOpenAtPath] = useState<string | null>(null);
  const isMenuOpen = menuOpenAtPath === pathname;
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [isTourOpen, setIsTourOpen] = useState(
    () =>
      pathname === "/player/home" &&
      user?.first_access_completed === false &&
      !user.must_change_password
  );

  useEffect(() => {
    const openTour = () => setIsTourOpen(true);

    window.addEventListener("player:onboarding:start", openTour);

    return () => {
      window.removeEventListener("player:onboarding:start", openTour);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpenAtPath(null);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMenu() {
    setMenuOpenAtPath(null);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Image
            className={styles.brandLogo}
            src="/cartada-viva-mark.png"
            alt=""
            width={58}
            height={58}
            priority
          />
          <div className={styles.brandText}><strong>Cartada Viva</strong><span>Área do jogador</span></div>
        </div>

        <button
          ref={menuButtonRef}
          className={styles.menuButton}
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="player-navigation"
          onClick={() => setMenuOpenAtPath(isMenuOpen ? null : pathname)}
        >
          {isMenuOpen ? "Fechar menu" : "Menu"}
        </button>

        <nav
          className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}
          id="player-navigation"
          data-tour="player-navigation"
        >
          {menuItems.filter((item) => !item.product || hasProduct(user, item.product)).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? styles.activeLink : ""}
              aria-current={isActive(item.href) ? "page" : undefined}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <LogoutButton className={styles.logoutButton} />
      </header>

      <main className={styles.main}>
        <section className={styles.welcome}>
          <span>Olá,</span>
          <strong>
            {user?.full_name || user?.first_name || user?.username}
          </strong>
        </section>

        {children}
      </main>

      <PlayerOnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
    </div>
  );
}
