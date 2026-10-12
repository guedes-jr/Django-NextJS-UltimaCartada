"use client";

import { useEffect, useState } from "react";
import { getDailyGroupSummary } from "@/services/journeyService";
import { DailyGroupPillar } from "@/types/journeys";
import styles from "./DailyGroupSummary.module.css";

export function DailyGroupSummary({ enrollment }: { enrollment: number }) {
  const [pillars, setPillars] = useState<DailyGroupPillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getDailyGroupSummary(enrollment)
      .then((data) => { if (active) setPillars(data); })
      .catch(() => { if (active) setError("Não foi possível carregar o progresso diário."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [enrollment]);

  return (
    <details className={styles.summary}>
      <summary>Progresso diário do grupo por pilar</summary>
      {loading && <p>Carregando progresso...</p>}
      {error && <p role="alert">{error}</p>}
      <div className={styles.grid}>
        {pillars.map((pillar) => (
          <article key={pillar.pillar}>
            <strong>{pillar.label}</strong>
            <span>{pillar.participants} participante(s)</span>
            <span>{pillar.played_days} participação(ões) • {pillar.points} pontos</span>
          </article>
        ))}
      </div>
    </details>
  );
}
