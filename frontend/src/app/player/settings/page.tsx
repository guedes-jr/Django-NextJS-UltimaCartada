"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";

import styles from "./PlayerSettingsPage.module.css";

export default function PlayerSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={["PLAYER"]}>
      <PlayerLayout>
        <div className={styles.header}>
          <h1>Configurações</h1>
          <p>Altere sua senha de acesso à área do jogador.</p>
        </div>

        <section className={styles.card}>
          <h2>Alterar senha</h2>
          <ChangePasswordForm redirectAfterSuccess="/player/home" />
        </section>
      </PlayerLayout>
    </ProtectedRoute>
  );
}
