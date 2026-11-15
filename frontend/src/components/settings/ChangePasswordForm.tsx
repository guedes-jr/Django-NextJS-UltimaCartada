"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser, changePassword } from "@/services/accountService";
import { saveAuthUser } from "@/lib/auth";
import styles from "./ChangePasswordForm.module.css";

type ChangePasswordFormProps = {
  redirectAfterSuccess?: string;
};

export function ChangePasswordForm({
  redirectAfterSuccess,
}: ChangePasswordFormProps) {
  const router = useRouter();
  const formId = useId();
  const submittingRef = useRef(false);
  const currentRef = useRef<HTMLInputElement>(null);
  const newRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const [invalidField, setInvalidField] = useState<"current" | "new" | "confirm" | null>(null);

  function showFieldError(message: string, field: "current" | "new" | "confirm") {
    setErrorMessage(message);
    setInvalidField(field);
    const target = field === "current" ? currentRef : field === "new" ? newRef : confirmRef;
    requestAnimationFrame(() => target.current?.focus());
  }

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionPending, setSessionPending] = useState(false);
  const [sessionError, setSessionError] = useState("");

  async function refreshSession() {
    try {
      const currentUser = await getCurrentUser();
      saveAuthUser(currentUser);
      setSessionPending(false);
      setSessionError("");
      if (redirectAfterSuccess) router.replace(redirectAfterSuccess);
    } catch {
      setSessionError("Sua senha foi alterada, mas não foi possível atualizar os dados da sessão. Tente atualizar a sessão novamente; não é necessário alterar a senha outra vez.");
    }
  }

  async function retrySession() {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      await refreshSession();
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current || sessionPending) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showFieldError("Preencha todos os campos.", !currentPassword ? "current" : !newPassword ? "new" : "confirm");
      return;
    }

    if (newPassword !== confirmPassword) {
      showFieldError("A nova senha e a confirmação não conferem.", "confirm");
      return;
    }

    if (newPassword.length < 8) {
      showFieldError("A nova senha deve ter pelo menos 8 caracteres.", "new");
      return;
    }

    submittingRef.current = true;
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setInvalidField(null);
      setSuccessMessage("");

      const response = await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage(response.detail);
      setSessionPending(true);
      await refreshSession();
    } catch {
      setErrorMessage("Não foi possível alterar a senha. Confira a senha atual.");
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-busy={isSubmitting}>
      {successMessage && <div role="status" className={styles.success}>{successMessage}</div>}
      {errorMessage && <div id={`${formId}-error`} role="alert" className={styles.error}>{errorMessage}</div>}
      {sessionPending && sessionError && <div role="alert" className={styles.error}>
        <p>{sessionError}</p>
        <button className={styles.button} type="button" aria-disabled={isSubmitting} onClick={() => void retrySession()}>
          {isSubmitting ? "Atualizando sessão..." : "Atualizar sessão"}
        </button>
      </div>}

      <div className={styles.field}>
        <label htmlFor={`${formId}-currentPassword`}>Senha atual</label>
        <input
          id={`${formId}-currentPassword`}
          name="currentPassword"
          ref={currentRef}
          aria-invalid={invalidField === "current" || undefined}
          aria-describedby={invalidField === "current" ? `${formId}-error` : undefined}
          autoComplete="current-password"
          required
          disabled={isSubmitting || sessionPending}
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          placeholder="Digite sua senha atual"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${formId}-newPassword`}>Nova senha</label>
        <input
          id={`${formId}-newPassword`}
          name="newPassword"
          ref={newRef}
          aria-invalid={invalidField === "new" || undefined}
          aria-describedby={`${formId}-new-help${invalidField === "new" ? ` ${formId}-error` : ""}`}
          autoComplete="new-password"
          minLength={8}
          required
          disabled={isSubmitting || sessionPending}
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="Digite a nova senha"
        />
        <small id={`${formId}-new-help`}>Use pelo menos 8 caracteres. A senha também será validada pelo servidor.</small>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${formId}-confirmPassword`}>Confirmar nova senha</label>
        <input
          id={`${formId}-confirmPassword`}
          name="confirmPassword"
          ref={confirmRef}
          aria-invalid={invalidField === "confirm" || undefined}
          aria-describedby={invalidField === "confirm" ? `${formId}-error` : undefined}
          autoComplete="new-password"
          required
          disabled={isSubmitting || sessionPending}
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirme a nova senha"
        />
      </div>

      <button className={styles.button} type="submit" disabled={isSubmitting || sessionPending}>
        {isSubmitting ? "Alterando..." : "Alterar senha"}
      </button>
    </form>
  );
}
