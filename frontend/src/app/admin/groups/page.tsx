"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Modal } from "@/components/ui/Modal";
import { getGameMediators } from "@/services/accountService";
import {
  addPlayerToGroup,
  createGroup,
  getGroups,
  removePlayerFromGroup,
  setGroupMediators,
} from "@/services/groupService";
import { getPlayers } from "@/services/playerService";
import { UserSummary } from "@/types/accounts";
import { CreateGroupPayload, PlayerGroup } from "@/types/groups";
import { PlayerProfile } from "@/types/players";

import styles from "./AdminGroupsPage.module.css";

const INITIAL_FORM: CreateGroupPayload = {
  name: "",
  description: "",
  player_ids: [],
  mediator_ids: [],
  max_players: 10,
  is_active: true,
};

type PlayerGroupWithPlayers = PlayerGroup & {
  players?: number[];
  player_ids?: number[];
  players_names?: string[];
  players_count?: number;
  mediators?: UserSummary[];
};

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<PlayerGroup[]>([]);
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [mediators, setMediators] = useState<UserSummary[]>([]);
  const [form, setForm] = useState<CreateGroupPayload>(INITIAL_FORM);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlayersModalOpen, setIsPlayersModalOpen] = useState(false);
  const [isMediatorsModalOpen, setIsMediatorsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingGroupPlayers, setIsUpdatingGroupPlayers] = useState(false);
  const [isUpdatingGroupMediators, setIsUpdatingGroupMediators] = useState(false);

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | "">("");
  const [selectedMediatorIds, setSelectedMediatorIds] = useState<number[]>([]);

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [groupsData, playersData, mediatorsData] = await Promise.all([
        getGroups(),
        getPlayers(),
        getGameMediators(),
      ]);

      setGroups(groupsData);
      setPlayers(playersData);
      setMediators(mediatorsData);
    } catch {
      setErrorMessage("Não foi possível carregar os grupos.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, []);

  const selectedGroup = useMemo(() => {
    return groups.find((group) => group.id === selectedGroupId) ?? null;
  }, [groups, selectedGroupId]);

  const selectedGroupPlayerIds = useMemo(() => {
    if (!selectedGroup) {
      return [];
    }

    return getGroupPlayerIds(selectedGroup);
  }, [selectedGroup]);

  const availablePlayers = useMemo(() => {
    return players.filter(
      (player) => !selectedGroupPlayerIds.includes(player.id)
    );
  }, [players, selectedGroupPlayerIds]);

  function getGroupPlayerIds(group: PlayerGroup): number[] {
    const normalizedGroup = group as PlayerGroupWithPlayers;

    if (Array.isArray(normalizedGroup.players)) {
      return normalizedGroup.players;
    }

    if (Array.isArray(normalizedGroup.player_ids)) {
      return normalizedGroup.player_ids;
    }

    return [];
  }

  function getGroupTotalPlayers(group: PlayerGroup) {
    const normalizedGroup = group as PlayerGroupWithPlayers;

    return (
      normalizedGroup.players_count ??
      normalizedGroup.total_players ??
      getGroupPlayerIds(group).length
    );
  }

  function getPlayerName(player: PlayerProfile) {
    return (
      player.user.full_name ||
      `${player.user.first_name || ""} ${player.user.last_name || ""}`.trim() ||
      player.nickname ||
      player.user.username
    );
  }

  function getUserName(user: UserSummary) {
    return (
      user.full_name ||
      `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
      user.username
    );
  }

  function toggleMediator(mediatorId: number) {
    setForm((current) => {
      const alreadySelected = current.mediator_ids.includes(mediatorId);

      return {
        ...current,
        mediator_ids: alreadySelected
          ? current.mediator_ids.filter((id) => id !== mediatorId)
          : [...current.mediator_ids, mediatorId],
      };
    });
  }

  function toggleSelectedMediator(mediatorId: number) {
    setSelectedMediatorIds((current) =>
      current.includes(mediatorId)
        ? current.filter((id) => id !== mediatorId)
        : [...current, mediatorId]
    );
  }

  function getGroupPlayersNames(group: PlayerGroup) {
    const normalizedGroup = group as PlayerGroupWithPlayers;

    if (
      Array.isArray(normalizedGroup.players_names) &&
      normalizedGroup.players_names.length > 0
    ) {
      return normalizedGroup.players_names;
    }

    const groupPlayerIds = getGroupPlayerIds(group);

    return groupPlayerIds
      .map((playerId) => {
        const player = players.find((item) => item.id === playerId);

        if (!player) {
          return null;
        }

        return getPlayerName(player);
      })
      .filter((name): name is string => Boolean(name));
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
    setErrorMessage("");
  }

  function updateField(
    field: keyof CreateGroupPayload,
    value: string | number | boolean
  ) {
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

  function openPlayersModal(groupId: number) {
    setSelectedGroupId(groupId);
    setSelectedPlayerId("");
    setFeedbackMessage("");
    setErrorMessage("");
    setIsPlayersModalOpen(true);
  }

  function closePlayersModal() {
    if (isUpdatingGroupPlayers) {
      return;
    }

    setSelectedGroupId(null);
    setSelectedPlayerId("");
    setErrorMessage("");
    setIsPlayersModalOpen(false);
  }

  function openMediatorsModal(groupId: number) {
    const group = groups.find((item) => item.id === groupId);

    setSelectedGroupId(groupId);
    setSelectedMediatorIds(
      group?.mediators?.map((mediator) => mediator.id) ?? []
    );
    setFeedbackMessage("");
    setErrorMessage("");
    setIsMediatorsModalOpen(true);
  }

  function closeMediatorsModal() {
    if (isUpdatingGroupMediators) {
      return;
    }

    setSelectedGroupId(null);
    setSelectedMediatorIds([]);
    setErrorMessage("");
    setIsMediatorsModalOpen(false);
  }

  async function handleSaveMediators() {
    if (!selectedGroupId) {
      return;
    }

    try {
      setIsUpdatingGroupMediators(true);
      setFeedbackMessage("");
      setErrorMessage("");

      const response = await setGroupMediators(selectedGroupId, {
        mediator_ids: selectedMediatorIds,
      });

      setFeedbackMessage(response.detail);
      await loadData();
      setIsMediatorsModalOpen(false);
    } catch {
      setErrorMessage("Não foi possível atualizar os mediadores do grupo.");
    } finally {
      setIsUpdatingGroupMediators(false);
    }
  }

  async function handleAddPlayerToGroup() {
    if (!selectedGroupId || !selectedPlayerId) {
      setErrorMessage("Selecione um jogador.");
      return;
    }

    try {
      setIsUpdatingGroupPlayers(true);
      setFeedbackMessage("");
      setErrorMessage("");

      const response = await addPlayerToGroup(selectedGroupId, {
        player_id: Number(selectedPlayerId),
      });

      setFeedbackMessage(response.detail);
      setSelectedPlayerId("");

      await loadData();
    } catch {
      setErrorMessage("Não foi possível adicionar o jogador ao grupo.");
    } finally {
      setIsUpdatingGroupPlayers(false);
    }
  }

  async function handleRemovePlayerFromGroup(playerId: number) {
    if (!selectedGroupId) {
      return;
    }

    try {
      setIsUpdatingGroupPlayers(true);
      setFeedbackMessage("");
      setErrorMessage("");

      const response = await removePlayerFromGroup(selectedGroupId, {
        player_id: playerId,
      });

      setFeedbackMessage(response.detail);

      await loadData();
    } catch {
      setErrorMessage("Não foi possível remover o jogador do grupo.");
    } finally {
      setIsUpdatingGroupPlayers(false);
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

        {!isModalOpen &&
          !isPlayersModalOpen &&
          !isMediatorsModalOpen &&
          errorMessage && (
          <div className={styles.error}>{errorMessage}</div>
        )}

        <article className={styles.card}>
          <h2>Grupos cadastrados</h2>

          {isLoading && (
            <div className={styles.message}>Carregando grupos...</div>
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
                    <th>Participantes</th>
                    <th>Mediadores</th>
                    <th>Limite</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {groups.map((group) => {
                    const groupPlayersNames = getGroupPlayersNames(group);
                    const totalPlayers = getGroupTotalPlayers(group);

                    return (
                      <tr key={group.id}>
                        <td>
                          <div className={styles.groupName}>
                            <strong>{group.name}</strong>
                            <span>{group.description || "Sem descrição"}</span>
                          </div>
                        </td>

                        <td>
                          <span className={styles.badge}>
                            {totalPlayers} jogador{totalPlayers === 1 ? "" : "es"}
                          </span>
                        </td>

                        <td>
                          <div className={styles.groupPlayers}>
                            {groupPlayersNames.length > 0 ? (
                              groupPlayersNames.map((name) => (
                                <span key={name}>{name}</span>
                              ))
                            ) : (
                              <span>Nenhum jogador vinculado</span>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className={styles.groupPlayers}>
                            {group.mediators?.length > 0 ? (
                              group.mediators.map((mediator) => (
                                <span key={mediator.id}>
                                  {getUserName(mediator)}
                                </span>
                              ))
                            ) : (
                              <span>Nenhum mediador</span>
                            )}
                          </div>
                        </td>

                        <td>{group.max_players}</td>

                        <td>
                          <span
                            className={`${styles.badge} ${
                              group.is_active
                                ? styles.badgeActive
                                : styles.badgeInactive
                            }`}
                          >
                            {group.is_active ? "Ativo" : "Inativo"}
                          </span>
                        </td>

                        <td>
                          <div className={styles.actions}>
                            <button
                              className={styles.secondaryButton}
                              type="button"
                              onClick={() => openPlayersModal(group.id)}
                            >
                              Gerenciar jogadores
                            </button>

                            <button
                              className={styles.secondaryButton}
                              type="button"
                              onClick={() => openMediatorsModal(group.id)}
                            >
                              Mediadores
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

                      {getPlayerName(player)}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label>Mediadores do grupo</label>

              {mediators.length === 0 ? (
                <div className={styles.message}>
                  Nenhum mediador cadastrado ainda.
                </div>
              ) : (
                <div className={styles.playersBox}>
                  {mediators.map((mediator) => (
                    <label className={styles.checkboxItem} key={mediator.id}>
                      <input
                        type="checkbox"
                        checked={form.mediator_ids.includes(mediator.id)}
                        onChange={() => toggleMediator(mediator.id)}
                      />

                      {getUserName(mediator)}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {isModalOpen && errorMessage && (
              <div className={styles.error}>{errorMessage}</div>
            )}

            <button
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Cadastrar grupo"}
            </button>
          </form>
        </Modal>

        <Modal
          title="Gerenciar jogadores do grupo"
          isOpen={isPlayersModalOpen}
          onClose={closePlayersModal}
        >
          <div className={styles.form}>
            {feedbackMessage && (
              <div className={styles.success}>{feedbackMessage}</div>
            )}

            {isPlayersModalOpen && errorMessage && (
              <div className={styles.error}>{errorMessage}</div>
            )}

            <div className={styles.field}>
              <label htmlFor="player">Adicionar jogador</label>
              <select
                id="player"
                value={selectedPlayerId}
                onChange={(event) =>
                  setSelectedPlayerId(
                    event.target.value ? Number(event.target.value) : ""
                  )
                }
              >
                <option value="">Selecione um jogador</option>

                {availablePlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {getPlayerName(player)}
                  </option>
                ))}
              </select>
            </div>

            <button
              className={styles.primaryButton}
              type="button"
              onClick={handleAddPlayerToGroup}
              disabled={isUpdatingGroupPlayers || availablePlayers.length === 0}
            >
              {isUpdatingGroupPlayers ? "Salvando..." : "Adicionar ao grupo"}
            </button>

            <div className={styles.playersList}>
              <strong>Jogadores vinculados</strong>

              {selectedGroupPlayerIds.length === 0 && (
                <span>Nenhum jogador vinculado.</span>
              )}

              {selectedGroupPlayerIds.map((playerId) => {
                const player = players.find((item) => item.id === playerId);

                if (!player) {
                  return null;
                }

                return (
                  <div className={styles.playerItem} key={player.id}>
                    <span>{getPlayerName(player)}</span>

                    <button
                      className={styles.dangerButton}
                      type="button"
                      onClick={() => handleRemovePlayerFromGroup(player.id)}
                      disabled={isUpdatingGroupPlayers}
                    >
                      Remover
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>

        <Modal
          title="Mediadores do grupo"
          isOpen={isMediatorsModalOpen}
          onClose={closeMediatorsModal}
        >
          <div className={styles.form}>
            {isMediatorsModalOpen && errorMessage && (
              <div className={styles.error}>{errorMessage}</div>
            )}

            {mediators.length === 0 ? (
              <div className={styles.message}>
                Nenhum usuário mediador cadastrado.
              </div>
            ) : (
              <div className={styles.playersBox}>
                {mediators.map((mediator) => (
                  <label className={styles.checkboxItem} key={mediator.id}>
                    <input
                      type="checkbox"
                      checked={selectedMediatorIds.includes(mediator.id)}
                      onChange={() => toggleSelectedMediator(mediator.id)}
                    />

                    {getUserName(mediator)}
                  </label>
                ))}
              </div>
            )}

            <button
              className={styles.button}
              type="button"
              onClick={handleSaveMediators}
              disabled={isUpdatingGroupMediators}
            >
              {isUpdatingGroupMediators ? "Salvando..." : "Salvar mediadores"}
            </button>
          </div>
        </Modal>
      </AdminLayout>
    </ProtectedRoute>
  );
}
