import type { Metadata } from "next";
import Link from "next/link";
import { consultoriaPendingDetails, previewRoutes } from "@/components/consultoria/content";
import shared from "@/components/consultoria/Consultoria.module.css";
import styles from "./ReviewPage.module.css";

export const metadata: Metadata = {
  title: "Roteiro de revisão — Proposta",
  description: "Páginas propostas, critérios de revisão e dados a confirmar antes da aprovação da apresentação de Magaly Abreu.",
};

const pages = [
  { title: "1. Página principal", href: previewRoutes.home, items: ["Magaly Abreu reconhecível como marca principal.", "Mentoria como oferta principal e game identificado como incluído.", "Fotografia, legibilidade da primeira tela e tom acolhedor."] },
  { title: "2. A Última Cartada — Mentoria", href: previewRoutes.mentorship, items: ["Público, proposta e condições compreensíveis.", "Inclusão do game sem nova compra e limites da experiência claros.", "FAQ, estrutura do acompanhamento e dados ainda provisórios revisados."] },
  { title: "3. Cartada Viva — Game", href: previewRoutes.game, items: ["Funcionamento apresentado de acordo com a experiência oferecida.", "Vínculo com Magaly e com a mentoria visível.", "Ilustração identificada e nenhuma inscrição independente anunciada como disponível."] },
  { title: "4. Identidade visual", href: "/preview/consultoria/guia-visual", items: ["Paleta, títulos, textos, botões e aplicações em fundos claros e escuros.", "Arquivos originais das marcas e uso das fotografias conferidos.", "Composições de Stories e capas revisadas como rascunhos."] },
  { title: "5. Atividade comercial separada", href: previewRoutes.herbalife, items: ["Herbalife diferenciada da mentoria e do game.", "Contato comercial e destino de cadastro validados separadamente.", "Nenhuma condição de compra ou promessa não confirmada."] },
];

export default function ReviewPage() {
  return <>
    <section className={shared.section}>
      <p className={shared.eyebrow}>Versão de teste · Revisão da consultoria</p>
      <h1>Revisar a proposta, página por página.</h1>
      <p className={styles.intro}>Este roteiro reúne o que conferir antes do aceite. As páginas são propostas em desenvolvimento; testes técnicos não equivalem à aprovação da titular.</p>
      <nav className={styles.jumpLinks} aria-label="Etapas da revisão">
        <a href="#paginas">Páginas propostas</a><a href="#dados">Dados a confirmar</a><a href="#dispositivos">Celular e acesso</a><a href="#contato">Registrar retorno</a>
      </nav>
    </section>
    <section id="paginas" className={shared.section} aria-labelledby="paginas-titulo">
      <h2 id="paginas-titulo">O que conferir em cada página</h2>
      <div className={styles.grid}>{pages.map((page) => <article className={styles.card} key={page.href}>
        <h3>{page.title}</h3><ul>{page.items.map((item) => <li key={item}>{item}</li>)}</ul>
        <Link className={shared.textLink} href={page.href}>Abrir {page.title.replace(/^\d\. /, "")}</Link>
      </article>)}</div>
    </section>
    <section id="dados" className={shared.section} aria-labelledby="dados-titulo">
      <h2 id="dados-titulo">Informações para confirmar</h2>
      <p>Valores configurados também precisam de validação. “A confirmar” indica uma lacuna, não uma condição da oferta. Não inferir duração ou acesso das etapas técnicas do sistema.</p>
      <dl className={styles.facts}>{consultoriaPendingDetails.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <p>Também conferir originais das três identidades, subtítulos incorporados às imagens, autorização das fotografias e eventuais depoimentos. Marcas ausentes não foram redesenhadas.</p>
    </section>
    <section id="dispositivos" className={shared.section} aria-labelledby="dispositivos-titulo">
      <h2 id="dispositivos-titulo">Celular e área de participantes</h2>
      <ul className={styles.checks}>
        <li>Conferir as três páginas no celular, em orientação vertical e horizontal, e com texto ampliado.</li>
        <li>Testar menu, FAQ, botões, contato, foco e navegação por teclado; registrar aparelho, navegador e largura quando disponível.</li>
        <li>Conferir login e o caminho mentoria → game com conta de teste autorizada, sem usar relatos ou arquivos pessoais.</li>
        <li>Revisar instalação e recuperação sem conexão em aparelho real. Medições locais e emulação não substituem essa conferência.</li>
      </ul>
      <p>A prévia não cria uma conta de demonstração nem concede acesso. A área de participantes mantém as permissões existentes.</p>
    </section>
    <section id="contato" className={shared.section} aria-labelledby="retorno-titulo">
      <h2 id="retorno-titulo">Como registrar o retorno</h2>
      <p>Envie pelo canal já combinado: página e seção, texto atual, correção desejada e, quando for visual, aparelho/navegador e imagem sem dados pessoais. Diferencie ajuste solicitado de trecho aprovado.</p>
      <p>Esta página não coleta nem salva respostas. O retorno deverá ser registrado no plano e na auditoria pelo responsável pelo projeto, com data e escopo.</p>
      <p><strong>A aprovação da proposta não publica o site.</strong> Preencher os dados, concluir a homologação e obter autorização expressa de publicação são etapas separadas.</p>
    </section>
  </>;
}
