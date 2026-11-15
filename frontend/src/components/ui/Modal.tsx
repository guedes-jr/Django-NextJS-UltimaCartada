"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { lockPageScroll } from "@/lib/scrollLock";
import styles from "./Modal.module.css";

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeDisabled?: boolean;
  closeOnBackdrop?: boolean;
  className?: string;
};

export function Modal({ title, isOpen, onClose, children, closeDisabled = false, closeOnBackdrop = false, className = "" }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const previousFocus = document.activeElement;
    if (!dialog.open) dialog.showModal();
    const unlockScroll = lockPageScroll(document.body);
    return () => {
      if (dialog.open) dialog.close();
      unlockScroll();
      if (document.activeElement === document.body && previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.modal} ${className}`}
      aria-labelledby={titleId}
      aria-modal="true"
      data-ui-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        if (!closeDisabled) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") event.stopPropagation();
      }}
      onPointerDown={(event) => {
        if (!closeOnBackdrop || closeDisabled || event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}
    >
      <header className={styles.header}>
        <h2 id={titleId}>{title}</h2>
        <button className={styles.closeButton} type="button" disabled={closeDisabled} onClick={onClose} aria-label="Fechar modal">×</button>
      </header>
      <div className={styles.body}>{children}</div>
    </dialog>
  );
}
