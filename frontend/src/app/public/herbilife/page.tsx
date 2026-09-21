import Image from "next/image";
import Link from "next/link";
import PublicNavigation from "@/components/landing/PublicNavigation";
import type { Metadata } from "next";

import styles from "./HerbilifePage.module.css";

export const metadata: Metadata = {
  title: "Como se cadastrar e comprar | Herbalife com Magaly Abreu",
  description: "Guia para solicitar orientação de cadastro, acessar o canal oficial e conferir as condições de compra de produtos Herbalife.",
};

const OFFICIAL_URL = "https://www.herbalife.com/pt-br";
const registrationCandidate = process.env.NEXT_PUBLIC_HERBALIFE_REGISTRATION_URL?.trim();
const REGISTRATION_URL = registrationCandidate?.startsWith("https://") ? registrationCandidate : null;
const WHATSAPP_NUMBER = "5584999181607";

function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

const NEW_CUSTOMER_URL = whatsappUrl("Olá, Magaly! Quero entender como fazer meu cadastro para comprar produtos Herbalife e verificar as condições disponíveis.");
const EXISTING_CUSTOMER_URL = whatsappUrl("Olá, Magaly! Já tenho cadastro Herbalife e preciso de ajuda para acessar minha conta ou entender as condições de compra.");

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
  return <main className={styles.page}>
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="Cartada Viva — início"><Image src="/cartada-viva-mark.png" width={58} height={58} alt="" /><span>Cartada Viva</span></Link>
      <PublicNavigation id="herbalife-navigation" label="Navegação desta página"><a href="#passos">Passo a passo</a><a href="#duvidas">Dúvidas</a><Link href="/">Voltar ao site</Link></PublicNavigation>
    </header>

    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroText}>
        <span className={styles.eyebrow}>Guia de cadastro e compra</span>
        <h1 id="hero-title">Seu próximo passo, sem confundir cadastro com compra.</h1>
        <p>Veja como solicitar seu cadastro, acessar o canal indicado e conferir as condições disponíveis antes de adquirir produtos Herbalife.</p>
        <div className={styles.actions}><a className={styles.primary} href="#passos">Ver o passo a passo</a><a className={styles.secondary} href={NEW_CUSTOMER_URL} target="_blank" rel="noopener noreferrer">Pedir ajuda à Magaly</a></div>
        <p className={styles.disclosure}>Esta é uma página de orientação da consultora independente Magaly Abreu, não o site oficial da Herbalife. Cadastro, preços e condições são definidos nos canais responsáveis.</p>
      </div>
      <div className={styles.heroVisual}><Image src="/landing/professional/acauamedia-114.jpg" alt="Magaly Abreu" width={620} height={780} priority /><div className={styles.visualNote}><strong>Cadastro → acesso → pedido</strong><span>Confira cada etapa antes de prosseguir.</span></div></div>
    </section>

    <section className={styles.quickChoice} aria-label="Escolha seu ponto de partida">
      <article><span>Começando agora</span><h2>Ainda não tenho cadastro</h2><p>Peça a orientação e o endereço de inscrição adequado antes de preencher seus dados.</p><a href={NEW_CUSTOMER_URL} target="_blank" rel="noopener noreferrer">Solicitar orientação <span aria-hidden="true">↗</span></a></article>
      <article><span>Já tenho conta</span><h2>Preciso acessar ou comprar</h2><p>Use seu acesso existente. Se esqueceu a senha ou não sabe sua modalidade, peça ajuda.</p><a href={EXISTING_CUSTOMER_URL} target="_blank" rel="noopener noreferrer">Receber ajuda <span aria-hidden="true">↗</span></a></article>
    </section>

    <section className={styles.section} id="passos"><div className={styles.sectionIntro}><span className={styles.eyebrow}>Do início ao pedido</span><h2>O caminho em quatro passos</h2><p>As telas podem mudar conforme o canal de cadastro. Siga sempre as instruções exibidas no endereço confirmado.</p></div><ol className={styles.steps}>{steps.map(step => <li key={step.number}><span className={styles.stepNumber}>{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol></section>

    <section className={styles.preparation}><div><span className={styles.eyebrow}>Antes de abrir o cadastro</span><h2>Tenha em mãos</h2><p>Use apenas os dados solicitados pelo canal de inscrição. Não envie informações sensíveis por esta página.</p></div><ul><li>Seu e-mail e telefone de contato</li><li>Dados de identificação que o formulário oficial solicitar</li><li>Endereço para entrega, se fizer um pedido</li><li>Tempo para ler condições, preço final e política de compra</li></ul></section>

    <section className={styles.section} id="compra"><div className={styles.sectionIntro}><span className={styles.eyebrow}>Na hora da compra</span><h2>Confira antes de pagar</h2><p>Ter uma conta não garante automaticamente um desconto específico. O valor aplicável precisa estar visível no pedido.</p></div><div className={styles.checkGrid}><article><strong>1. Conta correta</strong><p>Confirme que está conectada à modalidade de cadastro pretendida.</p></article><article><strong>2. Condições atuais</strong><p>Leia os preços, descontos e regras mostrados no canal de compra.</p></article><article><strong>3. Total do pedido</strong><p>Revise produtos, quantidade, frete e forma de pagamento antes de concluir.</p></article></div><div className={styles.linkRow}><a href={OFFICIAL_URL} target="_blank" rel="noopener noreferrer">Visitar o site oficial da Herbalife <span aria-hidden="true">↗</span></a>{REGISTRATION_URL && <a href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer">Abrir link de cadastro informado pela consultora <span aria-hidden="true">↗</span></a>}</div></section>

    <section className={styles.section} id="duvidas"><div className={styles.sectionIntro}><span className={styles.eyebrow}>Perguntas frequentes</span><h2>Dúvidas antes de avançar?</h2></div><div className={styles.faq}>{faqs.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>

    <section className={styles.finalCta}><div><span className={styles.eyebrow}>Precisa de uma mão?</span><h2>Confirme o caminho certo para você.</h2><p>Magaly pode orientar sobre o cadastro e esclarecer dúvidas antes de você concluir uma compra.</p></div><a href={NEW_CUSTOMER_URL} target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp <span aria-hidden="true">↗</span></a></section>

    <footer className={styles.footer}><Link href="/">A Última Cartada</Link><span>Orientação de consultora independente; não é página oficial da Herbalife.</span><nav aria-label="Links legais"><Link href="/terms">Termos de Uso</Link><Link href="/privacy">Privacidade</Link></nav></footer>
  </main>;
}
