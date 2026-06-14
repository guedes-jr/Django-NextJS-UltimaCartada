"use client";

import { useEffect, useMemo, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Modal } from "@/components/ui/Modal";
import { getEvidences } from "@/services/evidenceService";
import { getGames } from "@/services/gameService";
import { getPlays } from "@/services/playService";
import { Evidence } from "@/types/evidences";
import { Game } from "@/types/games";
import { Play } from "@/types/plays";

import styles from "./AdminPlaysPage.module.css";

export default function AdminPlaysPage() {
  const [plays, setPlays] = useState<Play[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlay, setSelectedPlay] = useState<Play | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [playsData, gamesData, evidencesData] = await Promise.all([
        getPlays(),
        getGames(),
        getEvidences(),
      ]);

      setPlays(playsData);
      setGames(gamesData);
      setEvidences(evidencesData);
    } catch {
      setErrorMessage("Não foi possível carregar as jogadas.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, []);

  const filteredPlays = useMemo(() => {
    return plays.filter((play) => {
      const matchesGame =
        selectedGameId === "ALL" || play.game === selectedGameId;

      const matchesStatus =
        statusFilter === "ALL" || play.status === statusFilter;

      const normalizedSearch = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !normalizedSearch ||
        play.player_username.toLowerCase().includes(normalizedSearch) ||
        play.card_title.toLowerCase().includes(normalizedSearch);

      return matchesGame && matchesStatus && matchesSearch;
    });
  }, [plays, selectedGameId, statusFilter, searchTerm]);

  function getGameName(gameId: number) {
    return games.find((game) => game.id === gameId)?.name ?? `Jogo ${gameId}`;
  }

  function getEvidenceByPlay(playId: number) {
    return evidences.find((evidence) => evidence.play === playId);
  }

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      PENDING: "Pendente",
      VALID: "Válida",
      INVALID: "Inválida",
      CANCELED: "Cancelada",
    };

    return labels[status] ?? status;
  }

  function getStatusClass(status: string) {
    const classes: Record<string, string> = {
      PENDING: styles.pending,
      VALID: styles.valid,
      INVALID: styles.invalid,
      CANCELED: styles.invalid,
    };

    return classes[status] ?? "";
  }

  function formatDateTime(value: string) {
    return new Date(value).toLocaleString("pt-BR");
  }

  function openDetailsModal(play: Play) {
    setSelectedPlay(play);
    setIsDetailsModalOpen(true);
  }

  function closeDetailsModal() {
    setSelectedPlay(null);
    setIsDetailsModalOpen(false);
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "GAME_MEDIATOR"]}>
      <AdminLayout>
        <div className={styles.header}>
          <h1>Jogadas</h1>
          <p>
            Consulte as jogadas realizadas, pontuações, cartas e evidências
            vinculadas.
          </p>
        </div>

        {errorMessage && <div className={styles.error}>{errorMessage}</div>}

        <section className={styles.filters}>
          <div className={styles.field}>
            <label htmlFor="game">Jogo</label>
            <select
              id="game"
              value={selectedGameId}
              onChange={(event) => {
                const value = event.target.value;
                setSelectedGameId(value === "ALL" ? "ALL" : Number(value));
              }}
            >
              <option value="ALL">Todos os jogos</option>

              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name} - {game.group_name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">Todos</option>
              <option value="PENDING">Pendente</option>
              <option value="VALID">Válida</option>
              <option value="INVALID">Inválida</option>
              <option value="CANCELED">Cancelada</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="search">Buscar</label>
            <input
              id="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Jogador ou carta..."
            />
          </div>
        </section>

        <article className={styles.card}>
          <h2>Jogadas registradas</h2>

          {isLoading && (
            <div className={styles.message}>Carregando jogadas...</div>
          )}

          {!isLoading && filteredPlays.length === 0 && !errorMessage && (
            <div className={styles.message}>
              Nenhuma jogada encontrada para os filtros selecionados.
            </div>
          )}

          {!isLoading && filteredPlays.length > 0 && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Jogador</th>
                    <th>Jogo</th>
                    <th>Carta</th>
                    <th>Rodada</th>
                    <th>Pontos</th>
                    <th>Status</th>
                    <th>Evidência</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPlays.map((play) => {
                    const evidence = getEvidenceByPlay(play.id);

                    return (
                      <tr key={play.id}>
                        <td>
                          <div className={styles.mainInfo}>
                            <strong>@{play.player_username}</strong>
                            <span>{formatDateTime(play.played_at)}</span>
                          </div>
                        </td>

                        <td>{getGameName(play.game)}</td>

                        <td>
                          <div className={styles.mainInfo}>
                            <strong>{play.card_title}</strong>
                            <span>
                              {play.card_suit_symbol} {play.card_value} •{" "}
                              {play.card_suit}
                            </span>
                          </div>
                        </td>

                        <td>Dia {play.round_day}</td>

                        <td>
                          <div className={styles.mainInfo}>
                            <strong>{play.total_points}</strong>
                            <span>
                              Base {play.base_points} • Bônus{" "}
                              {play.bonus_points}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`${styles.badge} ${getStatusClass(
                              play.status
                            )}`}
                          >
                            {getStatusLabel(play.status)}
                          </span>
                        </td>

                        <td>
                          {evidence ? (
                            <span className={styles.badge}>
                              {evidence.status}
                            </span>
                          ) : (
                            <span className={styles.badge}>
                              Não enviada
                            </span>
                          )}
                        </td>

                        <td>
                          <button
                            className={styles.actionButton}
                            type="button"
                            onClick={() => openDetailsModal(play)}
                          >
                            Ver detalhes
                          </button>
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
          title="Detalhes da jogada"
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
        >
          {selectedPlay && (
            <div className={styles.detailsContent}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailsItem}>
                  <span>Jogador</span>
                  <strong>@{selectedPlay.player_username}</strong>
                </div>

                <div className={styles.detailsItem}>
                  <span>Jogo</span>
                  <strong>{getGameName(selectedPlay.game)}</strong>
                </div>

                <div className={styles.detailsItem}>
                  <span>Carta</span>
                  <strong>
                    {selectedPlay.card_suit_symbol} {selectedPlay.card_value} —{" "}
                    {selectedPlay.card_title}
                  </strong>
                </div>

                <div className={styles.detailsItem}>
                  <span>Rodada</span>
                  <strong>Dia {selectedPlay.round_day}</strong>
                </div>

                <div className={styles.detailsItem}>
                  <span>Foi no horário?</span>
                  <strong>
                    {selectedPlay.is_within_time ? "Sim" : "Não"}
                  </strong>
                </div>

                <div className={styles.detailsItem}>
                  <span>Iniciou rodada?</span>
                  <strong>
                    {selectedPlay.is_round_starter ? "Sim" : "Não"}
                  </strong>
                </div>

                <div className={styles.detailsItem}>
                  <span>Pontos base</span>
                  <strong>{selectedPlay.base_points}</strong>
                </div>

                <div className={styles.detailsItem}>
                  <span>Bônus</span>
                  <strong>{selectedPlay.bonus_points}</strong>
                </div>

                <div className={styles.detailsItem}>
                  <span>Total</span>
                  <strong>{selectedPlay.total_points}</strong>
                </div>

                <div className={styles.detailsItem}>
                  <span>Status</span>
                  <strong>{getStatusLabel(selectedPlay.status)}</strong>
                </div>

                <div className={styles.detailsItem}>
                  <span>Data da jogada</span>
                  <strong>{formatDateTime(selectedPlay.played_at)}</strong>
                </div>

                <div className={styles.detailsItem}>
                  <span>Evidência</span>
                  <strong>
                    {getEvidenceByPlay(selectedPlay.id)?.status ??
                      "Não enviada"}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </AdminLayout>
    </ProtectedRoute>
  );
}
