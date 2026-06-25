"use client";

import { Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import styles from "./VideoTestimonials.module.css";

export type VideoTestimonial = {
  name: string;
  label: string;
  src: string;
  type: string;
  poster: string;
};

type VideoTestimonialsProps = {
  items: VideoTestimonial[];
};

export default function VideoTestimonials({ items }: VideoTestimonialsProps) {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = activeVideo ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  useEffect(() => {
    if (!activeVideo) return;

    videoRef.current?.play().catch(() => undefined);
  }, [activeVideo]);

  return (
    <>
      <div className={styles.grid}>
        {items.map((testimonial) => (
          <button
            className={styles.card}
            key={testimonial.name}
            type="button"
            onClick={() => setActiveVideo(testimonial)}
            aria-label={`Abrir ${testimonial.label}`}
          >
            <span className={styles.media}>
              <img src={testimonial.poster} alt="" aria-hidden="true" />
              <span className={styles.playBadge}>
                <Play aria-hidden="true" />
              </span>
            </span>

            <span className={styles.cardBody}>
              <strong>{testimonial.name}</strong>
              <small>{testimonial.label}</small>
            </span>
          </button>
        ))}
      </div>

      {activeVideo ? (
        <div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.label}
          onClick={() => setActiveVideo(null)}
        >
          <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
            <div className={styles.modalHeader}>
              <strong>{activeVideo.name}</strong>

              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Fechar vídeo"
              >
                <X aria-hidden="true" />
              </button>
            </div>

            <video
              ref={videoRef}
              controls
              playsInline
              poster={activeVideo.poster}
              aria-label={activeVideo.label}
            >
              <source src={activeVideo.src} type={activeVideo.type} />
              Seu navegador não suporta a reprodução deste vídeo.
            </video>
          </div>
        </div>
      ) : null}
    </>
  );
}
