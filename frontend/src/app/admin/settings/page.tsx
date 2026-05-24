"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";

import styles from "./AdminSettingsPage.module.css";

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <div className={styles.header}>
          <h1>Configurações</h1>
          <p>Altere sua senha de acesso ao painel administrativo.</p>
        </div>

        <section className={styles.card}>
          <h2>Alterar senha</h2>
          <ChangePasswordForm />
        </section>
      </AdminLayout>
    </ProtectedRoute>
  );
}
