"use client";

import { AxiosError } from "axios";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Modal } from "@/components/ui/Modal";
import { getGroups } from "@/services/groupService";
import {
  createJourney,
  enrollJourneyGroups,
  getJourneyEnrollments,
  getJourneys,
} from "@/services/journeyService";
import { PlayerGroup } from "@/types/groups";
import {
  CreateJourneyPayload,
  Journey,
  JourneyEnrollment,
} from "@/types/journeys";

import styles from "./AdminJourneysPage.module.css";

type JourneyForm = CreateJourneyPayload & {
  group_ids: number[];
  generate_rounds: boolean;
};

const INITIAL_FORM: JourneyForm = {
  name: "",
  description: "",
  start_date: "",
  interval_days: 0,
  status: "DRAFT",
  is_active: true,
  stages: [
    { order: 1, name: "Jogo 1" },
    { order: 2, name: "Jogo 2" },
    { order: 3, name: "Jogo 3" },
  ],
  group_ids: [],
  generate_rounds: true,
};

const statusLabels = {
  DRAFT: "Rascunho",
  ACTIVE: "Ativa",
  FINISHED: "Finalizada",
  CANCELED: "Cancelada",
};

function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date;
}

function formatDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(`${value}T00:00:00`) : value;
  return date.toLocaleDateString("pt-BR");
}

function getApiError(error: unknown) {
  if (!(error instanceof AxiosError)) {
    return "Não foi possível concluir a operação.";
  }

  const data = error.response?.data as
    | { detail?: string; group_ids?: string[] | string; stages?: string[] }
    | undefined;
  const groupError = Array.isArray(data?.group_ids)
    ? data.group_ids[0]
    : data?.group_ids;

  return (
    data?.detail ||
    groupError ||
    data?.stages?.[0] ||
    "Não foi possível concluir a operação."
  );
}

export default function AdminJourneysPage() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [groups, setGroups] = useState<PlayerGroup[]>([]);
  const [progress, setProgress] = useState<Record<number, JourneyEnrollment[]>>(
    {}
  );
  const [form, setForm] = useState<JourneyForm>(INITIAL_FORM);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [enrollmentGroupIds, setEnrollmentGroupIds] = useState<number[]>([]);
  const [generateEnrollmentRounds, setGenerateEnrollmentRounds] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  async function loadData() {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const [journeysData, groupsData, enrollmentsData] = await Promise.all([
        getJourneys(),
        getGroups(),
        getJourneyEnrollments(),
      ]);
      setJourneys(journeysData);
      setGroups(groupsData.filter((group) => group.is_active));

      setProgress(
        Object.fromEntries(
          journeysData.map((journey) => [
            journey.id,
            enrollmentsData.filter(
              (enrollment) => enrollment.journey === journey.id
            ),
          ])
        )
      );
    } catch {
      setErrorMessage("Não foi possível carregar as Jornadas.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, []);

  const preview = useMemo(() => {
    if (!form.start_date) {
      return [];
    }

    return form.stages.map((stage) => {
      const startOffset = (stage.order - 1) * (21 + form.interval_days);
      const start = addDays(form.start_date, startOffset);
      return { ...stage, start, end: addDays(form.start_date, startOffset + 20) };
    });
  }, [form.interval_days, form.stages, form.start_date]);

  function toggleGroup(groupId: number, field: "create" | "enroll") {
    if (field === "create") {
      setForm((current) => ({
        ...current,
        group_ids: current.group_ids.includes(groupId)
          ? current.group_ids.filter((id) => id !== groupId)
          : [...current.group_ids, groupId],
      }));
      return;
    }

    setEnrollmentGroupIds((current) =>
      current.includes(groupId)
        ? current.filter((id) => id !== groupId)
        : [...current, groupId]
    );
  }

  function updateStageName(index: number, name: string) {
    setForm((current) => ({
      ...current,
      stages: current.stages.map((stage, stageIndex) =>
        stageIndex === index ? { ...stage, name } : stage
      ),
    }));
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.group_ids.length === 0) {
      setErrorMessage("Selecione pelo menos um grupo para a Jornada.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setFeedbackMessage("");
      await createJourney(form);
      setFeedbackMessage(
        "Jornada, etapas, jogos e matrículas criados com sucesso."
      );
      setForm(INITIAL_FORM);
      setIsCreateOpen(false);
      await loadData();
    } catch (error) {
      setErrorMessage(getApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function openEnrollment(journey: Journey) {
    setSelectedJourney(journey);
    setEnrollmentGroupIds([]);
    setGenerateEnrollmentRounds(true);
    setErrorMessage("");
    setFeedbackMessage("");
    setIsEnrollOpen(true);
  }

  async function handleEnroll() {
    if (!selectedJourney || enrollmentGroupIds.length === 0) {
      setErrorMessage("Selecione pelo menos um grupo.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const result = await enrollJourneyGroups(selectedJourney.id, {
        group_ids: enrollmentGroupIds,
        generate_rounds: generateEnrollmentRounds,
      });
      setFeedbackMessage(
        `${result.groups_enrolled} grupo(s) matriculado(s) e ${result.games_created} jogos criados.`
      );
      setIsEnrollOpen(false);
      setSelectedJourney(null);
      await loadData();
    } catch (error) {
      setErrorMessage(getApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function availableGroups(journeyId: number) {
    const enrolledIds = new Set(
      (progress[journeyId] ?? []).map((enrollment) => enrollment.group)
    );
    return groups.filter((group) => !enrolledIds.has(group.id));
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <div className={styles.header}>
          <div>
            <h1>Jornadas</h1>
            <p>
              Organize programas de três jogos de 21 dias e matricule vários
              grupos mantendo cada execução separada.
            </p>
          </div>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={() => {
              setForm(INITIAL_FORM);
              setErrorMessage("");
              setFeedbackMessage("");
              setIsCreateOpen(true);
            }}
          >
            Nova Jornada
          </button>
        </div>

        {feedbackMessage && <div className={styles.success}>{feedbackMessage}</div>}
        {!isCreateOpen && !isEnrollOpen && errorMessage && (
          <div className={styles.error}>{errorMessage}</div>
        )}
        {isLoading && <div className={styles.message}>Carregando Jornadas...</div>}
        {!isLoading && journeys.length === 0 && !errorMessage && (
          <div className={styles.emptyState}>
            <strong>Nenhuma Jornada criada</strong>
            <span>Crie a primeira para organizar os três ciclos de 21 dias.</span>
          </div>
        )}

        <div className={styles.journeyGrid}>
          {journeys.map((journey) => {
            const enrollments = progress[journey.id] ?? [];
            return (
              <article className={styles.journeyCard} key={journey.id}>
                <div className={styles.cardHeader}>
                  <div>
                    <span className={styles.eyebrow}>Início {formatDate(journey.start_date)}</span>
                    <h2>{journey.name}</h2>
                    <p>{journey.description || "Sem descrição."}</p>
                  </div>
                  <span className={`${styles.status} ${styles[journey.status.toLowerCase()]}`}>
                    {statusLabels[journey.status]}
                  </span>
                </div>

                <div className={styles.metrics}>
                  <div><strong>{journey.enrollments_count}</strong><span>grupos</span></div>
                  <div><strong>{journey.games_count}</strong><span>jogos</span></div>
                  <div><strong>63</strong><span>dias de jogo</span></div>
                </div>

                <div className={styles.stageTimeline}>
                  {journey.stages.map((stage) => {
                    const offset = (stage.order - 1) * (21 + journey.interval_days);
                    return (
                      <div className={styles.stage} key={stage.id}>
                        <span>{stage.order}</span>
                        <div>
                          <strong>{stage.name}</strong>
                          <small>
                            {formatDate(addDays(journey.start_date, offset))} a {" "}
                            {formatDate(addDays(journey.start_date, offset + 20))}
                          </small>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.enrollments}>
                  <h3>Grupos matriculados</h3>
                  {enrollments.length === 0 ? (
                    <span>Nenhum grupo matriculado.</span>
                  ) : (
                    enrollments.map((enrollment) => (
                      <div className={styles.enrollment} key={enrollment.id}>
                        <strong>{enrollment.group_name}</strong>
                        <span>
                          {enrollment.journey_games.length}/3 jogos • {" "}
                          {enrollment.journey_games.reduce(
                            (total, game) => total + game.rounds_count,
                            0
                          )} rodadas
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={() => openEnrollment(journey)}
                  disabled={availableGroups(journey.id).length === 0}
                >
                  {availableGroups(journey.id).length === 0
                    ? "Todos os grupos matriculados"
                    : "Adicionar grupos"}
                </button>
              </article>
            );
          })}
        </div>

        <Modal
          title="Nova Jornada"
          isOpen={isCreateOpen}
          onClose={() => !isSubmitting && setIsCreateOpen(false)}
        >
          <form className={styles.form} onSubmit={handleCreate}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="journey-name">Nome</label>
                <input
                  id="journey-name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="journey-start">Início da primeira etapa</label>
                <input
                  id="journey-start"
                  type="date"
                  value={form.start_date}
                  onChange={(event) => setForm({ ...form, start_date: event.target.value })}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="journey-description">Descrição</label>
              <textarea
                id="journey-description"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="journey-status">Status inicial</label>
                <select
                  id="journey-status"
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value as JourneyForm["status"] })
                  }
                >
                  <option value="DRAFT">Rascunho</option>
                  <option value="ACTIVE">Ativa</option>
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="journey-interval">Intervalo entre jogos</label>
                <input
                  id="journey-interval"
                  type="number"
                  min={0}
                  value={form.interval_days}
                  onChange={(event) =>
                    setForm({ ...form, interval_days: Number(event.target.value) })
                  }
                />
              </div>
            </div>

            <fieldset className={styles.fieldset}>
              <legend>Etapas da Jornada</legend>
              {form.stages.map((stage, index) => (
                <div className={styles.stageEditor} key={stage.order}>
                  <span>{stage.order}</span>
                  <input
                    aria-label={`Nome da etapa ${stage.order}`}
                    value={stage.name}
                    onChange={(event) => updateStageName(index, event.target.value)}
                    required
                  />
                  <small>21 dias</small>
                </div>
              ))}
            </fieldset>

            {preview.length > 0 && (
              <div className={styles.preview}>
                <strong>Prévia do calendário</strong>
                {preview.map((stage) => (
                  <span key={stage.order}>
                    {stage.name}: {formatDate(stage.start)} a {formatDate(stage.end)}
                  </span>
                ))}
              </div>
            )}

            <fieldset className={styles.fieldset}>
              <legend>Grupos iniciais</legend>
              <div className={styles.groupOptions}>
                {groups.map((group) => (
                  <label key={group.id}>
                    <input
                      type="checkbox"
                      checked={form.group_ids.includes(group.id)}
                      onChange={() => toggleGroup(group.id, "create")}
                    />
                    <span>{group.name}</span>
                    <small>{group.total_players} jogadores</small>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className={styles.checkOption}>
              <input
                type="checkbox"
                checked={form.generate_rounds}
                onChange={(event) =>
                  setForm({ ...form, generate_rounds: event.target.checked })
                }
              />
              <span>Gerar automaticamente as rodadas dos três jogos</span>
            </label>

            {errorMessage && <div className={styles.error}>{errorMessage}</div>}
            <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando Jornada..." : "Criar Jornada e matricular grupos"}
            </button>
          </form>
        </Modal>

        <Modal
          title={`Adicionar grupos${selectedJourney ? ` — ${selectedJourney.name}` : ""}`}
          isOpen={isEnrollOpen}
          onClose={() => !isSubmitting && setIsEnrollOpen(false)}
        >
          <div className={styles.form}>
            <div className={styles.groupOptions}>
              {selectedJourney && availableGroups(selectedJourney.id).map((group) => (
                <label key={group.id}>
                  <input
                    type="checkbox"
                    checked={enrollmentGroupIds.includes(group.id)}
                    onChange={() => toggleGroup(group.id, "enroll")}
                  />
                  <span>{group.name}</span>
                  <small>{group.total_players} jogadores</small>
                </label>
              ))}
            </div>
            <label className={styles.checkOption}>
              <input
                type="checkbox"
                checked={generateEnrollmentRounds}
                onChange={(event) => setGenerateEnrollmentRounds(event.target.checked)}
              />
              <span>Gerar rodadas automaticamente</span>
            </label>
            {errorMessage && <div className={styles.error}>{errorMessage}</div>}
            <button
              className={styles.submitButton}
              type="button"
              disabled={isSubmitting || enrollmentGroupIds.length === 0}
              onClick={handleEnroll}
            >
              {isSubmitting ? "Matriculando..." : "Confirmar matrícula"}
            </button>
          </div>
        </Modal>
      </AdminLayout>
    </ProtectedRoute>
  );
}
