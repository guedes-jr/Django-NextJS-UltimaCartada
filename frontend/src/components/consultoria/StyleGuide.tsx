import Image from "next/image";
import Link from "next/link";
import { DialogExamples } from "./DialogExamples";
import { ConsultoriaAccessTheme } from "./ConsultoriaAccessTheme";
import { ActionLink, Contact, SectionHeading } from "./ConsultoriaSections";
import { consultoria, previewRoutes } from "./content";
import styles from "./Consultoria.module.css";
import guide from "./StyleGuide.module.css";

const palette = [
  { name: "Vinho profundo", hex: "#702C40", token: "--brand-wine", light: true },
  { name: "Ameixa", hex: "#493044", token: "--brand-plum", light: true },
  { name: "Rosé antigo", hex: "#C98F97", token: "--brand-rose", light: false },
  { name: "Nude rosado", hex: "#E9D4CC", token: "--brand-nude", light: false },
  { name: "Marfim", hex: "#FAF5EF", token: "--brand-ivory", light: false },
  { name: "Dourado fosco", hex: "#B79258", token: "--brand-gold", light: false },
];

export function StyleGuide() {
  return <>
    <section className={styles.section}>
      <p className={styles.eyebrow}>Guia de aplicação · Rascunho para revisão</p>
      <h1>Uma identidade.<br />Um padrão para continuar.</h1>
      <p className={guide.intro}>Referência navegável para site e criativos de Magaly Abreu. A paleta, as famílias tipográficas e a arquitetura da marca vêm do briefing; estas composições ainda precisam de aprovação visual.</p>
      <nav className={guide.index} aria-label="Seções do guia visual"><a href="#paleta">Paleta</a><a href="#tipografia">Tipografia</a><a href="#componentes">Componentes</a><a href="#acesso">Áreas de acesso</a><a href="#dialogos">Diálogos e teclado</a><a href="#offline">Estado offline</a><a href="#marcas">Marcas</a><a href="#criativos">Stories e capas</a></nav>
    </section>
    <section className={styles.section} id="paleta">
      <SectionHeading eyebrow="Cores oficiais" title="Leveza na base. Profundidade na hierarquia.">Marfim e nude criam respiro. Vinho e ameixa organizam o conteúdo. O dourado aparece em detalhes e preserva seu papel nas logos originais.</SectionHeading>
      <div className={guide.palette}>{palette.map(({ name, hex, token, light }) => <article key={token}><div className={guide.swatch} style={{ background: `var(${token})`, color: light ? "var(--brand-ivory)" : "#1b1813" }}><strong>{name}</strong><span>{hex}</span></div><code>{token}</code></article>)}</div>
      <div className={guide.colorExamples}><div><h3>Texto sobre marfim</h3><p>Ameixa para leitura. Vinho para destaque e ação.</p></div><div><h3>Texto sobre vinho</h3><p>Marfim para uma leitura confortável nas áreas de destaque.</p></div></div>
      <p className={guide.note}>O rosé e o dourado não devem virar texto pequeno sobre fundo claro. Os contrastes dos pares sólidos são conferidos por npm run check:contrast e registrados em DESIGN.md. A borda de campos usa um token próprio, mais escuro que as divisórias decorativas; estados e telas ainda precisam de conferência visual.</p>
    </section>
    <section className={styles.section} id="tipografia">
      <SectionHeading eyebrow="Duas famílias, funções claras" title="Presença editorial e leitura cotidiana." />
      <div className={guide.typeExamples}><article><span>Cormorant Garamond · Títulos</span><h2>{consultoria.message}</h2><p>Pesos 500–600. Títulos, subtítulos de destaque e frases de impacto.</p></article><article><span>Montserrat · Interface e textos</span><p className={guide.bodySample}>Um caminho com espaço para a vida real. Escolher, experimentar, observar e retomar.</p><p>Pesos 400–600. Navegação, parágrafos, botões, formulários e identificação profissional.</p></article></div>
      <p className={guide.note}>A assinatura manuscrita é um arquivo original de marca. Não deve ser substituída pelo nome digitado em nenhuma destas fontes. A identificação textual provisória usada nesta prévia não representa a assinatura.</p>
    </section>
    <section className={styles.section} id="componentes">
      <SectionHeading eyebrow="Componentes compartilhados" title="A mesma linguagem em cada ponto de contato.">Cabeçalho, rodapé e contato desta página são os mesmos componentes das propostas. Os exemplos abaixo mostram CTAs e hierarquia de oferta.</SectionHeading>
      <div className={guide.buttonExamples}><ActionLink href={previewRoutes.mentorship}>Conhecer a mentoria</ActionLink><ActionLink secondary href={previewRoutes.game}>Conhecer o game</ActionLink><button type="button" className={guide.disabledButton} disabled>Enviando… (exemplo)</button></div>
      <p className={guide.note}>Os dois links navegam para propostas reais. O botão desabilitado demonstra um estado de processamento e não envia dados. Formulários e campanhas automáticas não foram adicionados.</p>
      <div className={guide.hierarchy}><article><p className={styles.eyebrow}>Marca principal</p><h3>Magaly Abreu</h3><p>Psicóloga e Mentora</p></article><article><p className={styles.eyebrow}>Oferta principal</p><h3>A Última Cartada</h3><p>Mentoria</p></article><article><p className={styles.eyebrow}>Experiência incluída</p><h3>Cartada Viva</h3><p>Game</p></article></div>
    </section>
    <section className={styles.section} id="acesso">
      <SectionHeading eyebrow="Continuidade da experiência" title="O mesmo cuidado depois de entrar.">Provas do tema para login e cards de acesso. São exemplos visuais sem conta fictícia, envio de dados ou concessão de acesso.</SectionHeading>
      <ConsultoriaAccessTheme preview>
        <div className={guide.accessExamples}>
          <div data-brand-surface="login"><section className={guide.accessCard}><p className={styles.eyebrow}>Área de participantes</p><h3>Magaly Abreu</h3><p>A Última Cartada — Mentoria · Cartada Viva — Game</p><label htmlFor="guide-user">Usuário (exemplo visual)</label><input id="guide-user" disabled placeholder="Seu usuário" /><button type="submit" disabled>Entrar (demonstração desabilitada)</button></section></div>
          <div data-brand-page="dashboard" className={guide.accessOffers}><article data-brand-offer="mentorship"><span>Oferta principal</span><h3>A Última Cartada — Mentoria</h3><p>Consciência e hábitos, com o game incluído.</p><Link href={previewRoutes.mentorship}>Conferir a proposta da mentoria</Link></article><article data-brand-offer="game"><span>Experiência incluída</span><h3>Cartada Viva — Game</h3><p>Prática de hábitos no cotidiano.</p><Link href={previewRoutes.game}>Conferir a proposta do game</Link></article></div>
        </div>
      </ConsultoriaAccessTheme>
      <p className={guide.note}>O tema das rotas reais só é aplicado quando ENABLE_CONSULTORIA_SITE está ativo. Estes exemplos não contêm páginas autenticadas, perfis ou registros de participantes; as permissões continuam sendo verificadas pela aplicação.</p>
    </section>
    <section className={styles.section} id="dialogos">
      <SectionHeading eyebrow="Conferência de interação" title="Foco no conteúdo. Controle pelo teclado.">Use esta demonstração para revisar abertura, fechamento, navegação e sobreposição. Ela não comprova testes em aparelhos reais e não realiza chamadas à API.</SectionHeading>
      <ConsultoriaAccessTheme preview><DialogExamples /></ConsultoriaAccessTheme>
    </section>
    <section className={styles.section} id="offline">
      <SectionHeading eyebrow="Conexão e privacidade" title="Uma pausa sem expor o percurso.">A tela offline da nova apresentação não mostra dados de participantes nem confirma envios. Ela usa fontes de fallback locais, sem depender de imagens, fontes ou serviços externos.</SectionHeading>
      <ActionLink secondary href="/offline-consultoria.html" external>Abrir prova da tela offline</ActionLink>
      <p className={guide.note}>Esta prova abre um arquivo estático para revisar texto e apresentação. Não desliga sua internet e não comprova instalação, atualização do service worker ou funcionamento em aparelho real.</p>
    </section>
    <section className={styles.section} id="marcas">
      <SectionHeading eyebrow="Preservação dos originais" title="Aplicar com cuidado. Preservar o desenho.">O símbolo existente do game é apresentado sem recoloração, recorte ou efeitos. Estas são provas de composição para revisão, sem criar uma nova versão da logo.</SectionHeading>
      <div className={guide.markExamples}><figure><div><Image src="/cartada-viva-mark.png" alt="Símbolo original do Cartada Viva sobre fundo marfim" width={200} height={200} /></div><figcaption>Aplicação do símbolo existente em fundo claro.</figcaption></figure><figure><div><Image src="/cartada-viva-mark.png" alt="Símbolo original do Cartada Viva sobre fundo ameixa" width={200} height={200} /></div><figcaption>Aplicação do mesmo arquivo em fundo escuro.</figcaption></figure></div>
      <aside className={guide.note}>Os originais do monograma MA, da assinatura e da marca da mentoria ainda precisam ser incorporados ao repositório. Não foram redesenhados. Versões com subtítulo antigo dependem de editável e aprovação; não devem ser apagadas ou recortadas de forma improvisada.</aside>
    </section>
    <section className={styles.section} id="criativos">
      <SectionHeading eyebrow="Fundos e composições de referência" title="Site e redes sociais no mesmo padrão.">Propostas de fundo para Story e compartilhamento. As frases aprovadas estão compostas como texto editorial, sem simular uma assinatura ou adicionar promessas.</SectionHeading>
      <div className={guide.creatives}>
        <figure><div className={guide.story}><div><span>Magaly Abreu</span><p>{consultoria.message}</p><small>A Última Cartada — Mentoria<br />Cartada Viva — Game incluído</small></div></div><figcaption>Story · fundo 1080 × 1920 · composição demonstrativa.</figcaption><a href="/consultoria/templates/story-background.svg" download>Baixar fundo sem texto (SVG)</a></figure>
        <figure><div className={guide.share}><div><span>Magaly Abreu</span><p>{consultoria.symbolicPhrase}</p><small>Consciência e hábitos no cotidiano.</small></div></div><figcaption>Capa/compartilhamento · fundo 1200 × 630 · composição demonstrativa.</figcaption><a href="/consultoria/templates/share-background.svg" download>Baixar fundo sem texto (SVG)</a></figure>
      </div>
      <p className={guide.note}>Os SVGs contêm apenas fundos e filetes, sem fontes ou logos incorporadas. A composição final deve usar Cormorant Garamond e Montserrat, aplicar os originais aprovados e conferir áreas seguras/recortes no canal de destino. Rascunhos não autorizam publicação.</p>
      <Link className={styles.textLink} href={previewRoutes.home}>Voltar à proposta da página principal</Link>
    </section>
    <Contact />
  </>;
}
