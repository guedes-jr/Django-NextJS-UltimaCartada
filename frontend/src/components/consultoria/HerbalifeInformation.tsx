import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ActionLink, SectionHeading } from "./ConsultoriaSections";
import { getHerbalifeContact, getHerbalifeRegistrationUrl, previewRoutes, type ConsultoriaRoutes } from "./content";
import styles from "./Consultoria.module.css";

const officialUrl = "https://www.herbalife.com/pt-br";
const steps = [
  { title: "Confirme a modalidade", text: "Solicite orientação sobre o cadastro adequado e suas condições. Cadastro para compra de produtos e oportunidade de distribuição são modalidades diferentes." },
  { title: "Confira o endereço", text: "Preencha seus dados apenas no canal de inscrição confirmado. Leia as condições antes de concluir e não compartilhe senhas ou códigos de acesso." },
  { title: "Acesse sua conta", text: "Se já tem cadastro, confira a conta existente e os meios de recuperação de acesso antes de criar outro registro." },
  { title: "Revise o pedido", text: "Antes de pagar, confira os produtos, preço final, desconto aplicável, frete, entrega, troca e cancelamento no canal responsável." },
];

export function HerbalifeInformation({ routes = previewRoutes }: { routes?: ConsultoriaRoutes }) {
  const contact = getHerbalifeContact();
  const existingContact = getHerbalifeContact(true);
  const registration = getHerbalifeRegistrationUrl();
  return <>
    <section className={`${styles.section} ${styles.commercialHero}`}>
      <p className={styles.eyebrow}>Atividade comercial separada</p>
      <h1>Herbalife.<br />Informação antes da compra.</h1>
      <p>Orientações da consultora independente Magaly Abreu sobre cadastro, acesso e compra de produtos Herbalife. Esta é uma atividade comercial distinta da Mentoria A Última Cartada e do Game Cartada Viva.</p>
      <p>A compra de produtos não é apresentada neste site como requisito para conhecer a mentoria ou o game. As condições de cada atividade são tratadas separadamente.</p>
      <div className={styles.actions}><ActionLink href="#orientacoes">Entender o cadastro e a compra</ActionLink>{contact && <ActionLink secondary href={contact} external>Solicitar orientação comercial</ActionLink>}</div>
      <p className={styles.heroFootnote}>Página de orientação de consultora independente. Não é o site oficial da Herbalife.</p>
    </section>
    <section className={styles.section} id="orientacoes">
      <SectionHeading eyebrow="Cadastro, acesso e pedido" title="Confira cada etapa antes de prosseguir.">Criar uma conta não confirma uma compra. Preços, descontos e condições são apresentados nos canais responsáveis.</SectionHeading>
      <ol className={styles.commercialSteps}>{steps.map(({ title, text }, index) => <li key={title}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
    </section>
    <section className={`${styles.section} ${styles.commercialCare}`}>
      <SectionHeading eyebrow="Escolha informada" title="Sem descontos ou resultados presumidos.">Esta página não promete desconto fixo, aprovação de cadastro ou resultado de saúde. A orientação comercial não substitui atendimento psicológico, nutricional ou médico.</SectionHeading>
      <p>Não envie documentos, relatos íntimos, dados de pagamento, senhas ou códigos por esta página. O site não oferece formulário de cadastro ou checkout de produtos Herbalife.</p>
      <div className={styles.actions}><ActionLink secondary href={officialUrl} external>Visitar o site oficial da Herbalife</ActionLink>{registration && <ActionLink href={registration} external>Abrir cadastro confirmado pela consultora</ActionLink>}</div>
    </section>
    <section className={styles.section} id="duvidas">
      <SectionHeading eyebrow="Perguntas frequentes" title="Dúvidas antes de avançar?" />
      <div className={styles.questions}>
        <details><summary>Herbalife faz parte da mentoria ou do game?<span aria-hidden="true">+</span></summary><p>Esta página apresenta uma atividade comercial separada. A mentoria e o game têm páginas próprias e não são apresentados como ofertas vinculadas à compra desses produtos.</p><Link className={styles.textLink} href={routes.mentorship}>Conhecer a mentoria</Link></details>
        <details><summary>Existe desconto garantido?<span aria-hidden="true">+</span></summary><p>Não há percentual fixo prometido nesta página. Confira modalidade, elegibilidade e valor final no canal de compra antes de concluir o pedido.</p></details>
        <details><summary>Já tenho cadastro. Preciso criar outro?<span aria-hidden="true">+</span></summary><p>Confira sua conta existente e os meios de recuperação de acesso. Se não souber a modalidade ou o vínculo atual, procure orientação ou o atendimento oficial.</p></details>
        <details><summary>Onde faço o cadastro ou pagamento?<span aria-hidden="true">+</span></summary><p>Somente no canal confirmado e após conferir as condições. Esta página não coleta documentos, senhas ou pagamentos e não confirma pedidos.</p></details>
      </div>
    </section>
    <section className={styles.contact} id="contato" aria-labelledby="commercial-contact-title">
      <div><p className={styles.eyebrow}>Orientação comercial</p><h2 id="commercial-contact-title">Confirme o canal.<br />Conheça as condições.</h2><p>Esclareça dúvidas sobre cadastro e compra em um contato separado das informações sobre mentoria e game.</p></div>
      <div className={styles.contactActions}>{contact ? <ActionLink href={contact} external>Conversar sobre Herbalife</ActionLink> : <p className={styles.contactPending}>Contato comercial: A confirmar.</p>}{existingContact && <ActionLink secondary href={existingContact} external>Já tenho cadastro e preciso de ajuda</ActionLink>}<Link className={styles.textLink} href={routes.home}>Voltar à apresentação de Magaly Abreu <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    </section>
  </>;
}
