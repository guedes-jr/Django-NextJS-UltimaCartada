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
    label: "Cartada Viva — Game",
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
    label: "A Última Cartada — Mentoria",
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
  const isGameArea = pathname.startsWith("/player/") && !["/player/support", "/player/settings"].includes(pathname);
  const isMentorshipArea = pathname === "/mentorship";
  const brandName = isGameArea ? "Cartada Viva" : isMentorshipArea ? "A Última Cartada" : "Magaly Abreu";
  const brandDescription = isGameArea ? "Game · Área da participante" : isMentorshipArea ? "Mentoria · Área da participante" : "Área de participantes";
  const [menuOpenAtPath, setMenuOpenAtPath] = useState<string | null>(null);
  const isMenuOpen = menuOpenAtPath === pathname;
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
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
      if (event.key === "Escape" && (menuButtonRef.current?.contains(event.target as Node) || navRef.current?.contains(event.target as Node))) {
        event.preventDefault();
        setMenuOpenAtPath(null);
        menuButtonRef.current?.focus();
      }
    };
    const onOutside = (event: FocusEvent | PointerEvent) => {
      if (!menuButtonRef.current?.contains(event.target as Node) && !navRef.current?.contains(event.target as Node)) setMenuOpenAtPath(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onOutside);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onOutside);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [isMenuOpen]);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMenu() {
    if (isMenuOpen) menuButtonRef.current?.focus({ preventScroll: true });
    setMenuOpenAtPath(null);
  }

  return (
    <div className={styles.page} data-brand-surface="participant">
      <a className={styles.skipLink} href="#participant-content">Pular para o conteúdo</a>
      <header className={styles.header} data-brand-part="header">
        <div className={styles.brand} data-brand-part="brand">
          {isGameArea && <Image
            className={styles.brandLogo}
            src="/cartada-viva-mark-brand.png"
            alt=""
            width={58}
            height={58}
            priority
          />}
          <div className={styles.brandText}><strong>{brandName}</strong><span>{brandDescription}</span></div>
        </div>

        <button
          ref={menuButtonRef}
          className={styles.menuButton}
          data-brand-part="menu-button"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="player-navigation"
          onClick={() => setMenuOpenAtPath(isMenuOpen ? null : pathname)}
        >
          {isMenuOpen ? "Fechar menu" : "Menu"}
        </button>

        <nav
          ref={navRef}
          aria-label="Navegação da participante"
          className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}
          id="player-navigation"
          data-brand-part="navigation"
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

      <main id="participant-content" tabIndex={-1} className={styles.main}>
        <section className={styles.welcome} data-brand-part="welcome">
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
