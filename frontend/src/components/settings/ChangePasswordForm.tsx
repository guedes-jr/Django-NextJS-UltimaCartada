"use client";

import { FormEvent, useState } from "react";

import { changePassword } from "@/services/accountService";
import { getAuthUser } from "@/lib/auth";
import styles from "./ChangePasswordForm.module.css";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("A nova senha e a confirmação não conferem.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      const user = getAuthUser();

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            must_change_password: false,
          })
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage(response.detail);
    } catch {
      setErrorMessage("Não foi possível alterar a senha. Confira a senha atual.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {successMessage && <div className={styles.success}>{successMessage}</div>}
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      <div className={styles.field}>
        <label htmlFor="currentPassword">Senha atual</label>
        <input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          placeholder="Digite sua senha atual"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="newPassword">Nova senha</label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="Digite a nova senha"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="confirmPassword">Confirmar nova senha</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirme a nova senha"
        />
      </div>

      <button className={styles.button} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Alterando..." : "Alterar senha"}
      </button>
    </form>
  );
}
