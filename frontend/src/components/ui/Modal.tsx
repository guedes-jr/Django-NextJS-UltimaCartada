"use client";

import { ReactNode } from "react";

import styles from "./Modal.module.css";

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ title, isOpen, onClose, children }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2>{title}</h2>

          <button
            className={styles.closeButton}
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </header>

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
