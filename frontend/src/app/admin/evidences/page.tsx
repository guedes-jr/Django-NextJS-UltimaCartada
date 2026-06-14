"use client";

import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Modal } from "@/components/ui/Modal";
import {
  approveEvidence,
  getEvidences,
  rejectEvidence,
} from "@/services/evidenceService";
import { Evidence } from "@/types/evidences";

import styles from "./AdminEvidencesPage.module.css";

export default function AdminEvidencesPage() {
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(
    null
  );
  const [adminNotes, setAdminNotes] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function loadEvidences() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getEvidences();
      setEvidences(data);
    } catch {
      setErrorMessage("Não foi possível carregar as evidências.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadEvidences);
  }, []);

  function openModal(evidence: Evidence) {
    setSelectedEvidence(evidence);
    setAdminNotes(evidence.admin_notes || "");
    setFeedbackMessage("");
    setErrorMessage("");
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isReviewing) {
      return;
    }

    setSelectedEvidence(null);
    setAdminNotes("");
    setIsModalOpen(false);
  }

  async function handleApprove() {
    if (!selectedEvidence) {
      return;
    }

    try {
      setIsReviewing(true);
      setErrorMessage("");

      await approveEvidence(selectedEvidence.id, {
        admin_notes: adminNotes,
      });

      await loadEvidences();

      setIsModalOpen(false);
      setFeedbackMessage("Evidência aprovada com sucesso.");
    } catch {
      setErrorMessage("Não foi possível aprovar a evidência.");
    } finally {
      setIsReviewing(false);
    }
  }

  async function handleReject() {
    if (!selectedEvidence) {
      return;
    }

    try {
      setIsReviewing(true);
      setErrorMessage("");

      await rejectEvidence(selectedEvidence.id, {
        admin_notes: adminNotes,
      });

      await loadEvidences();

      setIsModalOpen(false);
      setFeedbackMessage("Evidência rejeitada com sucesso.");
    } catch {
      setErrorMessage("Não foi possível rejeitar a evidência.");
    } finally {
      setIsReviewing(false);
    }
  }

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      PENDING: "Pendente",
      APPROVED: "Aprovada",
      REJECTED: "Rejeitada",
    };

    return labels[status] ?? status;
  }

  function getStatusClass(status: string) {
    const classes: Record<string, string> = {
      PENDING: styles.pending,
      APPROVED: styles.approved,
      REJECTED: styles.rejected,
    };

    return classes[status] ?? "";
  }

  function isImage(fileUrl: string) {
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(fileUrl);
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "GAME_MEDIATOR"]}>
      <AdminLayout>
        <div className={styles.header}>
          <h1>Evidências</h1>
          <p>Revise os registros enviados pelos jogadores e valide pontuações.</p>
        </div>

        {feedbackMessage && (
          <div className={styles.success}>{feedbackMessage}</div>
        )}

        {errorMessage && !isModalOpen && (
          <div className={styles.error}>{errorMessage}</div>
        )}

        <article className={styles.card}>
          <h2>Evidências recebidas</h2>

          {isLoading && (
            <div className={styles.message}>Carregando evidências...</div>
          )}

          {!isLoading && evidences.length === 0 && !errorMessage && (
            <div className={styles.message}>
              Nenhuma evidência enviada até o momento.
            </div>
          )}

          {!isLoading && evidences.length > 0 && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Jogador</th>
                    <th>Jogo</th>
                    <th>Carta</th>
                    <th>Status</th>
                    <th>Enviada em</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {evidences.map((evidence) => (
                    <tr key={evidence.id}>
                      <td>
                        <div className={styles.mainInfo}>
                          <strong>
                            {evidence.player_name || evidence.player_username}
                          </strong>
                          <span>@{evidence.player_username}</span>
                        </div>
                      </td>

                      <td>{evidence.game_name}</td>

                      <td>
                        <div className={styles.mainInfo}>
                          <strong>{evidence.card_title}</strong>
                          <span>
                            {evidence.card_suit_symbol} {evidence.card_value} •{" "}
                            Dia {evidence.round_day}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`${styles.badge} ${getStatusClass(
                            evidence.status
                          )}`}
                        >
                          {getStatusLabel(evidence.status)}
                        </span>
                      </td>

                      <td>
                        {new Date(evidence.created_at).toLocaleString("pt-BR")}
                      </td>

                      <td>
                        <button
                          className={styles.actionButton}
                          type="button"
                          onClick={() => openModal(evidence)}
                        >
                          Revisar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <Modal
          title="Revisar evidência"
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          {selectedEvidence && (
            <div className={styles.reviewContent}>
              <div className={styles.previewBox}>
                <span>Jogador</span>
                <strong>
                  {selectedEvidence.player_name ||
                    selectedEvidence.player_username}
                </strong>
              </div>

              <div className={styles.previewBox}>
                <span>Carta</span>
                <strong>
                  {selectedEvidence.card_suit_symbol}{" "}
                  {selectedEvidence.card_value} — {selectedEvidence.card_title}
                </strong>
              </div>

              <div className={styles.previewBox}>
                <span>Texto enviado</span>
                <p>{selectedEvidence.text || "Nenhum texto enviado."}</p>
              </div>

              {selectedEvidence.file && isImage(selectedEvidence.file) && (
                <img
                  className={styles.previewFile}
                  src={selectedEvidence.file}
                  alt="Evidência enviada"
                />
              )}

              {selectedEvidence.file && !isImage(selectedEvidence.file) && (
                <a
                  className={styles.fileLink}
                  href={selectedEvidence.file}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir arquivo enviado
                </a>
              )}

              <div className={styles.field}>
                <label htmlFor="adminNotes">Observação do admin</label>
                <textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(event) => setAdminNotes(event.target.value)}
                  placeholder="Informe uma observação, se necessário..."
                />
              </div>

              {errorMessage && <div className={styles.error}>{errorMessage}</div>}

              <div className={styles.modalActions}>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={closeModal}
                  disabled={isReviewing}
                >
                  Fechar
                </button>

                <button
                  className={styles.rejectButton}
                  type="button"
                  onClick={handleReject}
                  disabled={isReviewing}
                >
                  {isReviewing ? "Processando..." : "Rejeitar"}
                </button>

                <button
                  className={styles.approveButton}
                  type="button"
                  onClick={handleApprove}
                  disabled={isReviewing}
                >
                  {isReviewing ? "Processando..." : "Aprovar"}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </AdminLayout>
    </ProtectedRoute>
  );
}
