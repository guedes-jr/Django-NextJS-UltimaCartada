import { ArrowUpRight, CheckCircle2, ChevronRight, Footprints, Leaf, MessageCircle, Sparkles, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import PublicNavigation from "@/components/landing/PublicNavigation";
import VideoTestimonials from "@/components/landing/VideoTestimonials";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Método Última Cartada | Hábitos, escolhas e autonomia",
  description: "Conheça o Método Última Cartada, de Magaly Abreu: pequenas ações para o cotidiano em quatro pilares. A Cartada Viva é sua aplicação prática em grupo.",
};

const WHATSAPP_URL = "https://wa.me/5584999181607?text=Olá,%20Magaly!%20Quero%20conhecer%20o%20Método%20Última%20Cartada.";
const pillars = [
  { suit: "♣", phrase: "Eu ajo", title: "Corpo", icon: Footprints, description: "Criar espaço para o movimento e o cuidado com o corpo, respeitando suas possibilidades." },
  { suit: "♦", phrase: "Eu me nutro", title: "Nutrição", icon: Leaf, description: "Cultivar atenção à alimentação e às escolhas que fazem parte da sua rotina." },
  { suit: "♠", phrase: "Eu transformo", title: "Mentalidade", icon: Sparkles, description: "Observar pensamentos, aprender com a experiência e encontrar novas formas de agir." },
  { suit: "♥", phrase: "Eu pertenço", title: "Comunidade", icon: Users, description: "Construir vínculos e compartilhar o caminho, com respeito ao ritmo de cada pessoa." },
];
const steps = [
  { number: "01", title: "Perceber", text: "Olhar para a sua rotina e reconhecer o que você quer cuidar, sem transformar cada dificuldade em um julgamento." },
  { number: "02", title: "Escolher", text: "Encontrar uma ação pequena e possível, alinhada ao seu momento e às condições do seu dia." },
  { number: "03", title: "Praticar", text: "Experimentar na vida real, observar o que funcionou e ajustar o caminho para continuar." },
];
const videoTestimonials = [
  { name: "Emanuel", label: "Depoimento de Emanuel", src: "/testimonials/emanuel.m4v", type: "video/x-m4v", poster: "/landing/professional/acauamedia-131.jpg" },
  { name: "Erica Meirelles", label: "Depoimento de Erica Meirelles", src: "/testimonials/erica.m4v", type: "video/x-m4v", poster: "/landing/professional/acauamedia-114.jpg" },
];

export default function HomePage() {
  return (
    <main className={styles.page} id="top">
      <header className={styles.header}>
        <a href="#top" className={styles.brand} aria-label="Método Última Cartada — início">
          <span className={styles.brandSymbol} aria-hidden="true">♠</span>
          <span><strong>Última Cartada</strong><small>Método de Magaly Abreu</small></span>
        </a>
        <PublicNavigation id="landing-navigation" label="Navegação principal" className={styles.nav}>
          <a href="#sobre">O método</a>
          <a href="#pilares">Os pilares</a>
          <a href="#mentoria">Na prática</a>
          <a href="#depoimentos">Experiências</a>
          <a href="#contato">Contato</a>
        </PublicNavigation>
        <Link className={styles.loginLink} href="/login">Entrar</Link>
      </header>

      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Método Última Cartada</span>
          <h1 id="hero-title">Pequenas escolhas.<br /><em>Uma vida com mais intenção.</em></h1>
          <p className={styles.lead}>Um caminho para desenvolver hábitos, ampliar o autoconhecimento e cultivar autonomia nas escolhas do cotidiano.</p>
          <p>Cuidar do corpo, da alimentação, da mentalidade e dos vínculos começa com ações que cabem na sua vida real.</p>
          <div className={styles.actions}>
            <a className={styles.primaryButton} href="#sobre">Conhecer o método <ChevronRight aria-hidden="true" /></a>
            <a className={styles.textLink} href="#mentoria">Descobrir a Cartada Viva <ArrowUpRight aria-hidden="true" /></a>
          </div>
          <div className={styles.heroNotes}><span>Pequenos passos</span><span>Aprendizado contínuo</span><span>Seu próprio ritmo</span></div>
        </div>
        <div className={styles.heroVisual}>
          <Image src="/landing/professional/acauamedia-131.jpg" alt="Magaly Abreu, criadora do Método Última Cartada" width={720} height={880} priority sizes="(max-width: 980px) 100vw, 45vw" />
          <div className={styles.photoCaption}><span>Uma escolha de cada vez</span><strong>O cotidiano é o lugar da mudança.</strong></div>
        </div>
      </section>

      <section className={styles.method} id="sobre" aria-labelledby="method-title">
        <div className={styles.sectionIntro}>
          <span className={styles.eyebrow}>A metodologia</span>
          <h2 id="method-title">Transformar intenção<br />em uma prática possível.</h2>
        </div>
        <div className={styles.methodCopy}>
          <p>O Método Última Cartada reúne construção de hábitos, autoconhecimento e autonomia. Sua proposta é aproximar o que você deseja para a sua vida das escolhas que consegue fazer hoje.</p>
          <p>O caminho combina reflexão e pequenas ações nos quatro pilares. A experiência de cada dia ajuda a perceber o contexto, ajustar a prática e continuar aprendendo.</p>
          <div className={styles.methodNote}><CheckCircle2 aria-hidden="true" /><p>O ritmo pode mudar. Retomar também faz parte do processo.</p></div>
        </div>
      </section>

      <section className={styles.pillars} id="pilares" aria-labelledby="pillars-title">
        <div className={styles.sectionIntro}><span className={styles.eyebrow}>Quatro pilares, uma vida integrada</span><h2 id="pillars-title">O cuidado acontece<br />em diferentes dimensões.</h2></div>
        <div className={styles.pillarGrid}>
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return <article key={pillar.title}><span className={styles.suit} aria-hidden="true">{pillar.suit}</span><span className={styles.pillarPhrase}>{pillar.phrase}</span><Icon aria-hidden="true" /><h3>{pillar.title}</h3><p>{pillar.description}</p></article>;
          })}
        </div>
      </section>

      <section className={styles.practice} id="processo" aria-labelledby="practice-title">
        <div className={styles.sectionIntro}><span className={styles.eyebrow}>Da intenção ao cotidiano</span><h2 id="practice-title">Começar pequeno.<br />Observar. Ajustar. Continuar.</h2><p>Uma forma simples de compreender a proposta do método no dia a dia.</p></div>
        <div className={styles.stepGrid}>{steps.map((step) => <article key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
      </section>

      <section className={styles.application} id="mentoria" aria-labelledby="application-title">
        <div className={styles.applicationCopy}>
          <span className={styles.eyebrow}>Uma aplicação prática do método</span>
          <h2 id="application-title">Cartada Viva.<br /><em>A metodologia em movimento.</em></h2>
          <p>A Cartada Viva é a experiência educacional e gamificada do Método Última Cartada. Cartas propõem pequenas ações para levar os quatro pilares à rotina, em uma jornada vivida em grupo.</p>
          <p>A proposta combina intenção, prática e reflexão. O registro das experiências ajuda a acompanhar o próprio caminho; o grupo oferece um espaço de participação e pertencimento.</p>
          <Link className={styles.lightButton} href="/public/cartada-viva">Conhecer a aplicação prática <ChevronRight aria-hidden="true" /></Link>
        </div>
        <div className={styles.applicationCards} aria-label="Os quatro pilares na Cartada Viva">
          {pillars.map((pillar) => <div key={pillar.title}><span aria-hidden="true">{pillar.suit}</span><strong>{pillar.phrase}</strong><small>{pillar.title}</small></div>)}
          <p>O método dá direção.<br />A prática encontra lugar no seu dia.</p>
        </div>
      </section>

      <section className={styles.founder} id="magaly" aria-labelledby="founder-title">
        <Image src="/landing/professional/acauamedia-126.jpg" alt="Magaly Abreu" width={780} height={580} sizes="(max-width: 980px) 100vw, 45vw" />
        <div><span className={styles.eyebrow}>Quem está por trás do método</span><h2 id="founder-title">Magaly Abreu</h2><p>Psicóloga e criadora do Método Última Cartada, Magaly propõe um olhar para o desenvolvimento de hábitos que considera a pessoa, seu contexto e suas possibilidades.</p><p>Autoconhecimento, práticas cotidianas e apoio em grupo se encontram nessa proposta de desenvolvimento pessoal.</p><a className={styles.textLink} href={WHATSAPP_URL}>Conversar com Magaly <ArrowUpRight aria-hidden="true" /></a></div>
      </section>

      <section className={styles.testimonials} id="depoimentos" aria-labelledby="testimonials-title">
        <div className={styles.sectionIntro}><span className={styles.eyebrow}>Experiências compartilhadas</span><h2 id="testimonials-title">Conheça quem já caminhou com Magaly.</h2><p>Cada experiência é pessoal e cada percurso tem seu próprio ritmo.</p></div>
        <VideoTestimonials items={videoTestimonials} />
      </section>

      <section className={styles.finalCta} id="contato" aria-labelledby="contact-title">
        <span className={styles.eyebrow}>Sua próxima escolha</span><h2 id="contact-title">Qual cuidado você quer<br />trazer para o seu cotidiano?</h2><p>Converse com Magaly para conhecer o Método Última Cartada e entender como a Cartada Viva pode fazer parte do seu caminho.</p><a className={styles.primaryButton} href={WHATSAPP_URL}>Quero conhecer o método <MessageCircle aria-hidden="true" /></a>
      </section>

      <footer className={styles.footer}>
        <a href="#top" className={styles.brand}><span className={styles.brandSymbol} aria-hidden="true">♠</span><span><strong>Última Cartada</strong><small>Escolhas que viram prática</small></span></a>
        <nav aria-label="Links do rodapé"><a href="#sobre">O método</a><Link href="/public/cartada-viva">Cartada Viva</Link><Link href="/public/consultoria">Consultoria</Link><Link href="/player/support">Suporte</Link><Link href="/terms">Termos</Link><Link href="/privacy">Privacidade</Link></nav>
        <p>A Cartada Viva é uma experiência educacional de desenvolvimento de hábitos. Não substitui acompanhamento psicológico, nutricional ou médico.</p>
        <small>© 2026 Magaly Abreu. Todos os direitos reservados.</small>
      </footer>
    </main>
  );
}
