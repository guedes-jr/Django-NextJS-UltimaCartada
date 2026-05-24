"use client";

import { FormEvent, useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Modal } from "@/components/ui/Modal";
import { createGroup, getGroups } from "@/services/groupService";
import { getPlayers } from "@/services/playerService";
import { CreateGroupPayload, PlayerGroup } from "@/types/groups";
import { PlayerProfile } from "@/types/players";

import styles from "./AdminGroupsPage.module.css";

const INITIAL_FORM: CreateGroupPayload = {
  name: "",
  description: "",
  player_ids: [],
  max_players: 10,
  is_active: true,
};

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<PlayerGroup[]>([]);
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [form, setForm] = useState<CreateGroupPayload>(INITIAL_FORM);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [groupsData, playersData] = await Promise.all([
        getGroups(),
        getPlayers(),
      ]);

      setGroups(groupsData);
      setPlayers(playersData);
    } catch {
      setErrorMessage("Não foi possível carregar os grupos.");
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

  function updateField(field: keyof CreateGroupPayload, value: string | number) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function togglePlayer(playerId: number) {
    setForm((current) => {
      const alreadySelected = current.player_ids.includes(playerId);

      return {
        ...current,
        player_ids: alreadySelected
          ? current.player_ids.filter((id) => id !== playerId)
          : [...current.player_ids, playerId],
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setFeedbackMessage("");
      setErrorMessage("");

      await createGroup(form);
      await loadData();

      setForm(INITIAL_FORM);
      setIsModalOpen(false);
      setFeedbackMessage("Grupo criado com sucesso.");
    } catch {
      setErrorMessage(
        "Não foi possível criar o grupo. Verifique os dados informados."
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
            <h1>Grupos</h1>
            <p>Organize os jogadores em grupos para iniciar os jogos.</p>
          </div>

          <button
            className={styles.primaryButton}
            type="button"
            onClick={openCreateModal}
          >
            Novo grupo
          </button>
        </div>

        {feedbackMessage && (
          <div className={styles.success}>{feedbackMessage}</div>
        )}

        <article className={styles.card}>
          <h2>Grupos cadastrados</h2>

          {isLoading && (
            <div className={styles.message}>Carregando grupos...</div>
          )}

          {!isLoading && errorMessage && !isModalOpen && (
            <div className={styles.error}>{errorMessage}</div>
          )}

          {!isLoading && groups.length === 0 && !errorMessage && (
            <div className={styles.message}>Nenhum grupo cadastrado ainda.</div>
          )}

          {!isLoading && groups.length > 0 && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Grupo</th>
                    <th>Jogadores</th>
                    <th>Limite</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {groups.map((group) => (
                    <tr key={group.id}>
                      <td>
                        <div className={styles.groupName}>
                          <strong>{group.name}</strong>
                          <span>{group.description || "Sem descrição"}</span>
                        </div>
                      </td>

                      <td>{group.total_players}</td>

                      <td>{group.max_players}</td>

                      <td>
                        <span
                          className={`${styles.badge} ${
                            !group.is_active ? styles.badgeInactive : ""
                          }`}
                        >
                          {group.is_active ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <Modal title="Novo grupo" isOpen={isModalOpen} onClose={closeCreateModal}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="name">Nome do grupo</label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="max_players">Limite de jogadores</label>
                <input
                  id="max_players"
                  type="number"
                  min={1}
                  value={form.max_players}
                  onChange={(event) =>
                    updateField("max_players", Number(event.target.value))
                  }
                  required
                />
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

            <div className={styles.field}>
              <label>Jogadores do grupo</label>

              {players.length === 0 ? (
                <div className={styles.message}>
                  Nenhum jogador cadastrado ainda.
                </div>
              ) : (
                <div className={styles.playersBox}>
                  {players.map((player) => (
                    <label className={styles.checkboxItem} key={player.id}>
                      <input
                        type="checkbox"
                        checked={form.player_ids.includes(player.id)}
                        onChange={() => togglePlayer(player.id)}
                      />
                      {player.user.full_name ||
                        player.nickname ||
                        player.user.username}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {errorMessage && <div className={styles.error}>{errorMessage}</div>}

            <button
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Cadastrar grupo"}
            </button>
          </form>
        </Modal>
      </AdminLayout>
    </ProtectedRoute>
  );
}
