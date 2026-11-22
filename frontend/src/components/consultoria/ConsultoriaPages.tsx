import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CircleCheck, Heart, Leaf, MessageCircle, MoveUpRight } from "lucide-react";
import { ActionLink, Contact, Hero, Inclusion, OfferConditions, Questions, SectionHeading } from "./ConsultoriaSections";
import { consultoria, previewRoutes, type ConsultoriaRoutes } from "./content";
import styles from "./Consultoria.module.css";

const pillars = [
  { icon: Heart, title: "Corpo", description: "Perceber suas possibilidades e cultivar gestos de cuidado no cotidiano." },
  { icon: Leaf, title: "Nutrição", description: "Olhar com atenção para a alimentação e as escolhas que fazem parte da rotina." },
  { icon: BookOpen, title: "Mentalidade", description: "Observar pensamentos, ampliar o autoconhecimento e aprender com a experiência." },
  { icon: MessageCircle, title: "Comunidade", description: "Encontrar pertencimento, com respeito ao próprio ritmo e à privacidade." },
];

function Pillars() {
  return <section className={styles.section}><SectionHeading eyebrow="Uma abordagem que se conecta" title="O cuidado tem mais de uma dimensão.">Corpo, nutrição, mentalidade e comunidade ajudam a olhar para os hábitos dentro da vida que você vive.</SectionHeading><div className={styles.pillars}>{pillars.map(({ icon: Icon, title, description }) => <article key={title}><Icon size={25} strokeWidth={1.4} aria-hidden="true" /><h3>{title}</h3><p>{description}</p></article>)}</div></section>;
}

export function ConsultoriaHome({ routes = previewRoutes }: { routes?: ConsultoriaRoutes } = {}) {
  return <>
    <Hero eyebrow="Magaly Abreu · Psicóloga e Mentora" title={<>Você não precisa se culpar<br /><em>para voltar a cuidar de si.</em></>} description="Uma proposta para mulheres cansadas de tantas tentativas de mudança, que desejam desenvolver hábitos saudáveis, compreender suas escolhas e recuperar a confiança em si mesmas." footnote="A mente muda, o corpo flui.">
      <ActionLink href={routes.mentorship}>Conhecer A Última Cartada</ActionLink>
      <Link className={styles.textLink} href={routes.game}>Conhecer o Game Cartada Viva <ArrowRight size={18} aria-hidden="true" /></Link>
    </Hero>
    <section className={`${styles.section} ${styles.editorial}`}>
      <p className={styles.eyebrow}>Um novo olhar para a continuidade</p>
      <div><h2>Você não precisa de uma rotina perfeita para dar o próximo passo.</h2><p>Começar, interromper, tentar de novo. Quando esse ciclo se repete, pode ficar difícil confiar na própria capacidade de continuar.</p><p>A proposta é olhar para o seu contexto com mais consciência. Experimentar ações possíveis, aprender com o caminho e reconhecer que retomar também faz parte dele.</p></div>
    </section>
    <section className={`${styles.section} ${styles.offers}`} id="experiencias">
      <SectionHeading eyebrow="Acompanhamento e prática" title="Duas experiências. Um caminho conectado.">A mentoria é a proposta principal. O game faz parte dessa experiência e leva a prática de hábitos para o cotidiano.</SectionHeading>
      <div className={styles.offerGrid}>
        <article className={styles.mentorshipOffer}><span className={styles.eyebrow}>A oferta principal</span><h3>A Última Cartada<span>Mentoria</span></h3><p>Um espaço de acompanhamento com Magaly Abreu para ampliar a consciência sobre suas escolhas e trabalhar a construção de hábitos.</p><p className={styles.offerNote}>Inclui a experiência do Game Cartada Viva.</p><ActionLink href={routes.mentorship}>Conhecer a mentoria</ActionLink></article>
        <article className={styles.gameOffer}><div className={styles.gameMark}><Image src="/cartada-viva-mark.png" alt="Símbolo original do Cartada Viva" width={100} height={100} /></div><span className={styles.eyebrow}>Incluído na mentoria</span><h3>Cartada Viva<span>Game</span></h3><p>Cartadas, pequenas ações e registros para perceber o próprio percurso na prática diária de hábitos.</p><Link className={styles.textLink} href={routes.game}>Quero conhecer o game <ArrowRight size={18} aria-hidden="true" /></Link></article>
      </div>
    </section>
    <section className={styles.quote}><p>Uma interrupção não define todo o seu percurso.</p><blockquote>{consultoria.symbolicPhrase}</blockquote><span>Magaly Abreu</span></section>
    <section className={`${styles.section} ${styles.about}`} id="magaly"><figure><Image src="/landing/professional/acauamedia-117.jpg" alt="Magaly Abreu sentada em poltrona amarela, com a mão próxima ao rosto" width={1800} height={1200} sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1296px) 45vw, 570px" /><figcaption>Magaly Abreu · Psicóloga e Mentora</figcaption></figure><div><p className={styles.eyebrow}>Conheça Magaly Abreu</p><h2>Uma trajetória de cuidado,<br />autonomia e consciência.</h2><p>Sou Magaly Abreu, psicóloga, com formação original em Fisioterapia e uma trajetória de mais de 30 anos no trabalho com saúde, bem-estar, orientação de pessoas e empreendedorismo.</p><p>Ao longo dessa caminhada, compreendi que cuidar do corpo envolve muito mais do que conhecer regras e recomendações. Pensamentos, emoções, hábitos, vínculos e a maneira como nos tratamos também influenciam nossas escolhas.</p><p>Depois de muitos anos de experiência profissional, decidi aprofundar esses conhecimentos por meio da Psicologia.</p><p>Hoje, meu propósito é compartilhar essa experiência para ajudar mulheres a desenvolverem hábitos possíveis, fortalecerem sua autonomia e construírem uma relação mais consciente consigo mesmas.</p><p>Acredito que cuidar de si não deve significar viver em guerra com o próprio corpo.</p><p><strong>Magaly Abreu · Psicóloga · CRP 17/5894</strong></p><Link className={styles.textLink} href={`${routes.mentorship}#condicoes`}>Conhecer as condições de participação <ArrowRight size={18} aria-hidden="true" /></Link></div></section>
    <Questions /><Contact routes={routes} />
  </>;
}

export function ConsultoriaMentorship({ routes = previewRoutes }: { routes?: ConsultoriaRoutes } = {}) {
  return <>
    <Hero eyebrow="A Última Cartada — Mentoria" title={<>Um caminho para mudar.<br /><em>Com espaço para continuar.</em></>} description="A mentoria de Magaly Abreu para mulheres que desejam ampliar a consciência sobre suas escolhas e trabalhar hábitos possíveis no cotidiano." caption="A Última Cartada · Uma mentoria de Magaly Abreu">
      <ActionLink href="#condicoes">Conhecer as condições de participação</ActionLink><Link className={styles.textLink} href="#game-incluido">O game está incluído <ArrowRight size={18} aria-hidden="true" /></Link>
    </Hero>
    <section className={`${styles.section} ${styles.editorial}`}><p className={styles.eyebrow}>Para quem essa conversa faz sentido</p><div><h2>Para a mulher que deseja voltar a confiar no próprio caminho.</h2><p>Se você vive entre a vontade de mudar e a dificuldade de manter, a proposta é encontrar espaço para compreender seu contexto e experimentar uma próxima escolha possível.</p><ul className={styles.checkList}><li><CircleCheck size={19} aria-hidden="true" />Perceber padrões sem transformar cada interrupção em culpa.</li><li><CircleCheck size={19} aria-hidden="true" />Trabalhar pequenas ações dentro das suas possibilidades.</li><li><CircleCheck size={19} aria-hidden="true" />Construir autonomia para observar, ajustar e retomar.</li></ul></div></section>
    <Pillars />
    <section className={`${styles.section} ${styles.process}`}><SectionHeading eyebrow="Da reflexão ao cotidiano" title="Consciência que encontra a prática.">A abordagem sustenta o acompanhamento e a experiência do game. O formato, a duração e as condições da mentoria são esclarecidos antes da participação.</SectionHeading><ol className={styles.processList}><li><span>01</span><h3>Olhar para o contexto</h3><p>Reconhecer sua rotina, o que merece cuidado e as condições que influenciam as suas escolhas.</p></li><li><span>02</span><h3>Experimentar o possível</h3><p>Aproximar reflexão e ação com práticas que encontrem lugar no seu cotidiano.</p></li><li><span>03</span><h3>Aprender e ajustar</h3><p>Observar a experiência, perceber o que ajudou e encontrar uma próxima escolha, inclusive depois de uma pausa.</p></li></ol></section>
    <div id="game-incluido"><Inclusion routes={routes} /></div>
    <OfferConditions />
    <Questions /><Contact routes={routes} />
  </>;
}

export function ConsultoriaGame({ routes = previewRoutes }: { routes?: ConsultoriaRoutes } = {}) {
  return <>
    <section className={`${styles.hero} ${styles.gameHero}`}><div className={styles.heroCopy}><p className={styles.eyebrow}>Cartada Viva — Game</p><h1>Uma cartada.<br />Uma prática.<br /><em>O seu percurso.</em></h1><p className={styles.heroDescription}>Um game educativo de hábitos que convida a levar consciência, pequenas ações e aprendizado para a vida real.</p><div className={styles.actions}><ActionLink href="#como-funciona">Quero conhecer o game</ActionLink><Link className={styles.textLink} href="/login">Já participo: entrar na minha área <MoveUpRight size={18} aria-hidden="true" /></Link></div><p className={styles.heroFootnote}>Uma experiência incluída na Mentoria A Última Cartada.</p></div><div className={styles.gameVisual}><Image className={styles.gameOriginalMark} src="/cartada-viva-mark.png" alt="Símbolo original do Game Cartada Viva, preservado em preto e dourado" width={245} height={245} priority /><p>Cartada Viva<span>Game</span></p><span className={styles.gameVisualCaption}>Consciência, prática e pertencimento.</span></div></section>
    <section className={styles.section} id="como-funciona"><SectionHeading eyebrow="O game na prática" title="Da intenção a uma ação possível.">Na jornada diária, a proposta do dia convida você a experimentar e registrar o próprio caminho. O percurso disponível depende da jornada vinculada ao seu grupo.</SectionHeading><ol className={styles.processList}><li><span>01</span><h3>Conheça a cartada</h3><p>Veja a proposta liberada para o dia e sua conexão com os pilares de hábitos.</p></li><li><span>02</span><h3>Experimente e registre</h3><p>Registre uma intenção ou a experiência vivida, com os recursos disponíveis na sua jornada.</p></li><li><span>03</span><h3>Perceba o percurso</h3><p>Consulte o histórico e o progresso por pilar para observar sua participação ao longo da jornada.</p></li></ol></section>
    <section className={`${styles.section} ${styles.showcase}`}><div><p className={styles.eyebrow}>Um olhar para o próprio progresso</p><h2>Seu dia, sua prática.<br />Um histórico para acompanhar.</h2><p>A área da participante reúne a cartada diária, o espaço para intenção e evidência e os registros do caminho percorrido.</p><p>Na jornada diária, os registros pessoais são privados e têm acesso autorizado. A convivência na comunidade acontece em um espaço próprio.</p></div><figure><Image src="/consultoria/player-journey.svg" alt="Prévia ilustrativa da área da participante, com cartada diária, intenção, evidência e progresso por pilar" width={1280} height={920} sizes="(max-width: 980px) calc(100vw - 32px), (max-width: 1296px) 60vw, 700px" /><figcaption>Prévia ilustrativa do sistema existente, sem dados de participantes. A aparência final depende da homologação visual.</figcaption><a className={styles.textLink} href="/consultoria/player-journey.svg" target="_blank" rel="noopener noreferrer">Ampliar ilustração (nova aba) <MoveUpRight size={18} aria-hidden="true" /></a></figure></section>
    <section className={styles.section}><SectionHeading eyebrow="A experiência do seu grupo" title="Conheça o percurso antes de começar.">Na experiência por rodadas, você escolhe uma carta disponível e envia a evidência no prazo informado. Na jornada diária, acompanha a proposta liberada para o dia, a intenção e os registros. Confirme com Magaly quais percursos e condições fazem parte da sua participação.</SectionHeading></section>
    <Pillars />
    <aside className={styles.inclusion}><span className={styles.inclusionLabel}>Conectado à mentoria</span><h2>A prática faz parte<br />de uma experiência maior.</h2><p>{consultoria.inclusion}</p><Link className={styles.textLink} href={routes.mentorship}>Conhecer a Mentoria A Última Cartada <ArrowRight size={18} aria-hidden="true" /></Link></aside>
    <OfferConditions game />
    <Questions game /><Contact game routes={routes} />
  </>;
}
