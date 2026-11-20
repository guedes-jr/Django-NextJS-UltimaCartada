import { ConsultoriaPublicPage } from "@/components/consultoria/ConsultoriaPublicPage";
import { isConsultoriaSiteEnabled } from "@/components/consultoria/release";
import { getConsultoriaMetadata } from "@/components/consultoria/metadata";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Gift,
  HeartPulse,
  Leaf,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import PublicNavigation from "@/components/landing/PublicNavigation";
import styles from "./page.module.css";

const legacyMetadata: Metadata = {
  title: "Magaly Abreu | A Última Cartada",
  description:
    "Uma proposta para mulheres cansadas de tantas tentativas de mudança, que desejam desenvolver hábitos saudáveis, compreender suas escolhas e recuperar a confiança em si mesmas.",
};

export function generateMetadata(): Metadata {
  return isConsultoriaSiteEnabled() ? getConsultoriaMetadata("home") : legacyMetadata;
}

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
  "Percebe que emoções influenciam suas escolhas.",
  "Sente culpa depois de comer.",
  "Coloca todos em primeiro lugar e esquece de si.",
  "Deseja voltar a confiar em si e no seu caminho.",
];

const pillars = [
  {
    icon: HeartPulse,
    title: "Mentalidade e emoções",
    description:
      "Observar pensamentos, padrões e contextos que influenciam suas escolhas.",
  },
  {
    icon: Leaf,
    title: "Alimentação e cotidiano",
    description:
      "Olhar com atenção para escolhas de alimentação que façam sentido na vida real.",
  },
  {
    icon: CalendarDays,
    title: "Rotina e hábitos",
    description:
      "Pequenas ações diárias que geram grandes transformações ao longo do tempo.",
  },
  {
    icon: Sparkles,
    title: "Autonomia e continuidade",
    description:
      "Construir mais autonomia para observar, ajustar e continuar cuidando de si.",
  },
];

export default function HomePage() {
  if (isConsultoriaSiteEnabled()) return <ConsultoriaPublicPage page="home" />;
  return (
    <main className={styles.page} id="top">
      <header className={styles.header}>
        <a className={styles.brand} href="#top" aria-label="Cartada Viva">
          <Image
            src="/cartada-viva-mark.png"
            alt=""
            width={56}
            height={56}
            priority
          />
          <span className={styles.brandName}>Magaly Abreu</span>
        </a>

        <PublicNavigation id="landing-navigation" label="Navegação principal" className={styles.nav}>
          <a href="#sobre">Sobre</a>
          <Link href="/public/ultima-cartada">A Última Cartada</Link>
          <Link href="/public/cartada-viva">Cartada Viva</Link>
          <Link href="/public/herbilife">Herbalife</Link>
          <a href="#contato">Contato</a>
        </PublicNavigation>

        <Link className={styles.loginLink} href="/login">
          Entrar
        </Link>
      </header>

      <section className={styles.hero} id="sobre">
        <div className={styles.heroCopy}>
          <h1>
            Você não precisa se culpar para voltar a cuidar de si.
          </h1>

          <p className={styles.heroSubtitle}>
            Uma proposta para mulheres cansadas de tantas tentativas de mudança,
            que desejam desenvolver hábitos saudáveis, compreender suas escolhas
            e recuperar a confiança em si mesmas.
          </p>

          <div className={styles.heroBenefits}>
            <article>
              <CalendarDays aria-hidden="true" />
              <div>
                <strong>A Última Cartada</strong>
                <span>uma proposta de reflexão e prática para o cotidiano</span>
              </div>
            </article>

            <article>
              <Gift aria-hidden="true" />
              <div>
                <strong>Cartada Viva</strong>
                <span>uma aplicação educacional do método em forma de jogo</span>
              </div>
            </article>

            <article>
              <Users aria-hidden="true" />
              <div>
                <strong>Para mulheres</strong>
                <span>
                  que já tentaram várias dietas, mas ainda se sentem presas à
                  ansiedade, à culpa e ao ciclo de recomeçar sempre.
                </span>
              </div>
            </article>
          </div>

          <a className={styles.primaryButton} href="#mentoria">
            Conhecer A Última Cartada
            <ChevronRight aria-hidden="true" />
          </a>
        </div>

        <div className={styles.heroVisual}>
          <Image
            src="/landing/professional/acauamedia-131.jpg"
            alt="Magaly Abreu"
            width={1800}
            height={1200}
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          <blockquote>
            <span>“</span>
            A mente muda, o corpo flui.
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
            Saber o que fazer nem sempre significa conseguir fazer. Pensamentos,
            emoções e circunstâncias da vida podem influenciar nossas escolhas.
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

        <Image
          src="/landing/professional/acauamedia-126.jpg"
          alt="Magaly Abreu segurando uma ampulheta"
          width={1800}
          height={1200}
          sizes="(max-width: 900px) 100vw, 60vw"
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
        <h2>Conheça A Última Cartada e a Cartada Viva.</h2>

        <div className={styles.programGrid}>
          <article>
            <Sparkles aria-hidden="true" />
            <h3>Mentoria A Última Cartada</h3>
            <p>Uma proposta para compreender escolhas e desenvolver hábitos possíveis.</p>
            <ul>
              <li>Autoconhecimento e reflexão</li>
              <li>Hábitos possíveis</li>
              <li>Escolhas no cotidiano</li>
              <li>Aprendizado com as dificuldades</li>
            </ul>
            <Link className={styles.programLink} href="/public/ultima-cartada">
              Conhecer A Última Cartada
              <ChevronRight aria-hidden="true" />
            </Link>
          </article>

          <article>
            <Gift aria-hidden="true" />
            <h3>Game Cartada Viva</h3>
            <p>Uma experiência educacional e gamificada.</p>
            <strong>
              Quem participa da Mentoria A Última Cartada tem direito de
              participar do Game Cartada Viva, com cartadas, reflexões e
              pequenas ações no cotidiano.
            </strong>
            <Link className={styles.programLink} href="/public/ultima-cartada">
              Conhecer o método e o jogo
              <ChevronRight aria-hidden="true" />
            </Link>
          </article>
        </div>
      </section>

      <section className={styles.herbalife} id="herbalife">
        <div>
          <span>Atividade comercial separada</span>
          <h2>Produtos Herbalife: informação comercial em página própria.</h2>
          <p>
            A atividade de consultora independente Herbalife é separada de A
            Última Cartada e da Cartada Viva. A página comercial explica o
            cadastro e a compra de produtos, sem exigir aquisição para
            participar da mentoria ou do game.
          </p>
          <Link className={styles.secondaryButton} href="/public/herbilife">
            Conhecer a página Herbalife
            <ChevronRight aria-hidden="true" />
          </Link>
        </div>

        <Image
          src="/landing/professional/acauamedia-114.jpg"
          alt="Magaly Abreu em consultoria sobre bem-estar"
          width={1800}
          height={1200}
          sizes="(max-width: 900px) 100vw, 45vw"
        />
      </section>

      <section className={styles.finalCta} id="contato">
        <Image
          src="/landing/professional/acauamedia-135.jpg"
          alt="Magaly Abreu em atendimento"
          width={1800}
          height={1200}
          sizes="(max-width: 900px) 100vw, 45vw"
        />

        <div>
          <h2>Você não precisa começar mais uma segunda-feira do mesmo jeito.</h2>
          <p>
            Mais consciência para fazer escolhas possíveis, aprender com as
            dificuldades e continuar cuidando de si.
          </p>

          <div className={styles.microBenefits}>
            <span>
              <CheckCircle2 aria-hidden="true" /> Mais consciência.
            </span>
            <span>
              <CheckCircle2 aria-hidden="true" /> Escolhas possíveis.
            </span>
            <span>
              <CheckCircle2 aria-hidden="true" /> Continuidade no cuidado.
            </span>
          </div>

          <Link className={styles.primaryButton} href="/public/ultima-cartada#condicoes">
            Conhecer as condições de participação
            <ChevronRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <a className={styles.brand} href="#top" aria-label="Cartada Viva">
          <Image
            src="/cartada-viva-mark.png"
            alt="Cartada Viva"
            width={220}
            height={220}
          />
        </a>

        <nav aria-label="Links do rodapé">
          <a href="#sobre">Sobre</a>
          <Link href="/public/ultima-cartada">A Última Cartada</Link>
          <Link href="/public/herbilife">Herbalife</Link>
          <Link href="/player/support">Suporte</Link>
          <Link href="/terms">Termos</Link>
          <Link href="/privacy">Privacidade</Link>
          <a href="#contato">Contato</a>
        </nav>

        <small>© 2026 Magaly Abreu. Todos os direitos reservados.</small>
      </footer>
    </main>
  );
}
