import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Camera,
  Gift,
  HeartPulse,
  Leaf,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import VideoTestimonials from "@/components/landing/VideoTestimonials";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Magaly Abreu | Mentoria A Última Cartada",
  description:
    "Mentoria para mulheres que querem construir uma nova relação com o corpo, a comida e a rotina.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

const WHATSAPP_URL =
  "https://wa.me/5584994124712?text=Olá,%20Magaly!%20Quero%20conhecer%20a%20mentoria%20A%20Última%20Cartada.";

const attempts = [
  "Dietas",
  "Jejum",
  "Reeducação alimentar",
  "Academia",
  "Desafios",
  "Aplicativos",
  "Protocolos",
  "Métodos milagrosos",
];

const restartSignals = [
  "Sabe o que deveria fazer, mas não consegue manter.",
  "Começa motivada e perde o ritmo.",
  "Desconta emoções na comida.",
  "Sente culpa depois de comer.",
  "Coloca todos em primeiro lugar e esquece de si.",
  "Deseja emagrecer, mas principalmente deseja voltar a confiar em si.",
];

const pillars = [
  {
    icon: HeartPulse,
    title: "Mentalidade e emoções",
    description:
      "Identificar crenças, padrões e gatilhos que sabotam seus resultados.",
  },
  {
    icon: Leaf,
    title: "Alimentação estratégica",
    description:
      "Escolhas inteligentes para a vida real, sem radicalismo e sem terrorismo nutricional.",
  },
  {
    icon: CalendarDays,
    title: "Rotina e hábitos",
    description:
      "Pequenas ações diárias que geram grandes transformações ao longo do tempo.",
  },
  {
    icon: Sparkles,
    title: "Identidade e manutenção",
    description:
      "O objetivo não é apenas emagrecer. É tornar-se a mulher que mantém os resultados.",
  },
];

const videoTestimonials = [
  {
    name: "Emanuel",
    label: "Depoimento de Emanuel",
    src: "/testimonials/emanuel.m4v",
    type: "video/x-m4v",
    poster: "/landing/professional/acauamedia-131.jpg",
  },
  {
    name: "Erica Meirelles",
    label: "Depoimento de Erica Meirelles",
    src: "/testimonials/erica.m4v",
    type: "video/x-m4v",
    poster: "/landing/professional/acauamedia-114.jpg",
  },
];

export default function HomePage() {
  return (
    <main className={styles.page} id="top">
      <header className={styles.header}>
        <a className={styles.brand} href="#top" aria-label="Magaly Abreu">
          <strong>Magaly Abreu</strong>
          <span>Mentoria</span>
        </a>

        <nav className={styles.nav} aria-label="Navegação principal">
          <a href="#sobre">Sobre</a>
          <Link href="/public/consultoria">Consultoria</Link>
          <Link href="/public/cartada-viva">Cartada Viva</Link>
          <Link href="/public/herbilife">Herbalife</Link>
          <a href="#depoimentos">Depoimentos</a>
          <a href="#contato">Contato</a>
        </nav>

        <Link className={styles.loginLink} href="/login">
          Entrar
        </Link>
      </header>

      <section className={styles.hero} id="sobre">
        <div className={styles.heroCopy}>
          <h1>
            A mente <em>muda,</em>
            <br />o corpo flui.
          </h1>

          <p className={styles.heroSubtitle}>Mentoria A Última Cartada</p>

          <div className={styles.heroBenefits}>
            <article>
              <CalendarDays aria-hidden="true" />
              <div>
                <strong>6 meses</strong>
                <span>de acompanhamento completo</span>
              </div>
            </article>

            <article>
              <Gift aria-hidden="true" />
              <div>
                <strong>Bônus exclusivo</strong>
                <span>Game Cartada Viva: 21 dias de práticas diárias</span>
              </div>
            </article>

            <article>
              <Users aria-hidden="true" />
              <div>
                <strong>Para mulheres</strong>
                <span>
                  Que já tentaram várias dietas, mas ainda se sentem presas à
                  ansiedade, à culpa e ao ciclo de recomeçar sempre.
                </span>
              </div>
            </article>
          </div>

          <a className={styles.primaryButton} href="#mentoria">
            Quero conhecer a mentoria
            <ChevronRight aria-hidden="true" />
          </a>
        </div>

        <div className={styles.heroVisual}>
          <img src="/landing/professional/acauamedia-131.jpg" alt="Magaly Abreu" />
          <blockquote>
            <span>“</span>
            O dia da vida começa com decisões como a sua escolha.
          </blockquote>
        </div>
      </section>

      <section className={styles.problem}>
        <div className={styles.problemLeft}>
          <h2>Você já tentou de tudo?</h2>
          <div className={styles.attemptList}>
            {attempts.map((attempt) => (
              <span key={attempt}>{attempt}</span>
            ))}
          </div>
        </div>

        <div className={styles.problemDivider}>x</div>

        <div className={styles.problemRight}>
          <h2>
            E mesmo assim continua
            <br />
            voltando para o mesmo lugar?
          </h2>
          <h3>Não porque lhe falta informação.</h3>
          <p>
            Mas porque ninguém ensinou você a lidar com a ansiedade, os
            gatilhos emocionais, a autossabotagem e os padrões que fazem você
            abandonar o processo.
          </p>
        </div>
      </section>

      <section className={styles.restart}>
        <div>
          <h2>Para a mulher que está cansada de recomeçar.</h2>

          <ul>
            {restartSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>

          <p>A Última Cartada foi criada para ela.</p>
        </div>

        <img
          src="/landing/professional/acauamedia-126.jpg"
          alt="Magaly Abreu segurando uma ampulheta"
        />
      </section>

      <section className={styles.pillars}>
        <h2>Uma nova identidade exige uma nova estrutura.</h2>

        <div className={styles.pillarGrid}>
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <article key={pillar.title}>
                <Icon aria-hidden="true" />
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.programs} id="mentoria">
        <h2>Você recebe dois programas complementares.</h2>

        <div className={styles.programGrid}>
          <article>
            <Sparkles aria-hidden="true" />
            <h3>Mentoria A Última Cartada</h3>
            <p>6 meses de acompanhamento</p>
            <ul>
              <li>Desenvolvimento emocional</li>
              <li>Construção de hábitos</li>
              <li>Organização da rotina</li>
              <li>Clareza alimentar</li>
              <li>Exercícios práticos</li>
              <li>Comunidade de apoio</li>
            </ul>
            <Link className={styles.programLink} href="/public/consultoria">
              Ver página da consultoria
              <ChevronRight aria-hidden="true" />
            </Link>
          </article>

          <article>
            <Gift aria-hidden="true" />
            <span>Bônus exclusivo</span>
            <h3>Game Cartada Viva</h3>
            <p>21 dias de prática diária</p>
            <strong>
              Uma jornada prática com desafios, reflexões e pequenas ações para
              fortalecer consistência.
            </strong>
            <Link className={styles.programLink} href="/public/cartada-viva">
              Conhecer o Cartada Viva
              <ChevronRight aria-hidden="true" />
            </Link>
          </article>
        </div>
      </section>

      <section className={styles.herbalife} id="herbalife">
        <div>
          <span>Nutrição e rotina</span>
          <h2>Herbalife como apoio para escolhas mais consistentes.</h2>
          <p>
            Além da mentoria, Magaly também orienta o uso de produtos Herbalife
            como parte de uma rotina de cuidado possível: shakes, chás,
            hidratação e suplementação escolhidos de acordo com objetivos,
            hábitos e contexto individual.
          </p>
          <Link className={styles.secondaryButton} href="/public/herbilife">
            Conhecer a página Herbalife
            <ChevronRight aria-hidden="true" />
          </Link>
        </div>

        <img
          src="/landing/professional/acauamedia-114.jpg"
          alt="Magaly Abreu em consultoria sobre bem-estar"
        />
      </section>

      <section className={styles.testimonials} id="depoimentos">
        <h2>Mulheres que decidiram parar de recomeçar.</h2>

        <VideoTestimonials items={videoTestimonials} />
      </section>

      <section className={styles.finalCta} id="contato">
        <img
          src="/landing/professional/acauamedia-135.jpg"
          alt="Magaly Abreu em atendimento"
        />

        <div>
          <h2>Você não precisa começar mais uma segunda-feira do mesmo jeito.</h2>
          <p>
            Imagine olhar para sua vida daqui a seis meses e perceber que
            finalmente encontrou algo sustentável.
          </p>

          <div className={styles.microBenefits}>
            <span>
              <CheckCircle2 aria-hidden="true" /> Sem culpa.
            </span>
            <span>
              <CheckCircle2 aria-hidden="true" /> Sem efeito sanfona.
            </span>
            <span>
              <CheckCircle2 aria-hidden="true" /> Sem recomeços.
            </span>
          </div>

          <a className={styles.primaryButton} href={WHATSAPP_URL}>
            Quero dar minha última cartada
            <ChevronRight aria-hidden="true" />
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <a className={styles.brand} href="#top" aria-label="Magaly Abreu">
          <strong>Magaly Abreu</strong>
          <span>Mentoria</span>
        </a>

        <nav aria-label="Links do rodapé">
          <a href="#sobre">Sobre</a>
          <Link href="/public/consultoria">Consultoria</Link>
          <Link href="/public/cartada-viva">Cartada Viva</Link>
          <Link href="/public/herbilife">Herbalife</Link>
          <a href="#contato">Contato</a>
        </nav>

        <div className={styles.socialLinks}>
          <a href="https://instagram.com" aria-label="Instagram">
            <Camera aria-hidden="true" />
          </a>
          <a href={WHATSAPP_URL} aria-label="WhatsApp">
            <MessageCircle aria-hidden="true" />
          </a>
        </div>

        <small>© 2026 Magaly Abreu. Todos os direitos reservados.</small>
      </footer>
    </main>
  );
}
