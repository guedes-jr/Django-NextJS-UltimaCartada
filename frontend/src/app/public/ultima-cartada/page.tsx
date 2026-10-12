import { BarChart3, CheckCircle2, ChevronRight, Gamepad2, Heart, Layers3, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import PublicNavigation from "@/components/landing/PublicNavigation";
import styles from "./UltimaCartadaPage.module.css";

export const metadata: Metadata = {
  title: "Última Cartada | Método e mentoria com Magaly Abreu",
  description: "Conheça o Método Última Cartada, de Magaly Abreu, seus quatro pilares, as possibilidades de mentoria e a Cartada Viva, sua aplicação prática em forma de jogo.",
};
const WHATSAPP_URL = "https://wa.me/5584999181607?text=Olá,%20Magaly!%20Quero%20conhecer%20a%20mentoria%20do%20Método%20Última%20Cartada.";
function getCheckoutUrl(): string | null {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_URL ?? "");
    return url.protocol === "https:" && ["pay.hotmart.com", "checkout.hotmart.com", "go.hotmart.com"].includes(url.hostname) && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}
const pillars = [
  { title: "Corpo", suit: "♣", phrase: "Eu ajo", description: "Cultivar movimento e cuidado com o corpo, respeitando suas possibilidades e seu contexto.", example: "Na rotina: perceber como você está e encontrar um espaço possível para se movimentar." },
  { title: "Nutrição", suit: "♦", phrase: "Eu me nutro", description: "Desenvolver atenção à alimentação e às escolhas de cuidado que fazem parte da rotina.", example: "Na rotina: observar suas escolhas e organizar pequenos gestos de cuidado com a alimentação." },
  { title: "Mentalidade", suit: "♠", phrase: "Eu transformo", description: "Observar pensamentos e experiências, ampliar o autoconhecimento e ajustar a próxima escolha.", example: "Na rotina: fazer uma pausa para perceber pensamentos, contexto e possibilidades antes de agir." },
  { title: "Comunidade", suit: "♥", phrase: "Eu pertenço", description: "Construir vínculos e compartilhar o caminho com respeito ao ritmo e à privacidade de cada pessoa.", example: "Na rotina: oferecer apoio, pedir ajuda e participar de relações em que há espaço para escutar." },
];
const principles = [
  "Ações pequenas, possíveis e conectadas à vida real.",
  "Autoconhecimento para perceber o próprio contexto.",
  "Aprendizado contínuo, com espaço para ajustar e retomar.",
  "Autonomia para construir escolhas com mais intenção.",
];
const gameSteps = [
  { icon: Layers3, title: "A cartada do dia", text: "Uma proposta de ação convida a levar os pilares à rotina e registrar uma intenção." },
  { icon: Sparkles, title: "A prática cotidiana", text: "Você experimenta a proposta, respeitando suas possibilidades, e registra a experiência." },
  { icon: BarChart3, title: "O próprio progresso", text: "Histórico e acompanhamento por pilar ajudam a perceber o caminho percorrido." },
  { icon: Heart, title: "A experiência em grupo", text: "A convivência incentiva participação e pertencimento, com compartilhamento opcional." },
];

export default function UltimaCartadaPage() {
  const checkoutUrl = getCheckoutUrl();
  const participationUrl = checkoutUrl ?? WHATSAPP_URL;
  const participationLabel = checkoutUrl ? "Ver condições na Hotmart" : "Quero conhecer a mentoria";
  return (
    <main className={styles.page} id="top">
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Última Cartada — voltar à página inicial">
          <span className={styles.brandSymbol} aria-hidden="true">♠</span>
          <span className={styles.brandText}><strong>Última Cartada</strong><small>Metodologia de Magaly Abreu</small></span>
        </Link>
        <PublicNavigation id="metodo-navigation" label="Navegação da Última Cartada" className={styles.nav}>
          <a href="#ideia">A metodologia</a>
          <a href="#para-quem">Para quem</a>
          <a href="#telas">Os pilares</a>
          <a href="#processo">Na prática</a>
          <a href="#jogo">O jogo</a>
          <a href="#mentoria">A mentoria</a>
        </PublicNavigation>
      </header>

      <section className={styles.hero} aria-labelledby="metodo-title">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Método Última Cartada</span>
          <h1 id="metodo-title">Pequenas escolhas. Uma vida com mais intenção.</h1>
          <p>Uma metodologia para desenvolver hábitos, ampliar o autoconhecimento e cultivar autonomia nas escolhas do cotidiano.</p>
          <p>Corpo, nutrição, mentalidade e comunidade se encontram em um caminho de reflexão e prática, com respeito ao seu ritmo.</p>
          <div className={styles.actions}>
            <a className={styles.primaryButton} href="#mentoria">Conhecer a mentoria <ChevronRight aria-hidden="true" /></a>
            <a className={styles.secondaryButton} href="#ideia">Explorar a metodologia</a>
          </div>
        </div>
        <div className={styles.heroScreen}>
          <Image className={styles.founderImage} src="/landing/professional/acauamedia-130.jpg" alt="Magaly Abreu, criadora do Método Última Cartada, em retrato com fundo escuro" width={1200} height={1800} priority sizes="(max-width: 980px) 100vw, 50vw" />
          <p className={styles.photoCaption}>Magaly Abreu • Criadora do Método Última Cartada</p>
        </div>
      </section>

      <section className={styles.idea} id="ideia" aria-labelledby="idea-title">
        <div>
          <span className={styles.eyebrow}>01 / A metodologia</span>
          <h2 id="idea-title">Transformar intenção em uma prática possível.</h2>
          <p className={styles.methodDescription}>O Método Última Cartada propõe aproximar o que você deseja para a sua vida das escolhas que consegue fazer hoje. Reflexão, pequenas ações e aprendizado se conectam nos quatro pilares.</p>
          <p className={styles.methodDescription}>Observar o contexto, experimentar e ajustar a prática ajudam a construir um caminho próprio. Retomar também faz parte desse processo.</p>
        </div>
        <div className={styles.principles}>{principles.map((principle) => <article key={principle}><CheckCircle2 aria-hidden="true" /><p>{principle}</p></article>)}</div>
      </section>

      <section className={styles.audience} id="para-quem" aria-labelledby="audience-title">
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Para quem faz sentido</span>
          <h2 id="audience-title">Quando a vontade de mudar<br />encontra a vida como ela é.</h2>
          <p>A proposta se dirige a adultos que desejam desenvolver hábitos e ampliar o cuidado com o cotidiano. O ponto de partida é reconhecer o próprio momento e encontrar espaço para uma escolha possível.</p>
        </div>
        <div className={styles.audienceGrid}>
          <article><span>Mais clareza</span><h3>Você quer sair do automático.</h3><p>Perceber como o ambiente, a rotina e os vínculos influenciam suas escolhas pode ajudar a reconhecer o que merece atenção.</p></article>
          <article><span>Mais possibilidade</span><h3>Você procura um começo que caiba no dia.</h3><p>Um gesto concreto pode ser um ponto de partida para experimentar. A proposta considera suas condições reais e o que faz sentido agora.</p></article>
          <article><span>Mais continuidade</span><h3>Você quer construir seu próprio caminho.</h3><p>Aprender com a experiência, adaptar uma prática e retomar após uma pausa fazem parte do desenvolvimento de autonomia.</p></article>
        </div>
      </section>

      <section className={styles.screens} id="telas" aria-labelledby="pillars-title">
        <div className={styles.sectionHeader}><span className={styles.eyebrow}>02 / Os quatro pilares</span><h2 id="pillars-title">Diferentes dimensões.<br />Um cuidado que se conecta.</h2><p>Os pilares se complementam. A proposta é ampliar o olhar para o cotidiano e encontrar ações que façam sentido para o seu momento.</p></div>
        <div className={styles.screenList}>{pillars.map((pillar) => <article key={pillar.title}>
          <div className={styles.pillarVisual}><span aria-hidden="true">{pillar.suit}</span><strong>{pillar.phrase}</strong></div>
          <div><h3>{pillar.title}</h3><p>{pillar.description}</p><p className={styles.pillarExample}>{pillar.example}</p></div>
        </article>)}</div>
      </section>

      <section className={styles.process} id="processo" aria-labelledby="process-title">
        <div className={styles.sectionHeader}><span className={styles.eyebrow}>03 / Da reflexão à ação</span><h2 id="process-title">Um caminho que se constrói<br />na vida real.</h2><p>Uma forma de compreender a proposta do método: observar, experimentar e aprender com o que acontece no cotidiano.</p></div>
        <div className={styles.processGrid}>
          <article><span>01</span><h3>Olhar para o contexto</h3><p>Reconhecer o que você deseja cuidar e o que influencia suas escolhas: rotina, ambiente, possibilidades e vínculos.</p></article>
          <article><span>02</span><h3>Escolher uma ação possível</h3><p>Transformar uma intenção ampla em um gesto concreto, que encontre lugar no dia sem exigir uma rotina perfeita.</p></article>
          <article><span>03</span><h3>Experimentar e ajustar</h3><p>Observar a experiência, reconhecer o que ajudou e fazer ajustes. O aprendizado orienta a próxima escolha.</p></article>
        </div>
        <aside className={styles.returnNote}><Heart aria-hidden="true" /><div><h3>Retomar também é seguir.</h3><p>O ritmo pode mudar. Uma pausa não precisa apagar o caminho percorrido: o próximo passo pode começar no seu contexto de hoje.</p></div></aside>
      </section>

      <section className={styles.sharedJourney} aria-labelledby="shared-title">
        <div>
          <span className={styles.eyebrow}>Escolhas pessoais, caminho compartilhado</span>
          <h2 id="shared-title">Pertencer sem precisar<br />seguir o ritmo de todo mundo.</h2>
          <p>A comunidade é um dos pilares do método. Conviver em grupo oferece espaço para trocar experiências, escutar outras perspectivas e encontrar apoio ao longo da prática.</p>
          <p>O percurso continua sendo pessoal. Cada participante traz seu contexto, suas possibilidades e seus limites para a experiência.</p>
        </div>
        <div className={styles.sharedValues}>
          <article><Heart aria-hidden="true" /><div><h3>Respeito ao próprio ritmo</h3><p>Participar pode incluir observar, experimentar, ajustar e retomar. Há espaço para diferentes formas de viver a proposta.</p></div></article>
          <article><CheckCircle2 aria-hidden="true" /><div><h3>Compartilhamento por escolha</h3><p>Trocar experiências é um convite. O que é pessoal merece cuidado, e a participação não depende de expor reflexões ou evidências ao grupo.</p></div></article>
          <article><Sparkles aria-hidden="true" /><div><h3>Reconhecer o aprendizado</h3><p>Uma nova percepção, um ajuste na rotina e um pedido de apoio também podem fazer parte do caminho de desenvolvimento.</p></div></article>
        </div>
      </section>

      <section className={styles.features} id="jogo" aria-labelledby="game-title">
        <div className={styles.sectionHeader}>
          <Gamepad2 aria-hidden="true" />
          <span className={styles.gameEyebrow}>04 / Uma aplicação prática da metodologia</span>
          <h2 id="game-title">Cartada Viva: o método em forma de jogo.</h2>
          <p className={styles.gameDescription}>A Cartada Viva é a experiência educacional e gamificada do Método Última Cartada. Cartas convidam a pequenas ações que incentivam boas práticas do cotidiano nos quatro pilares.</p>
          <p className={styles.gameDescription}>A jornada é organizada em três jogos de 21 dias, combinando intenção, prática, registro e convivência em grupo. O jogo é uma forma de vivenciar a metodologia.</p>
        </div>
        <div className={styles.playerShowcase}>
          <div className={styles.playerCopy}><span className={styles.gameEyebrow}>Dentro da experiência</span><h3>Seu dia, sua cartada<br />e o seu percurso.</h3><p>A área do jogador reúne a jornada, a proposta do dia e os próximos passos. Você encontra espaço para registrar uma intenção e a experiência vivida.</p><p>O acompanhamento por pilar e o histórico ajudam a perceber o próprio progresso, preservando o que já foi construído.</p></div>
          <figure className={styles.playerFigure}><Image src="/landing/ultima-cartada/player-journey.svg" alt="Prévia ilustrativa da área do jogador com cartada diária, intenção, evidência e progresso por pilar" width={1280} height={920} sizes="(max-width: 980px) 100vw, 65vw" /><figcaption>Prévia ilustrativa da área do jogador, sem dados de participantes.</figcaption></figure>
        </div>
        <div className={styles.deckShowcase}>
          <div><span className={styles.gameEyebrow}>As cartas</span><h3>Um convite visual<br />para sair da intenção.</h3><p>Cada carta aproxima uma proposta de cuidado de uma ação concreta. Imagem e texto ajudam a compreender o convite e a levá-lo para o cotidiano.</p><p>As imagens ao lado fazem parte do material original do jogo. As propostas utilizadas em cada jornada são definidas conforme o conteúdo revisado e a orientação da facilitadora.</p><span className={styles.galleryHint}>Selecione uma carta para ver a imagem completa.</span></div>
          <div className={styles.deckGallery}>
            <figure><a href="/landing/ultima-cartada/carta-pausa.png" target="_blank" rel="noreferrer"><Image src="/landing/ultima-cartada/carta-pausa.png" alt="Carta do material original com uma proposta de pausa e atenção" width={720} height={1008} sizes="(max-width: 620px) 40vw, 260px" /></a><figcaption>Pausa e atenção</figcaption></figure>
            <figure><a href="/landing/ultima-cartada/carta-comunidade.png" target="_blank" rel="noreferrer"><Image src="/landing/ultima-cartada/carta-comunidade.png" alt="Carta do material original que convida ao apoio entre colegas" width={720} height={1008} sizes="(max-width: 620px) 40vw, 260px" /></a><figcaption>Apoio e pertencimento</figcaption></figure>
          </div>
        </div>
        <div className={styles.journeyTimeline} aria-label="Estrutura da jornada">
          <div><strong>3 jogos</strong><span>Etapas de uma mesma jornada</span></div><div><strong>21 dias por jogo</strong><span>Espaço para prática e aprendizado</span></div><div><strong>4 pilares</strong><span>Um olhar integrado para a rotina</span></div>
        </div>
        <div id="funciona" className={styles.featureGrid}>{gameSteps.map((step) => {
          const Icon = step.icon;
          return <article key={step.title}><Icon aria-hidden="true" /><h3>{step.title}</h3><p>{step.text}</p></article>;
        })}</div>
        <div className={styles.actions}>
          <Link className={styles.gameButton} href="/login">Já participo: acessar o jogo <ChevronRight aria-hidden="true" /></Link>
          <a className={styles.gameButton} href={WHATSAPP_URL} target="_blank" rel="noreferrer">Saber como participar</a>
        </div>
      </section>

      <section className={styles.founder} id="magaly" aria-labelledby="founder-title">
        <figure><Image src="/landing/professional/acauamedia-117.jpg" alt="Magaly Abreu em retrato sentada, com a mão próxima ao rosto" width={1800} height={1200} sizes="(max-width: 980px) 100vw, 45vw" /><figcaption>Magaly Abreu • Criadora do Método Última Cartada</figcaption></figure>
        <div>
          <span className={styles.eyebrow}>Quem dá direção à proposta</span>
          <h2 id="founder-title">Magaly Abreu.<br />Um olhar para a pessoa<br />e para o seu contexto.</h2>
          <p>Criadora do Método Última Cartada, Magaly reúne na proposta o desenvolvimento de hábitos, o autoconhecimento e a autonomia nas escolhas cotidianas.</p>
          <p>Na Cartada Viva, essa direção se traduz em propostas práticas e em uma experiência acompanhada por uma facilitadora. As cartas são um ponto de encontro entre reflexão, ação e aprendizado.</p>
          <p>Uma conversa inicial ajuda a conhecer a metodologia, esclarecer a dinâmica das jornadas e entender as possibilidades de participação.</p>
          <a className={styles.secondaryButton} href={WHATSAPP_URL} target="_blank" rel="noreferrer">Conversar com Magaly <ChevronRight aria-hidden="true" /></a>
        </div>
      </section>

      <section className={styles.mentorship} id="mentoria" aria-labelledby="mentorship-title">
        <div>
          <span className={styles.eyebrow}>Seu próximo passo</span>
          <h2 id="mentorship-title">Conheça a mentoria<br />do Método Última Cartada.</h2>
          <p>Você se reconheceu na proposta? Conheça as possibilidades de mentoria com Magaly e entenda como o método pode fazer parte do seu momento.</p>
          <p>A Cartada Viva é uma aplicação prática da metodologia. Sua participação no jogo deve ser confirmada nas condições da modalidade escolhida.</p>
        </div>
        <div className={styles.participationCard}>
          <h3>Uma escolha com clareza.</h3>
          <p>Antes de decidir, conheça o formato dos encontros, o período de acompanhamento, os materiais, o investimento e as condições de participação.</p>
          <a className={styles.primaryButton} href={participationUrl} target="_blank" rel="noopener noreferrer">{participationLabel} <ChevronRight aria-hidden="true" /></a>
          <p className={styles.participationNote}>{checkoutUrl ? "Consulte a oferta e suas condições antes de concluir a compra na Hotmart." : "Converse pelo WhatsApp para esclarecer suas dúvidas e conhecer as possibilidades de participação."}</p>
        </div>
      </section>

      <section className={styles.questions} aria-labelledby="questions-title">
        <div className={styles.sectionHeader}><span className={styles.eyebrow}>Antes de começar</span><h2 id="questions-title">Para conhecer melhor<br />a proposta.</h2></div>
        <div className={styles.questionList}>
          <details><summary>Qual é a relação entre Última Cartada e Cartada Viva?</summary><p>Última Cartada é a metodologia. Cartada Viva é sua aplicação educacional em forma de jogo, com propostas diárias e uma experiência em grupo.</p></details>
          <details><summary>Preciso manter uma rotina perfeita?</summary><p>A proposta considera a vida real e as possibilidades de cada pessoa. Observar, ajustar e retomar fazem parte do caminho.</p></details>
          <details><summary>O jogo está incluído na mentoria?</summary><p>A Cartada Viva é uma aplicação do método. A inclusão do jogo, o acesso à plataforma e os materiais dependem da modalidade contratada. Confirme esses itens antes de participar.</p></details>
          <details><summary>Como funcionam os encontros e o investimento?</summary><p>Consulte o formato, a agenda, o período de acompanhamento, o investimento e as condições da oferta com Magaly antes de tomar sua decisão.</p></details>
          <details><summary>Como conhecer as possibilidades de participação?</summary><p>Converse com Magaly para entender a proposta, as jornadas e as condições de participação. Quem já participa acessa a plataforma pelo botão do jogo.</p></details>
        </div>
      </section>

      <section className={styles.finalCta} id="contato">
        <div><h2>Qual cuidado você quer trazer para o seu cotidiano?</h2><p>Conheça a mentoria do Método Última Cartada e esclareça as condições para começar com uma escolha consciente.</p></div>
        <a className={styles.primaryButton} href={participationUrl} target="_blank" rel="noopener noreferrer">{participationLabel} <ChevronRight aria-hidden="true" /></a>
      </section>
      <footer className={styles.methodFooter}>
        <Link href="/">Voltar à página inicial</Link>
        <nav className={styles.footerLinks} aria-label="Informações legais"><Link href="/terms">Termos de uso</Link><Link href="/privacy">Privacidade</Link></nav>
        <p>A Cartada Viva é uma aplicação educacional para o desenvolvimento de hábitos. Não substitui acompanhamento psicológico, nutricional ou médico.</p>
      </footer>
    </main>
  );
}
