import { ConsultoriaPublicPage } from "@/components/consultoria/ConsultoriaPublicPage";
import { isConsultoriaSiteEnabled } from "@/components/consultoria/release";
import { getConsultoriaMetadata } from "@/components/consultoria/metadata";
import { getHerbalifeContact } from "@/components/consultoria/content";
import Image from "next/image";
import Link from "next/link";
import PublicNavigation from "@/components/landing/PublicNavigation";
import type { Metadata } from "next";

import styles from "./HerbilifePage.module.css";

export function generateMetadata(): Metadata {
  return getConsultoriaMetadata("herbalife");
}

const OFFICIAL_URL = "https://www.herbalife.com/pt-br";
const registrationCandidate = process.env.NEXT_PUBLIC_HERBALIFE_REGISTRATION_URL?.trim();
const REGISTRATION_URL = registrationCandidate?.startsWith("https://") ? registrationCandidate : null;
const steps = [
  {
    number: "01",
    title: "Solicite a orientação de cadastro",
    text: "Converse com Magaly para confirmar qual modalidade de cadastro atende ao seu objetivo e receber o endereço correto de inscrição. Cadastro de cliente e cadastro de distribuidor são coisas diferentes.",
  },
  {
    number: "02",
    title: "Cadastre-se no canal indicado",
    text: "Abra o endereço recebido, confira se ele pertence à Herbalife ou ao canal autorizado informado pela consultora e siga as instruções exibidas. Leia as condições antes de confirmar.",
  },
  {
    number: "03",
    title: "Ative e acesse sua conta",
    text: "Se houver confirmação por e-mail ou telefone, conclua-a conforme a orientação da plataforma. Guarde seu acesso e não compartilhe senha ou código de verificação.",
  },
  {
    number: "04",
    title: "Escolha produtos e confira o pedido",
    text: "Depois de entrar na conta, selecione os produtos. Antes de pagar, confira preço final, eventual desconto aplicável, frete, prazo de entrega e regras de troca ou cancelamento.",
  },
];

const faqs = [
  { question: "O cadastro e a compra são a mesma coisa?", answer: "Não. Primeiro você cria ou acessa a conta apropriada; a compra é uma etapa posterior, concluída no canal de pedidos indicado. Fazer o cadastro não confirma um pedido." },
  { question: "Qual desconto vou receber?", answer: "O percentual e a elegibilidade dependem da modalidade de cadastro e das condições vigentes apresentadas antes da compra. Esta página não promete um percentual fixo. Confirme o valor final no carrinho." },
  { question: "Já tenho cadastro. Preciso criar outro?", answer: "Em geral, vale tentar recuperar o acesso à conta existente antes de iniciar outro cadastro. Se não souber a modalidade ou o vínculo atual, fale com a consultora ou com o atendimento oficial." },
  { question: "Posso enviar meus dados por esta página?", answer: "Não. Esta página não coleta documentos, senha nem dados de pagamento. Preencha informações pessoais somente no canal de cadastro confirmado e nunca envie códigos de acesso por mensagem." },
  { question: "O que faço se o preço ou o desconto não aparecer?", answer: "Não conclua o pagamento esperando ajuste posterior. Verifique se entrou na conta correta, revise as condições apresentadas e peça ajuda antes de finalizar." },
];

export default function HerbilifePage() {
  if (isConsultoriaSiteEnabled()) return <ConsultoriaPublicPage page="herbalife" />;
  const newCustomerUrl = getHerbalifeContact();
  const existingCustomerUrl = getHerbalifeContact(true);
  return <main className={styles.page} id="conteudo" tabIndex={-1}>
    <a className={styles.skipLink} href="#passos">Pular para o conteúdo</a>
    <header className={styles.header} id="top">
      <Link className={styles.brand} href="/" aria-label="Magaly Abreu — início"><span>Magaly Abreu</span></Link>
      <PublicNavigation id="herbalife-navigation" label="Navegação desta página"><a href="#passos">Passo a passo</a><a href="#duvidas">Dúvidas</a><Link href="/">Voltar ao site</Link></PublicNavigation>
    </header>

    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroText}>
        <span className={styles.eyebrow}>Guia de cadastro e compra</span>
        <h1 id="hero-title">Seu próximo passo, sem confundir cadastro com compra.</h1>
        <p>Veja como solicitar seu cadastro, acessar o canal indicado e conferir as condições disponíveis antes de adquirir produtos Herbalife.</p>
        <div className={styles.actions}><a className={styles.primary} href="#passos">Ver o passo a passo</a>{newCustomerUrl && <a className={styles.secondary} href={newCustomerUrl} target="_blank" rel="noopener noreferrer" aria-label="Pedir orientação à Magaly (abre em nova aba)">Pedir orientação à Magaly</a>}</div>
        <p className={styles.disclosure}>Esta é uma página de orientação da consultora independente Magaly Abreu, não o site oficial da Herbalife. Cadastro, preços e condições são definidos nos canais responsáveis. A compra de produtos não é condição para participar da mentoria ou do Game. O contato comercial é exibido somente quando configurado e confirmado.</p>
      </div>
      <div className={styles.heroVisual}><Image src="/landing/professional/acauamedia-114.jpg" alt="Magaly Abreu sentada em poltrona amarela" width={620} height={780} priority sizes="(max-width: 980px) 100vw, 50vw" /><div className={styles.visualNote}><strong>Cadastro → acesso → pedido</strong><span>Confira cada etapa antes de prosseguir.</span></div></div>
    </section>

    <section className={styles.quickChoice} aria-label="Escolha seu ponto de partida">
      <article><span>Começando agora</span><h2>Ainda não tenho cadastro</h2><p>Peça a orientação e o endereço de inscrição adequado antes de preencher seus dados.</p>{newCustomerUrl ? <a href={newCustomerUrl} target="_blank" rel="noopener noreferrer" aria-label="Solicitar orientação (abre em nova aba)">Solicitar orientação <span aria-hidden="true">↗</span></a> : <a href="#passos">Ver o passo a passo</a>}</article>
      <article><span>Já tenho conta</span><h2>Preciso acessar ou comprar</h2><p>Use seu acesso existente. Se esqueceu a senha ou não sabe sua modalidade, peça ajuda.</p>{existingCustomerUrl ? <a href={existingCustomerUrl} target="_blank" rel="noopener noreferrer" aria-label="Receber orientação (abre em nova aba)">Receber orientação <span aria-hidden="true">↗</span></a> : <a href="#duvidas">Ver dúvidas frequentes</a>}</article>
    </section>

    <section className={styles.section} id="passos" tabIndex={-1}><div className={styles.sectionIntro}><span className={styles.eyebrow}>Do início ao pedido</span><h2>O caminho em quatro passos</h2><p>As telas podem mudar conforme o canal de cadastro. Siga sempre as instruções exibidas no endereço confirmado.</p></div><ol className={styles.steps}>{steps.map(step => <li key={step.number}><span className={styles.stepNumber}>{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol></section>

    <section className={styles.preparation}><div><span className={styles.eyebrow}>Antes de abrir o cadastro</span><h2>Tenha em mãos</h2><p>Use apenas os dados solicitados pelo canal de inscrição. Não envie informações sensíveis por esta página.</p></div><ul><li>Seu e-mail e telefone de contato</li><li>Dados de identificação que o formulário oficial solicitar</li><li>Endereço para entrega, se fizer um pedido</li><li>Tempo para ler condições, preço final e política de compra</li></ul></section>

    <section className={styles.section} id="compra"><div className={styles.sectionIntro}><span className={styles.eyebrow}>Na hora da compra</span><h2>Confira antes de pagar</h2><p>Ter uma conta não garante automaticamente um desconto específico. O valor aplicável precisa estar visível no pedido.</p></div><div className={styles.checkGrid}><article><strong>1. Conta correta</strong><p>Confirme que está conectada à modalidade de cadastro pretendida.</p></article><article><strong>2. Condições atuais</strong><p>Leia os preços, descontos e regras mostrados no canal de compra.</p></article><article><strong>3. Total do pedido</strong><p>Revise produtos, quantidade, frete e forma de pagamento antes de concluir.</p></article></div><div className={styles.linkRow}><a href={OFFICIAL_URL} target="_blank" rel="noopener noreferrer" aria-label="Visitar o site oficial da Herbalife (abre em nova aba)">Visitar o site oficial da Herbalife <span aria-hidden="true">↗</span></a>{REGISTRATION_URL && <a href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer" aria-label="Abrir link de cadastro informado pela consultora (abre em nova aba)">Abrir link de cadastro informado pela consultora <span aria-hidden="true">↗</span></a>}</div></section>

    <section className={styles.section} id="duvidas"><div className={styles.sectionIntro}><span className={styles.eyebrow}>Perguntas frequentes</span><h2>Dúvidas antes de avançar?</h2></div><div className={styles.faq}>{faqs.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>

    <section className={styles.finalCta}><div><span className={styles.eyebrow}>Precisa de uma mão?</span><h2>Confirme o caminho certo para você.</h2><p>Use o canal oficial e confira as condições antes de concluir uma compra.</p></div>{newCustomerUrl ? <a href={newCustomerUrl} target="_blank" rel="noopener noreferrer" aria-label="Pedir orientação à Magaly (abre em nova aba)">Pedir orientação <span aria-hidden="true">↗</span></a> : <a href="#passos">Ver o passo a passo</a>}</section>

    <footer className={styles.footer}><Link href="/">Magaly Abreu</Link><span>Orientação de consultora independente; não é página oficial da Herbalife.</span><nav aria-label="Links legais"><Link href="/terms">Termos de Uso</Link><Link href="/privacy">Privacidade</Link></nav></footer>
  </main>;
}
