"use client";

import { FormEvent, useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Modal } from "@/components/ui/Modal";
import {
  createPlayer,
  getPlayers,
  resetPlayerPassword,
  togglePlayerActive,
} from "@/services/playerService";
import { CreatePlayerPayload, PlayerProfile } from "@/types/players";

import styles from "./AdminPlayersPage.module.css";

const INITIAL_FORM: CreatePlayerPayload = {
  username: "",
  password: "",
  email: "",
  first_name: "",
  last_name: "",
  phone: "",
  nickname: "",
  notes: "",
};

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [form, setForm] = useState<CreatePlayerPayload>(INITIAL_FORM);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [resetPasswordMessage, setResetPasswordMessage] = useState("");
  const [resetPasswordError, setResetPasswordError] = useState("");

  async function loadPlayers() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getPlayers();
      setPlayers(data);
    } catch {
      setErrorMessage("Não foi possível carregar os jogadores.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPlayers();
  }, []);

  function formatPhone(value: string): string {
    const onlyNumbers = value.replace(/\D/g, "").slice(0, 11);

    if (onlyNumbers.length <= 2) {
      return onlyNumbers;
    }

    if (onlyNumbers.length <= 6) {
      return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2)}`;
    }

    if (onlyNumbers.length <= 10) {
      return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(
        2,
        6
      )}-${onlyNumbers.slice(6)}`;
    }

    return `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(
      2,
      7
    )}-${onlyNumbers.slice(7)}`;
  }

  function getPlayerName(player: PlayerProfile) {
    return (
      player.user.full_name ||
      `${player.user.first_name || ""} ${player.user.last_name || ""}`.trim() ||
      player.nickname ||
      player.user.username
    );
  }

  function getPlayerPhone(player: PlayerProfile) {
    return player.phone || player.user.phone || "-";
  }

  function getPlayerIsActive(player: PlayerProfile) {
    return player.user.is_active;
  }

  function getPlayerMustChangePassword(player: PlayerProfile) {
    return player.user.must_change_password;
  }

  function openCreateModal() {
    setForm(INITIAL_FORM);
    setFeedbackMessage("");
    setErrorMessage("");
    setIsModalOpen(true);
  }

  function closeCreateModal() {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(false);
    setForm(INITIAL_FORM);
  }

  function updateField(field: keyof CreatePlayerPayload, value: string) {
    setForm((current) => ({
      ...current,
      [field]: field === "phone" ? formatPhone(value) : value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setFeedbackMessage("");
      setErrorMessage("");

      await createPlayer(form);
      await loadPlayers();

      setForm(INITIAL_FORM);
      setIsModalOpen(false);
      setFeedbackMessage("Jogador criado com sucesso.");
    } catch {
      setErrorMessage(
        "Não foi possível criar o jogador. Verifique se usuário ou e-mail já existem."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function openResetPasswordModal(playerId: number) {
    setSelectedPlayerId(playerId);
    setNewPassword("");
    setConfirmPassword("");
    setResetPasswordMessage("");
    setResetPasswordError("");
    setIsResetPasswordModalOpen(true);
  }

  function closeResetPasswordModal() {
    if (isResettingPassword) {
      return;
    }

    setSelectedPlayerId(null);
    setNewPassword("");
    setConfirmPassword("");
    setResetPasswordMessage("");
    setResetPasswordError("");
    setIsResetPasswordModalOpen(false);
  }

  async function handleResetPassword() {
    if (!selectedPlayerId) {
      return;
    }

    if (!newPassword || !confirmPassword) {
      setResetPasswordError("Preencha todos os campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetPasswordError("As senhas não conferem.");
      return;
    }

    if (newPassword.length < 8) {
      setResetPasswordError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    try {
      setIsResettingPassword(true);
      setResetPasswordError("");
      setResetPasswordMessage("");

      const response = await resetPlayerPassword(selectedPlayerId, {
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setResetPasswordMessage(response.detail);
      setNewPassword("");
      setConfirmPassword("");

      await loadPlayers();
    } catch {
      setResetPasswordError("Não foi possível redefinir a senha.");
    } finally {
      setIsResettingPassword(false);
    }
  }

  async function handleToggleActive(playerId: number) {
    try {
      setIsUpdatingStatus(true);
      setFeedbackMessage("");
      setErrorMessage("");

      const response = await togglePlayerActive(playerId);

      setFeedbackMessage(response.detail);

      await loadPlayers();
    } catch {
      setErrorMessage("Não foi possível alterar o status do jogador.");
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <div className={styles.header}>
          <div>
            <h1>Jogadores</h1>
            <p>
              Cadastre pacientes/jogadores e acompanhe quem está ativo no jogo.
            </p>
          </div>

          <button
            className={styles.primaryButton}
            type="button"
            onClick={openCreateModal}
          >
            Novo jogador
          </button>
        </div>

        {feedbackMessage && (
          <div className={styles.success}>{feedbackMessage}</div>
        )}

        {!isModalOpen && errorMessage && (
          <div className={styles.error}>{errorMessage}</div>
        )}

        <article className={styles.card}>
          <h2>Jogadores cadastrados</h2>

          {isLoading && (
            <div className={styles.message}>Carregando jogadores...</div>
          )}

          {!isLoading && players.length === 0 && !errorMessage && (
            <div className={styles.message}>
              Nenhum jogador cadastrado ainda.
            </div>
          )}

          {!isLoading && players.length > 0 && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Jogador</th>
                    <th>Usuário</th>
                    <th>Telefone</th>
                    <th>Status</th>
                    <th>Senha</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {players.map((player) => {
                    const isActive = getPlayerIsActive(player);
                    const mustChangePassword =
                      getPlayerMustChangePassword(player);

                    return (
                      <tr key={player.id}>
                        <td>
                          <div className={styles.playerInfo}>
                            <strong>{getPlayerName(player)}</strong>
                            <span>{player.user.email || "Sem e-mail"}</span>
                          </div>
                        </td>

                        <td>@{player.user.username}</td>

                        <td>{getPlayerPhone(player)}</td>

                        <td>
                          <span
                            className={`${styles.badge} ${
                              isActive ? styles.active : styles.inactive
                            }`}
                          >
                            {isActive ? "Ativo" : "Inativo"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`${styles.badge} ${
                              mustChangePassword
                                ? styles.pending
                                : styles.active
                            }`}
                          >
                            {mustChangePassword
                              ? "Troca pendente"
                              : "Senha definida"}
                          </span>
                        </td>

                        <td>
                          <div className={styles.actions}>
                            <button
                              className={styles.secondaryButton}
                              type="button"
                              onClick={() => openResetPasswordModal(player.id)}
                            >
                              Redefinir senha
                            </button>

                            <button
                              className={
                                isActive
                                  ? styles.dangerButton
                                  : styles.secondaryButton
                              }
                              type="button"
                              onClick={() => handleToggleActive(player.id)}
                              disabled={isUpdatingStatus}
                            >
                              {isActive ? "Desativar" : "Ativar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <Modal
          title="Novo jogador"
          isOpen={isModalOpen}
          onClose={closeCreateModal}
        >
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="first_name">Nome</label>
                <input
                  id="first_name"
                  value={form.first_name}
                  onChange={(event) =>
                    updateField("first_name", event.target.value)
                  }
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="last_name">Sobrenome</label>
                <input
                  id="last_name"
                  value={form.last_name}
                  onChange={(event) =>
                    updateField("last_name", event.target.value)
                  }
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="username">Usuário</label>
                <input
                  id="username"
                  value={form.username}
                  onChange={(event) =>
                    updateField("username", event.target.value)
                  }
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="password">Senha inicial</label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="phone">Telefone</label>
                <input
                  id="phone"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="(84) 99999-9999"
                  inputMode="numeric"
                  maxLength={15}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="nickname">Apelido</label>
                <input
                  id="nickname"
                  value={form.nickname}
                  onChange={(event) =>
                    updateField("nickname", event.target.value)
                  }
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="notes">Observações</label>
              <textarea
                id="notes"
                value={form.notes}
                onChange={(event) => updateField("notes", event.target.value)}
              />
            </div>

            {isModalOpen && errorMessage && (
              <div className={styles.error}>{errorMessage}</div>
            )}

            <button
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Cadastrar jogador"}
            </button>
          </form>
        </Modal>

        <Modal
          title="Redefinir senha do jogador"
          isOpen={isResetPasswordModalOpen}
          onClose={closeResetPasswordModal}
        >
          <div className={styles.form}>
            {resetPasswordMessage && (
              <div className={styles.success}>{resetPasswordMessage}</div>
            )}

            {resetPasswordError && (
              <div className={styles.error}>{resetPasswordError}</div>
            )}

            <div className={styles.field}>
              <label htmlFor="newPassword">Nova senha temporária</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Ex: Junior@123"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword">Confirmar senha</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirme a senha"
              />
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={closeResetPasswordModal}
                disabled={isResettingPassword}
              >
                Cancelar
              </button>

              <button
                className={styles.primaryButton}
                type="button"
                onClick={handleResetPassword}
                disabled={isResettingPassword}
              >
                {isResettingPassword ? "Redefinindo..." : "Redefinir senha"}
              </button>
            </div>
          </div>
        </Modal>
      </AdminLayout>
    </ProtectedRoute>
  );
}
