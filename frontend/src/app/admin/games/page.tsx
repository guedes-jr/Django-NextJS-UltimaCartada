"use client";

import { FormEvent, useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Modal } from "@/components/ui/Modal";
import {
  createGame,
  generateGameRounds,
  getGames,
  toggleGameActive,
} from "@/services/gameService";
import { getGroups } from "@/services/groupService";
import { CreateGamePayload, Game } from "@/types/games";
import { PlayerGroup } from "@/types/groups";

import styles from "./AdminGamesPage.module.css";

const INITIAL_FORM: CreateGamePayload = {
  name: "",
  description: "",
  group: "",
  start_date: "",
  end_date: "",
  total_rounds: 7,
  duration_days: 7,
  status: "DRAFT",
  evidence_bonus_points: 10,
  lowest_card_points: 10,
  middle_card_points: 20,
  highest_card_points: 30,
  max_round_starts_per_player_per_day: 1,
  allow_late_play: false,
  show_ranking_to_players: true,
  is_active: true,
};

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [groups, setGroups] = useState<PlayerGroup[]>([]);
  const [form, setForm] = useState<CreateGamePayload>(INITIAL_FORM);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [gamesData, groupsData] = await Promise.all([
        getGames(),
        getGroups(),
      ]);

      setGames(gamesData);
      setGroups(groupsData);
    } catch {
      setErrorMessage("Não foi possível carregar os jogos.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, []);

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
    setErrorMessage("");
  }

  function updateField(
    field: keyof CreateGamePayload,
    value: string | number | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function formatDate(value?: string) {
    if (!value) {
      return "Não definido";
    }

    return new Date(value).toLocaleDateString("pt-BR");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.group) {
      setErrorMessage("Selecione um grupo.");
      return;
    }

    if (!form.start_date) {
      setErrorMessage("Informe a data de início.");
      return;
    }

    if (Number(form.total_rounds) <= 0) {
      setErrorMessage("A quantidade de rodadas deve ser maior que zero.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedbackMessage("");
      setErrorMessage("");

      await createGame({
        ...form,
        group: Number(form.group),
        total_rounds: Number(form.total_rounds),
      });

      await loadData();

      setForm(INITIAL_FORM);
      setIsModalOpen(false);
      setFeedbackMessage("Jogo criado com sucesso.");
    } catch {
      setErrorMessage("Não foi possível criar o jogo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleGameActive(gameId: number) {
    try {
      setIsUpdating(true);
      setFeedbackMessage("");
      setErrorMessage("");

      const response = await toggleGameActive(gameId);

      setFeedbackMessage(response.detail);

      await loadData();
    } catch {
      setErrorMessage("Não foi possível alterar o status do jogo.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleGenerateRounds(gameId: number) {
    try {
      setIsUpdating(true);
      setFeedbackMessage("");
      setErrorMessage("");

      const response = await generateGameRounds(gameId);

      setFeedbackMessage(response.detail);

      await loadData();
    } catch {
      setErrorMessage(
        "Não foi possível gerar as rodadas deste jogo. Verifique se elas já foram geradas."
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "GAME_MEDIATOR"]}>
      <AdminLayout>
        <div className={styles.header}>
          <div>
            <h1>Jogos</h1>
            <p>
              Crie jogos vinculados aos grupos, acompanhe rodadas e controle o
              status de cada jogo.
            </p>
          </div>

          <button
            className={styles.primaryButton}
            type="button"
            onClick={openCreateModal}
          >
            Novo jogo
          </button>
        </div>

        {feedbackMessage && (
          <div className={styles.success}>{feedbackMessage}</div>
        )}

        {!isModalOpen && errorMessage && (
          <div className={styles.error}>{errorMessage}</div>
        )}

        <article className={styles.card}>
          <h2>Jogos cadastrados</h2>

          {isLoading && (
            <div className={styles.message}>Carregando jogos...</div>
          )}

          {!isLoading && games.length === 0 && !errorMessage && (
            <div className={styles.message}>Nenhum jogo cadastrado ainda.</div>
          )}

          {!isLoading && games.length > 0 && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Jogo</th>
                    <th>Grupo</th>
                    <th>Período</th>
                    <th>Rodadas</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {games.map((game) => {
                    const roundsCount = game.rounds_count ?? 0;
                    const totalRounds = game.total_rounds ?? 0;
                    const hasRounds = roundsCount > 0;

                    return (
                      <tr key={game.id}>
                        <td>
                          <div className={styles.gameName}>
                            <strong>{game.name}</strong>
                            <span>{game.description || "Sem descrição"}</span>
                          </div>
                        </td>

                        <td>
                          <span className={styles.badge}>
                            {game.group_name || `Grupo ${game.group}`}
                          </span>
                        </td>

                        <td>
                          <div className={styles.period}>
                            <span>Início: {formatDate(game.start_date)}</span>
                            <span>Fim: {formatDate(game.end_date)}</span>
                          </div>
                        </td>

                        <td>
                          <span className={styles.badge}>
                            {roundsCount}/{totalRounds}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`${styles.badge} ${
                              game.is_active
                                ? styles.badgeActive
                                : styles.badgeInactive
                            }`}
                          >
                            {game.is_active ? "Ativo" : "Inativo"}
                          </span>
                        </td>

                        <td>
                          <div className={styles.actions}>
                            <button
                              className={styles.secondaryButton}
                              type="button"
                              onClick={() => handleGenerateRounds(game.id)}
                              disabled={isUpdating || hasRounds}
                            >
                              Gerar rodadas
                            </button>

                            <button
                              className={
                                game.is_active
                                  ? styles.dangerButton
                                  : styles.secondaryButton
                              }
                              type="button"
                              onClick={() => handleToggleGameActive(game.id)}
                              disabled={isUpdating}
                            >
                              {game.is_active ? "Desativar" : "Ativar"}
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

        <Modal title="Novo jogo" isOpen={isModalOpen} onClose={closeCreateModal}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="name">Nome do jogo</label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="group">Grupo</label>
                <select
                  id="group"
                  value={form.group}
                  onChange={(event) =>
                    updateField(
                      "group",
                      event.target.value ? Number(event.target.value) : ""
                    )
                  }
                  required
                >
                  <option value="">Selecione um grupo</option>

                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="start_date">Data de início</label>
                <input
                  id="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={(event) =>
                    updateField("start_date", event.target.value)
                  }
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="end_date">Data de fim</label>
                <input
                  id="end_date"
                  type="date"
                  value={form.end_date}
                  onChange={(event) =>
                    updateField("end_date", event.target.value)
                  }
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="total_rounds">Quantidade de rodadas</label>
                <input
                  id="total_rounds"
                  type="number"
                  min={1}
                  value={form.total_rounds}
                  onChange={(event) =>
                    updateField("total_rounds", Number(event.target.value))
                  }
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="is_active">Status inicial</label>
                <select
                  id="is_active"
                  value={form.is_active ? "true" : "false"}
                  onChange={(event) =>
                    updateField("is_active", event.target.value === "true")
                  }
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
            </div>

            {isModalOpen && errorMessage && (
              <div className={styles.error}>{errorMessage}</div>
            )}

            <button
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Cadastrar jogo"}
            </button>
          </form>
        </Modal>
      </AdminLayout>
    </ProtectedRoute>
  );
}
