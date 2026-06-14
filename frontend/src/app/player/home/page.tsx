"use client";

import { AxiosError } from "axios";
import { useEffect, useMemo, useRef, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { Modal } from "@/components/ui/Modal";
import { getCards } from "@/services/cardService";
import { getGames } from "@/services/gameService";
import { createPlay, getPlays } from "@/services/playService";
import { getRounds } from "@/services/roundService";
import { Card } from "@/types/cards";
import { Game } from "@/types/games";
import { Round } from "@/types/rounds";
import { createEvidence, getEvidences } from "@/services/evidenceService";
import { Evidence } from "@/types/evidences";
import { Play } from "@/types/plays";

import styles from "./PlayerHomePage.module.css";

const MAX_EVIDENCE_FILE_SIZE_MB = 10;
const MAX_EVIDENCE_FILE_SIZE_BYTES = MAX_EVIDENCE_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_EVIDENCE_FILE_TYPES = ["image/", "video/"];

export default function PlayerHomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [isSubmittingPlay, setIsSubmittingPlay] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [plays, setPlays] = useState<Play[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [selectedPlay, setSelectedPlay] = useState<Play | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceText, setEvidenceText] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePreviewUrl, setEvidencePreviewUrl] = useState("");
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);
  const evidencePreviewUrlRef = useRef("");

  async function loadData() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [gamesData, roundsData, playsData, evidencesData] = await Promise.all([
        getGames(),
        getRounds(),
        getPlays(),
        getEvidences(),
      ]);

      setGames(gamesData);
      setRounds(roundsData);
      setPlays(playsData);
      setEvidences(evidencesData);

      if (gamesData.length > 0) {
        setSelectedGameId(gamesData[0].id);
      }
    } catch {
      setErrorMessage(
        "Não foi possível carregar seus jogos. Confira se você foi adicionado a um grupo."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, []);

  const selectedGame = games.find((game) => game.id === selectedGameId);

  const gameRounds = useMemo(() => {
    if (!selectedGameId) {
      return [];
    }

    return rounds.filter((round) => round.game === selectedGameId);
  }, [rounds, selectedGameId]);

  const gamePlays = useMemo(() => {
    if (!selectedGameId) {
      return [];
    }

    return plays.filter((play) => play.game === selectedGameId);
  }, [plays, selectedGameId]);

  const gameEvidences = useMemo(() => {
    const playIds = new Set(gamePlays.map((play) => play.id));

    return evidences.filter((evidence) => playIds.has(evidence.play));
  }, [evidences, gamePlays]);

  useEffect(() => {
    return () => {
      if (evidencePreviewUrlRef.current) {
        URL.revokeObjectURL(evidencePreviewUrlRef.current);
      }
    };
  }, []);

  function updateEvidencePreviewUrl(nextUrl: string) {
    if (evidencePreviewUrlRef.current) {
      URL.revokeObjectURL(evidencePreviewUrlRef.current);
    }

    evidencePreviewUrlRef.current = nextUrl;
    setEvidencePreviewUrl(nextUrl);
  }

  function getEvidenceByPlay(playId: number) {
    return evidences.find((evidence) => evidence.play === playId);
  }

  function getPlayByRound(roundId: number) {
    return plays.find((play) => play.round === roundId);
  }

  function getEvidenceStatusLabel(status?: string) {
    const labels: Record<string, string> = {
      PENDING: "Evidência pendente",
      APPROVED: "Evidência aprovada",
      REJECTED: "Evidência rejeitada",
    };

    if (!status) {
      return "Evidência não enviada";
    }

    return labels[status] ?? status;
  }

  function getEvidenceStatusClass(status?: string) {
    const classes: Record<string, string> = {
      PENDING: styles.evidencePending,
      APPROVED: styles.evidenceApproved,
      REJECTED: styles.evidenceRejected,
    };

    return status ? classes[status] ?? "" : styles.evidenceMissing;
  }

  const openRounds = gameRounds.filter((round) => round.status === "OPEN");
  const scheduledRounds = gameRounds.filter(
    (round) => round.status === "SCHEDULED"
  );
  const scoredRounds = gameRounds.filter((round) => round.status === "SCORED");

  function formatTime(value: string) {
    return new Date(value).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatDate(value: string) {
    return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
  }

  function formatDateTime(value: string) {
    return new Date(value).toLocaleString("pt-BR");
  }

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      SCHEDULED: "Agendada",
      OPEN: "Aberta",
      CLOSED: "Fechada",
      SCORED: "Pontuada",
      CANCELED: "Cancelada",
    };

    return labels[status] ?? status;
  }

  async function openPlayModal(round: Round) {
    try {
      setSelectedRound(round);
      setSelectedCardId(null);
      setCards([]);
      setFeedbackMessage("");
      setErrorMessage("");
      setIsPlayModalOpen(true);
      setIsLoadingCards(true);

      const cardsData = await getCards(
        round.selected_suit ? { suit: round.selected_suit } : undefined
      );

      setCards(cardsData);
    } catch {
      setErrorMessage("Não foi possível carregar as cartas disponíveis.");
    } finally {
      setIsLoadingCards(false);
    }
  }

  function closePlayModal() {
    if (isSubmittingPlay) {
      return;
    }

    setIsPlayModalOpen(false);
    setSelectedRound(null);
    setSelectedCardId(null);
    setCards([]);
  }

  async function handleSubmitPlay() {
    if (!selectedRound || !selectedCardId) {
      setErrorMessage("Selecione uma carta para jogar.");
      return;
    }

    try {
      setIsSubmittingPlay(true);
      setErrorMessage("");
      setFeedbackMessage("");

      await createPlay({
        round: selectedRound.id,
        card: selectedCardId,
      });

      await loadData();

      setIsPlayModalOpen(false);
      setSelectedRound(null);
      setSelectedCardId(null);
      setCards([]);
      setFeedbackMessage("Carta jogada com sucesso.");
    } catch {
      setErrorMessage(
        "Não foi possível jogar esta carta. Verifique se você já jogou nesta rodada ou se a carta respeita o naipe definido."
      );
    } finally {
      setIsSubmittingPlay(false);
    }
  }

  function openEvidenceModal(play: Play) {
    setSelectedPlay(play);
    setEvidenceText("");
    setEvidenceFile(null);
    updateEvidencePreviewUrl("");
    setErrorMessage("");
    setFeedbackMessage("");
    setIsEvidenceModalOpen(true);
  }

  function closeEvidenceModal() {
    if (isSubmittingEvidence) {
      return;
    }

    setSelectedPlay(null);
    setEvidenceText("");
    setEvidenceFile(null);
    updateEvidencePreviewUrl("");
    setIsEvidenceModalOpen(false);
  }

  function getEvidenceSubmissionError(error: unknown) {
    if (error instanceof AxiosError) {
      const responseData = error.response?.data as
        | { detail?: string; play?: string[]; file?: string[]; text?: string[] }
        | undefined;

      return (
        responseData?.detail ||
        responseData?.play?.[0] ||
        responseData?.file?.[0] ||
        responseData?.text?.[0] ||
        "Não foi possível enviar a evidência."
      );
    }

    return "Não foi possível enviar a evidência.";
  }

  function handleEvidenceFileChange(file: File | null) {
    setErrorMessage("");

    if (!file) {
      setEvidenceFile(null);
      updateEvidencePreviewUrl("");
      return true;
    }

    const isAllowedType = ALLOWED_EVIDENCE_FILE_TYPES.some((typePrefix) =>
      file.type.startsWith(typePrefix)
    );

    if (!isAllowedType) {
      setEvidenceFile(null);
      updateEvidencePreviewUrl("");
      setErrorMessage("Envie uma imagem ou vídeo como evidência.");
      return false;
    }

    if (file.size > MAX_EVIDENCE_FILE_SIZE_BYTES) {
      setEvidenceFile(null);
      updateEvidencePreviewUrl("");
      setErrorMessage(
        `O arquivo deve ter no máximo ${MAX_EVIDENCE_FILE_SIZE_MB} MB.`
      );
      return false;
    }

    setEvidenceFile(file);
    updateEvidencePreviewUrl(
      file.type.startsWith("image/") ? URL.createObjectURL(file) : ""
    );
    return true;
  }

  async function handleSubmitEvidence() {
    if (!selectedPlay) {
      return;
    }

    if (!evidenceText.trim() && !evidenceFile) {
      setErrorMessage("Informe um texto ou anexe um arquivo como evidência.");
      return;
    }

    try {
      setIsSubmittingEvidence(true);
      setErrorMessage("");
      setFeedbackMessage("");

      await createEvidence({
        play: selectedPlay.id,
        text: evidenceText,
        file: evidenceFile,
      });

      await loadData();

      setSelectedPlay(null);
      setEvidenceText("");
      setEvidenceFile(null);
      updateEvidencePreviewUrl("");
      setIsEvidenceModalOpen(false);
      setFeedbackMessage("Evidência enviada com sucesso. Aguarde a revisão.");
    } catch (error) {
      setErrorMessage(getEvidenceSubmissionError(error));
    } finally {
      setIsSubmittingEvidence(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["PLAYER"]}>
      <PlayerLayout>
        <div className={styles.header}>
          <h1>Área do Jogador</h1>
          <p>
            Acompanhe suas rodadas disponíveis e prepare suas jogadas do dia.
          </p>
        </div>

        {feedbackMessage && (
          <div className={styles.message}>{feedbackMessage}</div>
        )}

        {isLoading && <div className={styles.message}>Carregando jogos...</div>}

        {!isLoading && errorMessage && !isPlayModalOpen && (
          <div className={styles.error}>{errorMessage}</div>
        )}

        {!isLoading && !errorMessage && games.length === 0 && (
          <div className={styles.message}>
            Você ainda não possui jogos disponíveis. Peça para o administrador
            adicionar você a um grupo.
          </div>
        )}

        {!isLoading && !errorMessage && games.length > 0 && (
          <>
            <section className={styles.filters}>
              <div className={styles.field}>
                <label htmlFor="game">Jogo</label>
                <select
                  id="game"
                  value={selectedGameId ?? ""}
                  onChange={(event) =>
                    setSelectedGameId(Number(event.target.value))
                  }
                >
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name} - {game.group_name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedGame && (
                <span className={styles.badge}>
                  Status: {getStatusLabel(selectedGame.status)}
                </span>
              )}
            </section>

            <section className={styles.grid}>
              <article className={styles.card}>
                <span>Rodadas totais</span>
                <strong>{gameRounds.length}</strong>
              </article>

              <article className={styles.card}>
                <span>Rodadas abertas</span>
                <strong>{openRounds.length}</strong>
              </article>

              <article className={styles.card}>
                <span>Rodadas agendadas</span>
                <strong>{scheduledRounds.length}</strong>
              </article>

              <article className={styles.card}>
                <span>Rodadas pontuadas</span>
                <strong>{scoredRounds.length}</strong>
              </article>
            </section>

            <section className={styles.section}>
              <h2>Rodadas do jogo</h2>

              {gameRounds.length === 0 ? (
                <div className={styles.message}>
                  Este jogo ainda não possui rodadas geradas.
                </div>
              ) : (
                <div className={styles.roundsGrid}>
                  {gameRounds.map((round) => (
                    <article className={styles.roundCard} key={round.id}>
                      <div className={styles.roundTop}>
                        <div>
                          <strong>{round.schedule_name}</strong>
                          <span>Dia {round.day_number}</span>
                        </div>

                        <span className={styles.badge}>
                          {getStatusLabel(round.status)}
                        </span>
                      </div>

                      <div className={styles.roundInfo}>
                        <span>Data: {formatDate(round.date)}</span>
                        <span>
                          Horário: {formatTime(round.starts_at)} até{" "}
                          {formatTime(round.ends_at)}
                        </span>
                        <span>
                          Naipe:{" "}
                          {round.selected_suit_symbol
                            ? `${round.selected_suit_symbol} ${round.selected_suit_name}`
                            : "Ainda não definido"}
                        </span>
                      </div>

                      {(() => {
                        const play = getPlayByRound(round.id);
                        const evidence = play ? getEvidenceByPlay(play.id) : null;
                        const canPlay =
                          !play && (round.status === "OPEN" || round.status === "SCHEDULED");

                        if (play) {
                          return (
                            <div className={styles.playStatusBox}>
                              <strong>Jogada realizada</strong>
                              <span>
                                Carta: {play.card_suit_symbol} {play.card_value} —{" "}
                                {play.card_title}
                              </span>
                              <span>Pontos: {play.total_points}</span>
                              <span
                                className={`${styles.evidenceBadge} ${getEvidenceStatusClass(
                                  evidence?.status
                                )}`}
                              >
                                {getEvidenceStatusLabel(evidence?.status)}
                              </span>

                              {!evidence && (
                                <button
                                  className={styles.actionButton}
                                  type="button"
                                  onClick={() => openEvidenceModal(play)}
                                >
                                  Enviar evidência
                                </button>
                              )}

                              {evidence?.status === "REJECTED" && (
                                <button
                                  className={styles.actionButton}
                                  type="button"
                                  onClick={() => openEvidenceModal(play)}
                                >
                                  Reenviar evidência
                                </button>
                              )}
                            </div>
                          );
                        }

                        return (
                          <button
                            className={styles.actionButton}
                            type="button"
                            disabled={!canPlay}
                            onClick={() => openPlayModal(round)}
                          >
                            {canPlay ? "Jogar carta" : "Rodada indisponível"}
                          </button>
                        );
                      })()}
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className={styles.playsSection}>
              <h2>Minhas jogadas</h2>

              {gamePlays.length === 0 ? (
                <div className={styles.message}>
                  Você ainda não realizou jogadas neste jogo.
                </div>
              ) : (
                <div className={styles.playsGrid}>
                  {gamePlays.map((play) => {
                    const evidence = getEvidenceByPlay(play.id);

                    return (
                      <article className={styles.playCard} key={play.id}>
                        <div className={styles.playCardHeader}>
                          <strong>{play.card_title}</strong>
                          <span>
                            {play.card_suit_symbol} {play.card_value}
                          </span>
                        </div>

                        <div className={styles.playCardInfo}>
                          <span>Rodada: dia {play.round_day}</span>
                          <span>Pontos: {play.total_points}</span>
                          <span>Status da jogada: {play.status}</span>
                          <span
                            className={`${styles.evidenceBadge} ${getEvidenceStatusClass(
                              evidence?.status
                            )}`}
                          >
                            Evidência: {getEvidenceStatusLabel(evidence?.status)}
                          </span>
                          {evidence && (
                            <span>Enviada em: {formatDateTime(evidence.created_at)}</span>
                          )}
                        </div>

                        {!evidence && (
                          <button
                            className={styles.actionButton}
                            type="button"
                            onClick={() => openEvidenceModal(play)}
                          >
                            Enviar evidência
                          </button>
                        )}

                        {evidence && evidence.status === "REJECTED" && (
                          <button
                            className={styles.actionButton}
                            type="button"
                            onClick={() => openEvidenceModal(play)}
                          >
                            Reenviar evidência
                          </button>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <section className={styles.playsSection}>
              <h2>Histórico de evidências</h2>

              {gameEvidences.length === 0 ? (
                <div className={styles.message}>
                  Nenhuma evidência enviada neste jogo.
                </div>
              ) : (
                <div className={styles.evidenceHistory}>
                  {gameEvidences.map((evidence) => (
                    <article className={styles.evidenceHistoryItem} key={evidence.id}>
                      <div>
                        <strong>{evidence.card_title}</strong>
                        <span>
                          {evidence.card_suit_symbol} {evidence.card_value} • Dia{" "}
                          {evidence.round_day}
                        </span>
                      </div>

                      <span
                        className={`${styles.evidenceBadge} ${getEvidenceStatusClass(
                          evidence.status
                        )}`}
                      >
                        {getEvidenceStatusLabel(evidence.status)}
                      </span>

                      <small>{formatDateTime(evidence.created_at)}</small>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <Modal
          title="Jogar carta"
          isOpen={isPlayModalOpen}
          onClose={closePlayModal}
        >
          <div className={styles.playModalContent}>
            {selectedRound && (
              <div className={styles.roundSummary}>
                <strong>{selectedRound.schedule_name}</strong>
                <span>Data: {formatDate(selectedRound.date)}</span>
                <span>
                  Horário: {formatTime(selectedRound.starts_at)} até{" "}
                  {formatTime(selectedRound.ends_at)}
                </span>
                <span>
                  Naipe da rodada:{" "}
                  {selectedRound.selected_suit_symbol
                    ? `${selectedRound.selected_suit_symbol} ${selectedRound.selected_suit_name}`
                    : "Você pode iniciar escolhendo qualquer naipe."}
                </span>
              </div>
            )}

            {isLoadingCards && (
              <div className={styles.message}>Carregando cartas...</div>
            )}

            {!isLoadingCards && cards.length === 0 && (
              <div className={styles.message}>
                Nenhuma carta disponível para esta rodada.
              </div>
            )}

            {!isLoadingCards && cards.length > 0 && (
              <div className={styles.cardsGrid}>
                {cards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    className={`${styles.cardOption} ${
                      selectedCardId === card.id
                        ? styles.cardOptionSelected
                        : ""
                    }`}
                    onClick={() => setSelectedCardId(card.id)}
                  >
                    <div className={styles.cardOptionHeader}>
                      <strong>{card.title}</strong>
                      <span>
                        {card.suit_symbol} {card.value}
                      </span>
                    </div>

                    <p>{card.instruction || card.description}</p>
                  </button>
                ))}
              </div>
            )}

            {errorMessage && <div className={styles.error}>{errorMessage}</div>}

            <div className={styles.modalActions}>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={closePlayModal}
                disabled={isSubmittingPlay}
              >
                Cancelar
              </button>

              <button
                className={styles.primaryButton}
                type="button"
                onClick={handleSubmitPlay}
                disabled={isSubmittingPlay || !selectedCardId}
              >
                {isSubmittingPlay ? "Jogando..." : "Confirmar jogada"}
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          title="Enviar evidência"
          isOpen={isEvidenceModalOpen}
          onClose={closeEvidenceModal}
        >
          <div className={styles.evidenceForm}>
            {selectedPlay && (
              <div className={styles.roundSummary}>
                <strong>{selectedPlay.card_title}</strong>
                <span>
                  Carta: {selectedPlay.card_suit_symbol} {selectedPlay.card_value}
                </span>
                <span>Rodada: dia {selectedPlay.round_day}</span>
                <span>Pontos da jogada: {selectedPlay.total_points}</span>
              </div>
            )}

            <div className={styles.evidenceField}>
              <label htmlFor="evidenceText">Descrição da evidência</label>
              <textarea
                id="evidenceText"
                value={evidenceText}
                onChange={(event) => setEvidenceText(event.target.value)}
                placeholder="Descreva brevemente o que foi realizado..."
              />
            </div>

            <div className={styles.evidenceField}>
              <label htmlFor="evidenceFile">Arquivo</label>
              <input
                id="evidenceFile"
                type="file"
                accept="image/*,video/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  const isValidFile = handleEvidenceFileChange(file);

                  if (!isValidFile) {
                    event.currentTarget.value = "";
                  }
                }}
              />
              <small>
                Imagens ou vídeos de até {MAX_EVIDENCE_FILE_SIZE_MB} MB.
              </small>
              {evidenceFile && (
                <span className={styles.selectedFile}>
                  Arquivo selecionado: {evidenceFile.name}
                </span>
              )}
            </div>

            {evidencePreviewUrl && (
              <div className={styles.imagePreview}>
                <span>Preview da imagem</span>
                <img src={evidencePreviewUrl} alt="Preview da evidência" />
              </div>
            )}

            {errorMessage && <div className={styles.error}>{errorMessage}</div>}

            <div className={styles.modalActions}>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={closeEvidenceModal}
                disabled={isSubmittingEvidence}
              >
                Cancelar
              </button>

              <button
                className={styles.primaryButton}
                type="button"
                onClick={handleSubmitEvidence}
                disabled={isSubmittingEvidence}
              >
                {isSubmittingEvidence ? "Enviando..." : "Enviar evidência"}
              </button>
            </div>
          </div>
        </Modal>
      </PlayerLayout>
    </ProtectedRoute>
  );
}
