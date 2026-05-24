"use client";

import { FormEvent, useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Modal } from "@/components/ui/Modal";
import { createCard, getCards, getSuits } from "@/services/cardService";
import { Card, CreateCardPayload, Suit } from "@/types/cards";

import styles from "./AdminCardsPage.module.css";

const INITIAL_FORM: CreateCardPayload = {
  suit: "",
  value: 1,
  code: "",
  title: "",
  description: "",
  instruction: "",
  category: "",
  difficulty: "EASY",
  estimated_minutes: 5,
  requires_evidence: true,
  evidence_type: "IMAGE",
  is_active: true,
};

export default function AdminCardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [suits, setSuits] = useState<Suit[]>([]);
  const [form, setForm] = useState<CreateCardPayload>(INITIAL_FORM);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [cardsData, suitsData] = await Promise.all([
        getCards(),
        getSuits(),
      ]);

      setCards(cardsData);
      setSuits(suitsData);
    } catch {
      setErrorMessage("Não foi possível carregar as cartas.");
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
    field: keyof CreateCardPayload,
    value: string | number | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openViewModal(card: Card) {
    setSelectedCard(card);
    setIsViewModalOpen(true);
  }

  function closeViewModal() {
    setIsViewModalOpen(false);
    setSelectedCard(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.suit) {
      setErrorMessage("Selecione um naipe para a carta.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedbackMessage("");
      setErrorMessage("");

      await createCard({
        ...form,
        suit: Number(form.suit),
      });

      await loadData();

      setForm(INITIAL_FORM);
      setIsModalOpen(false);
      setFeedbackMessage("Carta criada com sucesso.");
    } catch {
      setErrorMessage(
        "Não foi possível criar a carta. Verifique se o código ou valor já existem para este naipe."
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
            <h1>Cartas</h1>
            <p>Cadastre e organize as cartas usadas nos desafios do jogo.</p>
          </div>

          <button
            className={styles.primaryButton}
            type="button"
            onClick={openCreateModal}
          >
            Nova carta
          </button>
        </div>

        {feedbackMessage && (
          <div className={styles.success}>{feedbackMessage}</div>
        )}

        <article className={styles.cardBox}>
          <h2>Cartas cadastradas</h2>

          {isLoading && (
            <div className={styles.message}>Carregando cartas...</div>
          )}

          {!isLoading && errorMessage && !isModalOpen && (
            <div className={styles.error}>{errorMessage}</div>
          )}

          {!isLoading && cards.length === 0 && !errorMessage && (
            <div className={styles.message}>Nenhuma carta cadastrada ainda.</div>
          )}

          {!isLoading && cards.length > 0 && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Carta</th>
                    <th>Naipe</th>
                    <th>Valor</th>
                    <th>Categoria</th>
                    <th>Dificuldade</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {cards.map((card) => (
                    <tr key={card.id}>
                      <td>
                        <div className={styles.cardName}>
                          <strong>{card.title}</strong>
                          <span>{card.code}</span>
                        </div>
                      </td>

                      <td>
                        <span className={styles.suitBadge}>
                          {card.suit_symbol} {card.suit_name}
                        </span>
                      </td>

                      <td>{card.value}</td>

                      <td>{card.category || "-"}</td>

                      <td>{card.difficulty}</td>

                      <td>
                        <span
                          className={`${styles.statusBadge} ${!card.is_active ? styles.statusInactive : ""
                            }`}
                        >
                          {card.is_active ? "Ativa" : "Inativa"}
                        </span>
                      </td>

                      <td>
                        <div className={styles.actions}>
                          <button
                            className={styles.actionButton}
                            type="button"
                            onClick={() => openViewModal(card)}
                          >
                            Ver carta
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <Modal title="Nova carta" isOpen={isModalOpen} onClose={closeCreateModal}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="suit">Naipe</label>
                <select
                  id="suit"
                  value={form.suit}
                  onChange={(event) => updateField("suit", event.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  {suits.map((suit) => (
                    <option key={suit.id} value={suit.id}>
                      {suit.symbol} {suit.name} — {suit.theme}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="value">Valor</label>
                <input
                  id="value"
                  type="number"
                  min={1}
                  value={form.value}
                  onChange={(event) =>
                    updateField("value", Number(event.target.value))
                  }
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="code">Código</label>
                <input
                  id="code"
                  value={form.code}
                  onChange={(event) => updateField("code", event.target.value)}
                  placeholder="COPAS_01"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="category">Categoria</label>
                <input
                  id="category"
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  placeholder="Movimento, alimentação..."
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="title">Título</label>
              <input
                id="title"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                required
              />
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
              <label htmlFor="instruction">Instrução para o jogador</label>
              <textarea
                id="instruction"
                value={form.instruction}
                onChange={(event) =>
                  updateField("instruction", event.target.value)
                }
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="difficulty">Dificuldade</label>
                <select
                  id="difficulty"
                  value={form.difficulty}
                  onChange={(event) =>
                    updateField("difficulty", event.target.value)
                  }
                >
                  <option value="EASY">Fácil</option>
                  <option value="MEDIUM">Médio</option>
                  <option value="HARD">Difícil</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="estimated_minutes">Tempo estimado</label>
                <input
                  id="estimated_minutes"
                  type="number"
                  min={1}
                  value={form.estimated_minutes}
                  onChange={(event) =>
                    updateField(
                      "estimated_minutes",
                      Number(event.target.value)
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="evidence_type">Tipo de evidência</label>
              <select
                id="evidence_type"
                value={form.evidence_type}
                onChange={(event) =>
                  updateField("evidence_type", event.target.value)
                }
              >
                <option value="NONE">Não exige evidência</option>
                <option value="TEXT">Texto</option>
                <option value="IMAGE">Imagem</option>
                <option value="VIDEO">Vídeo</option>
                <option value="IMAGE_OR_VIDEO">Imagem ou vídeo</option>
              </select>
            </div>

            <div className={styles.checkRow}>
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={form.requires_evidence}
                  onChange={(event) =>
                    updateField("requires_evidence", event.target.checked)
                  }
                />
                Exige evidência
              </label>

              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) =>
                    updateField("is_active", event.target.checked)
                  }
                />
                Carta ativa
              </label>
            </div>

            {errorMessage && <div className={styles.error}>{errorMessage}</div>}

            <button
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Cadastrar carta"}
            </button>
          </form>
        </Modal>
        <Modal
          title="Visualizar carta"
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
        >
          {selectedCard && (
            <div className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <div className={styles.previewSymbol}>
                  {selectedCard.suit_symbol}
                </div>

                <div className={styles.previewTitle}>
                  <h3>{selectedCard.title}</h3>
                  <span>
                    {selectedCard.code} • {selectedCard.suit_name} • Valor{" "}
                    {selectedCard.value}
                  </span>
                </div>
              </div>

              {selectedCard.image && (
                <img
                  className={styles.previewImage}
                  src={selectedCard.image}
                  alt={selectedCard.title}
                />
              )}

              <div className={styles.previewGrid}>
                <div className={styles.previewItem}>
                  <span>Naipe</span>
                  <strong>
                    {selectedCard.suit_symbol} {selectedCard.suit_name}
                  </strong>
                </div>

                <div className={styles.previewItem}>
                  <span>Valor</span>
                  <strong>{selectedCard.value}</strong>
                </div>

                <div className={styles.previewItem}>
                  <span>Categoria</span>
                  <strong>{selectedCard.category || "-"}</strong>
                </div>

                <div className={styles.previewItem}>
                  <span>Dificuldade</span>
                  <strong>{selectedCard.difficulty}</strong>
                </div>

                <div className={styles.previewItem}>
                  <span>Tempo estimado</span>
                  <strong>{selectedCard.estimated_minutes} minutos</strong>
                </div>

                <div className={styles.previewItem}>
                  <span>Evidência</span>
                  <strong>
                    {selectedCard.requires_evidence
                      ? selectedCard.evidence_type
                      : "Não exige"}
                  </strong>
                </div>

                <div className={styles.previewItem}>
                  <span>Status</span>
                  <strong>{selectedCard.is_active ? "Ativa" : "Inativa"}</strong>
                </div>
              </div>

              <div className={styles.previewText}>
                <span>Descrição</span>
                <p>{selectedCard.description || "Sem descrição."}</p>
              </div>

              <div className={styles.previewText}>
                <span>Instrução para o jogador</span>
                <p>{selectedCard.instruction || "Sem instrução cadastrada."}</p>
              </div>
            </div>
          )}
        </Modal>
      </AdminLayout>
    </ProtectedRoute>
  );
}
