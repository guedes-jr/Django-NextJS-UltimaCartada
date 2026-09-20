"use client";

import { useEffect, useState } from "react";

import { getAuthUser, saveAuthUser } from "@/lib/auth";
import { completeOnboarding } from "@/services/accountService";

import styles from "./PlayerOnboardingTour.module.css";

const steps = [
  {
    eyebrow: "Bem-vindo ao Cartada Viva",
    title: "Seu jogo começa aqui",
    description:
      "Na página inicial você acompanha o jogo ativo, as rodadas do dia e tudo o que ainda precisa fazer.",
    target: "player-game-overview",
  },
  {
    eyebrow: "Passo 1",
    title: "Escolha a rodada e jogue sua carta",
    description:
      "Quando uma rodada estiver disponível, abra as cartas, leia o desafio e confirme sua escolha. Cada rodada aceita uma jogada por participante.",
    target: "player-rounds",
  },
  {
    eyebrow: "Passo 2",
    title: "Realize o desafio e envie a evidência",
    description:
      "Depois da jogada, envie um texto, uma foto ou um vídeo. O prazo aparece ao lado da jogada e termina às 22h do dia do desafio.",
    target: "player-plays",
  },
  {
    eyebrow: "Passo 3",
    title: "Acompanhe sua evolução",
    description:
      "Use Meu desempenho e Ranking para conferir pontos, evidências aprovadas e sua evolução junto ao grupo.",
    target: "player-navigation",
  },
];

type PlayerOnboardingTourProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function PlayerOnboardingTour({
  isOpen,
  onClose,
}: PlayerOnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const step = steps[currentStep];

  useEffect(() => {
    if (!isOpen || !step.target) {
      return;
    }

    const target = document.querySelector<HTMLElement>(
      `[data-tour="${step.target}"]`
    );

    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [isOpen, step.target]);

  async function finishTour() {
    try {
      setIsSaving(true);
      setErrorMessage("");
      await completeOnboarding();

      const user = getAuthUser();
      if (user) {
        saveAuthUser({ ...user, first_access_completed: true });
      }

      setCurrentStep(0);
      onClose();
    } catch {
      setErrorMessage(
        "Não foi possível salvar a conclusão do tour. Tente novamente."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className={styles.overlay} role="presentation">
      <section
        className={styles.tour}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        <div className={styles.progress} aria-label="Progresso do tour">
          {steps.map((item, index) => (
            <span
              className={index <= currentStep ? styles.progressActive : ""}
              key={item.title}
            />
          ))}
        </div>

        <span className={styles.eyebrow}>{step.eyebrow}</span>
        <h2 id="onboarding-title">{step.title}</h2>
        <p>{step.description}</p>

        <span className={styles.counter}>
          {currentStep + 1} de {steps.length}
        </span>

        {errorMessage && <div className={styles.error}>{errorMessage}</div>}

        <div className={styles.actions}>
          <button
            className={styles.skipButton}
            type="button"
            onClick={finishTour}
            disabled={isSaving}
          >
            Pular tour
          </button>

          <div>
            {currentStep > 0 && (
              <button
                className={styles.backButton}
                type="button"
                onClick={() => setCurrentStep((value) => value - 1)}
                disabled={isSaving}
              >
                Voltar
              </button>
            )}

            <button
              className={styles.nextButton}
              type="button"
              onClick={() => {
                if (isLastStep) {
                  void finishTour();
                  return;
                }

                setCurrentStep((value) => value + 1);
              }}
              disabled={isSaving}
            >
              {isSaving
                ? "Salvando..."
                : isLastStep
                  ? "Começar a jogar"
                  : "Próximo"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
