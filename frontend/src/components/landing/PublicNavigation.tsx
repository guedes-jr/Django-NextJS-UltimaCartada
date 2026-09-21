"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import styles from "./PublicNavigation.module.css";

type Props = {
  id: string;
  label: string;
  className?: string;
  children: ReactNode;
};

export default function PublicNavigation({ id, label, className, children }: Props) {
  const [openAtPath, setOpenAtPath] = useState<string | null>(null);
  const pathname = usePathname();
  const open = openAtPath === pathname;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenAtPath(null);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!buttonRef.current?.contains(target) && !navRef.current?.contains(target)) {
        setOpenAtPath(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        className={styles.menuButton}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpenAtPath(open ? null : pathname)}
      >
        {open ? "Fechar" : "Menu"}
      </button>
      <nav
        ref={navRef}
        id={id}
        aria-label={label}
        className={`${className ?? ""} ${styles.navigation} ${open ? styles.open : ""}`}
        onClickCapture={(event) => {
          if ((event.target as Element).closest("a")) setOpenAtPath(null);
        }}
      >
        {children}
      </nav>
    </>
  );
}
