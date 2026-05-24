"use client";

import { FormEvent, useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Modal } from "@/components/ui/Modal";
import {
  createGame,
  generateGameRounds,
  getGames,
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
  duration_days: 10,
  status: "DRAFT",
  evidence_bonus_points: 3,
  lowest_card_points: 1,
  middle_card_points: 2,
  highest_card_points: 3,
  max_round_starts_per_player_per_day: 2,
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
  const [generatingGameId, setGeneratingGameId] = useState<number | null>(null);
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
    loadData();
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.group) {
      setErrorMessage("Selecione um grupo para criar o jogo.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedbackMessage("");
      setErrorMessage("");

      await createGame({
        ...form,
        group: Number(form.group),
      });

      await loadData();

      setForm(INITIAL_FORM);
      setIsModalOpen(false);
      setFeedbackMessage("Jogo criado com sucesso.");
    } catch {
      setErrorMessage(
        "Não foi possível criar o jogo. Verifique os dados informados."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGenerateRounds(gameId: number) {
    try {
      setGeneratingGameId(gameId);
      setFeedbackMessage("");
      setErrorMessage("");

      const response = await generateGameRounds(gameId);

      setFeedbackMessage(
        response.created_rounds > 0
          ? `${response.created_rounds} rodadas geradas com sucesso.`
          : "As rodadas deste jogo já haviam sido geradas."
      );
    } catch {
      setErrorMessage("Não foi possível gerar as rodadas deste jogo.");
    } finally {
      setGeneratingGameId(null);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <div className={styles.header}>
          <div>
            <h1>Jogos</h1>
            <p>Crie e acompanhe os jogos vinculados aos grupos.</p>
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

        <article className={styles.card}>
          <h2>Jogos cadastrados</h2>

          {isLoading && (
            <div className={styles.message}>Carregando jogos...</div>
          )}

          {!isLoading && errorMessage && !isModalOpen && (
            <div className={styles.error}>{errorMessage}</div>
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
                    <th>Duração</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {games.map((game) => (
                    <tr key={game.id}>
                      <td>
                        <div className={styles.gameName}>
                          <strong>{game.name}</strong>
                          <span>{game.description || "Sem descrição"}</span>
                        </div>
                      </td>

                      <td>{game.group_name}</td>

                      <td>
                        {game.start_date} até {game.end_date}
                      </td>

                      <td>{game.duration_days} dias</td>

                      <td>
                        <span className={styles.badge}>{game.status}</span>
                      </td>
                      <td>
                        <button
                          className={styles.actionButton}
                          type="button"
                          disabled={generatingGameId === game.id}
                          onClick={() => handleGenerateRounds(game.id)}
                        >
                          {generatingGameId === game.id ? "Gerando..." : "Gerar rodadas"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <Modal title="Novo jogo" isOpen={isModalOpen} onClose={closeCreateModal}>
          <form className={styles.form} onSubmit={handleSubmit}>
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
                onChange={(event) => updateField("group", event.target.value)}
                required
              >
                <option value="">Selecione um grupo</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} ({group.total_players} jogadores)
                  </option>
                ))}
              </select>
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
                <label htmlFor="start_date">Data inicial</label>
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
                <label htmlFor="end_date">Data final</label>
                <input
                  id="end_date"
                  type="date"
                  value={form.end_date}
                  onChange={(event) =>
                    updateField("end_date", event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="duration_days">Duração em dias</label>
                <input
                  id="duration_days"
                  type="number"
                  min={1}
                  value={form.duration_days}
                  onChange={(event) =>
                    updateField("duration_days", Number(event.target.value))
                  }
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(event) => updateField("status", event.target.value)}
                >
                  <option value="DRAFT">Rascunho</option>
                  <option value="ACTIVE">Ativo</option>
                  <option value="FINISHED">Finalizado</option>
                  <option value="CANCELED">Cancelado</option>
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="lowest_card_points">Pontos menor carta</label>
                <input
                  id="lowest_card_points"
                  type="number"
                  min={0}
                  value={form.lowest_card_points}
                  onChange={(event) =>
                    updateField("lowest_card_points", Number(event.target.value))
                  }
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="middle_card_points">Pontos intermediária</label>
                <input
                  id="middle_card_points"
                  type="number"
                  min={0}
                  value={form.middle_card_points}
                  onChange={(event) =>
                    updateField(
                      "middle_card_points",
                      Number(event.target.value)
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="highest_card_points">Pontos maior carta</label>
                <input
                  id="highest_card_points"
                  type="number"
                  min={0}
                  value={form.highest_card_points}
                  onChange={(event) =>
                    updateField(
                      "highest_card_points",
                      Number(event.target.value)
                    )
                  }
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="evidence_bonus_points">Bônus evidência</label>
                <input
                  id="evidence_bonus_points"
                  type="number"
                  min={0}
                  value={form.evidence_bonus_points}
                  onChange={(event) =>
                    updateField(
                      "evidence_bonus_points",
                      Number(event.target.value)
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="max_round_starts_per_player_per_day">
                Limite de rodadas iniciadas por jogador/dia
              </label>
              <input
                id="max_round_starts_per_player_per_day"
                type="number"
                min={1}
                value={form.max_round_starts_per_player_per_day}
                onChange={(event) =>
                  updateField(
                    "max_round_starts_per_player_per_day",
                    Number(event.target.value)
                  )
                }
                required
              />
            </div>

            <div className={styles.checkRow}>
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={form.allow_late_play}
                  onChange={(event) =>
                    updateField("allow_late_play", event.target.checked)
                  }
                />
                Permitir jogadas fora do horário
              </label>

              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={form.show_ranking_to_players}
                  onChange={(event) =>
                    updateField("show_ranking_to_players", event.target.checked)
                  }
                />
                Mostrar ranking para jogadores
              </label>
            </div>

            {errorMessage && <div className={styles.error}>{errorMessage}</div>}

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
