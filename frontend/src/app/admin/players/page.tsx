"use client";

import { FormEvent, useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Modal } from "@/components/ui/Modal";
import { createPlayer, getPlayers } from "@/services/playerService";
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
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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

                <article className={styles.card}>
                    <h2>Jogadores cadastrados</h2>

                    {isLoading && (
                        <div className={styles.message}>Carregando jogadores...</div>
                    )}

                    {!isLoading && errorMessage && !isModalOpen && (
                        <div className={styles.error}>{errorMessage}</div>
                    )}

                    {!isLoading && players.length === 0 && !errorMessage && (
                        <div className={styles.message}>Nenhum jogador cadastrado ainda.</div>
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
                                    </tr>
                                </thead>

                                <tbody>
                                    {players.map((player) => (
                                        <tr key={player.id}>
                                            <td>
                                                <div className={styles.playerName}>
                                                    <strong>
                                                        {player.user.full_name ||
                                                            player.nickname ||
                                                            player.user.username}
                                                    </strong>
                                                    <span>{player.user.email || "Sem e-mail"}</span>
                                                </div>
                                            </td>

                                            <td>@{player.user.username}</td>

                                            <td>{player.user.phone || "-"}</td>

                                            <td>
                                                <span
                                                    className={`${styles.badge} ${!player.is_active ? styles.badgeInactive : ""
                                                        }`}
                                                >
                                                    {player.is_active ? "Ativo" : "Inativo"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
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
                                    minLength={6}
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

                        {errorMessage && <div className={styles.error}>{errorMessage}</div>}

                        <button
                            className={styles.button}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Salvando..." : "Cadastrar jogador"}
                        </button>
                    </form>
                </Modal>
            </AdminLayout>
        </ProtectedRoute>
    );
}