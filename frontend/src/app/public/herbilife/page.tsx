import Link from "next/link";
import type { Metadata } from "next";

import VideoTestimonials from "@/components/landing/VideoTestimonials";
import styles from "./HerbilifePage.module.css";

export const metadata: Metadata = {
  title: "Magaly Abreu | Herbalife",
  description:
    "Consultoria Herbalife com acompanhamento personalizado para uma rotina com mais energia, equilíbrio e bem-estar.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

const WHATSAPP_URL =
  "https://wa.me/5584999181607?text=Olá,%20Magaly!%20Quero%20saber%20mais%20sobre%20a%20consultoria%20Herbalife.";

const CATALOG_URL = "https://catalogoherbalife.com.br";

const categories = [
  {
    number: "01",
    title: "Shakes & Refeições",
    description:
      "Substitutas práticas, ricas em proteína e nutrientes essenciais.",
  },
  {
    number: "02",
    title: "Chás & Hidratação",
    description:
      "Chá termogênico, aloe e bebidas para energia ao longo do dia.",
  },
  {
    number: "03",
    title: "Suplementos",
    description:
      "Vitaminas, ômega e fórmulas para imunidade e performance.",
  },
  {
    number: "04",
    title: "Esporte & Performance",
    description:
      "Linha 24 para treinos, recuperação e ganho de massa.",
  },
];

const products = [
  {
    tag: "Mais vendido",
    title: "Shake Fórmula 1",
    description:
      "Refeição completa com 21 vitaminas e minerais. Sabores chocolate, baunilha, morango e cookies.",
    page: "pág. 15",
    image: "/landing/professional/acauamedia-113.jpg",
  },
  {
    tag: "Energia",
    title: "Chá Termogênico",
    description:
      "Acelera o metabolismo, dá energia e ajuda na hidratação ao longo do dia.",
    page: "pág. 23",
    image: "/landing/professional/acauamedia-19.jpg",
  },
  {
    tag: "Bem-estar",
    title: "Aloe Concentrado",
    description:
      "Bebida à base de babosa para conforto digestivo e hidratação.",
    page: "pág. 27",
    image: "/landing/professional/acauamedia-24.jpg",
  },
  {
    tag: "Performance",
    title: "Proteína PDM",
    description:
      "Reforço proteico para ganho de massa e saciedade entre refeições.",
    page: "pág. 19",
    image: "/landing/professional/acauamedia-114.jpg",
  },
  {
    tag: "Equilíbrio",
    title: "Fibra Ativa",
    description:
      "Apoia o funcionamento intestinal com fibras solúveis e insolúveis.",
    page: "pág. 31",
    image: "/landing/professional/acauamedia-117.jpg",
  },
  {
    tag: "Esporte",
    title: "Herbalife 24",
    description:
      "Linha completa para atletas: pré-treino, recuperação e hidratação.",
    page: "pág. 49",
    image: "/landing/professional/acauamedia-126.jpg",
  },
];

const benefits = [
  {
    number: "01",
    title: "Nutrição balanceada",
    description: "Refeições com proteínas, vitaminas e minerais essenciais.",
  },
  {
    number: "02",
    title: "Mais energia",
    description: "Mais disposição para atravessar a rotina com constância.",
  },
  {
    number: "03",
    title: "Resultados reais",
    description: "Plano personalizado de acordo com suas metas e sua rotina.",
  },
  {
    number: "04",
    title: "Acompanhamento",
    description: "Orientação próxima em cada etapa da sua jornada.",
  },
];

const steps = [
  {
    number: "01",
    title: "Fale comigo",
    description: "Me chame no WhatsApp e conte quais são seus objetivos.",
  },
  {
    number: "02",
    title: "Plano personalizado",
    description: "Monto uma sugestão com os produtos mais adequados para você.",
  },
  {
    number: "03",
    title: "Comece sua jornada",
    description: "Receba os produtos e siga com acompanhamento contínuo.",
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

const faqs = [
  "Os produtos Herbalife são seguros?",
  "Como funciona o Shake Fórmula 1?",
  "Quanto tempo leva para ver resultados?",
  "Preciso de prescrição médica para usar?",
  "Como faço para comprar e receber os produtos?",
  "Tem desconto para compra recorrente?",
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="#home" aria-label="Magaly Abreu">
          <div className={styles.logo}>M</div>

          <div>
            <strong>Magaly Abreu</strong>
            <span>Bem-estar Premium</span>
          </div>
        </a>

        <nav className={styles.nav}>
          <a href="#about">Sobre</a>
          <a href="#products">Produtos</a>
          <a href="#benefits">Benefícios</a>
          <a href="#testimonials">Depoimentos</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className={styles.headerActions}>
          <a
            className={styles.headerButton}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
          >
            Consultoria
          </a>

          <Link className={styles.loginLink} href="/login">
            Entrar
          </Link>
        </div>
      </header>

      <section className={styles.hero} id="home">
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            Consultora Independente Herbalife
          </span>

          <h1>Saúde é a sua maior riqueza.</h1>

          <p>
            Sou Magaly Abreu, psicóloga e consultora de bem-estar. Transformo
            sua rotina com nutrição inteligente, acompanhamento próximo e
            produtos selecionados para quem busca viver com plenitude.
          </p>

          <div className={styles.actions}>
            <a
              className={styles.primaryButton}
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
            >
              Iniciar minha jornada
            </a>

            <a className={styles.secondaryButton} href="#products">
              Ver catálogo
            </a>
          </div>

          <div className={styles.stats}>
            <div>
              <strong>1.000+</strong>
              <span>Clientes</span>
            </div>

            <div>
              <strong>4 anos</strong>
              <span>Consultoria</span>
            </div>

            <div>
              <strong>98%</strong>
              <span>Satisfação</span>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.premiumCard}>
            <span>Selecionado por</span>
            <strong>Profissionais de saúde</strong>
          </div>

          <img
            className={styles.heroImage}
            src="/landing/professional/acauamedia-114.jpg"
            alt="Magaly Abreu"
          />

          <div className={styles.profileCard}>
            <img
              src="/landing/professional/acauamedia-117.jpg"
              alt="Magaly Abreu"
            />

            <div>
              <strong>Magaly Abreu</strong>
              <span>Psicóloga e consultora Herbalife</span>
            </div>
          </div>

          <blockquote>“Cuidar de você é o investimento mais nobre.”</blockquote>
        </div>
      </section>

      <section className={styles.about} id="about">
        <div className={styles.aboutImageWrap}>
          <img
            className={styles.aboutImage}
            src="/landing/professional/acauamedia-18.jpg"
            alt="Magaly Abreu"
          />

          <div className={styles.aboutQuote}>
            <span>”</span>
            <p>&ldquo;Cuidar de você é o investimento mais nobre.&rdquo;</p>
          </div>
        </div>

        <div className={styles.aboutContent}>
          <span className={styles.aboutLabel}>Sobre Magaly</span>

          <h2>Psicóloga, mãe e curadora de uma vida com mais leveza.</h2>

          <p>
            Como psicóloga, acompanho diariamente o quanto saúde mental e física
            caminham juntas. Por isso me tornei consultora Herbalife — para
            entregar não apenas produtos selecionados, mas um plano de bem-estar
            à altura de quem prioriza a própria saúde como ativo de vida.
          </p>

          <div className={styles.aboutHighlights}>
            <div className={styles.aboutHighlight}>
              <span>♡</span>
              <strong>Acompanhamento exclusivo</strong>
            </div>

            <div className={styles.aboutHighlight}>
              <span>❤</span>
              <strong>Saúde integral</strong>
            </div>

            <div className={styles.aboutHighlight}>
              <span>♙</span>
              <strong>Curadoria premium</strong>
            </div>

            <div className={styles.aboutHighlight}>
              <span>✦</span>
              <strong>1.000+ clientes</strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>Categorias</span>
          <h2>
            Curadoria completa
            <br />
            para a sua rotina.
          </h2>
          <p>
            Quatro pilares cuidadosamente selecionados para sustentar uma vida
            com mais energia, foco e equilíbrio.
          </p>
        </div>

        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <article className={styles.categoryCard} key={category.title}>
              <span>{category.number}</span>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <a href="#products">Explorar</a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="products">
        <div className={styles.sectionHeader}>
          <span>Produtos em destaque</span>
          <h2>
            Selecionados
            <br />
            para sua rotina.
          </h2>
          <p>
            Produtos pensados para apoiar diferentes momentos do seu dia, sempre
            com orientação personalizada.
          </p>
        </div>

        <div className={styles.productsTop}>
          <a
            className={styles.catalogButton}
            href={CATALOG_URL}
            target="_blank"
            rel="noreferrer"
          >
            Catálogo completo
          </a>
        </div>

        <div className={styles.productGrid}>
          {products.map((product) => (
            <article className={styles.productCard} key={product.title}>
              <span>{product.tag}</span>

              <div className={styles.productImage}>
                <img src={product.image} alt={product.title} />
              </div>

              <h3>{product.title}</h3>

              <p>{product.description}</p>

              <a href={CATALOG_URL} target="_blank" rel="noreferrer">
                Ver no catálogo
                <small>{product.page}</small>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.benefits} id="benefits">
        <div className={styles.sectionHeader}>
          <span>Benefícios</span>
          <h2>
            Por que escolher Herbalife
            <br />
            com Magaly?
          </h2>
          <p>
            Mais do que produtos: uma consultoria pensada para escolhas mais
            conscientes e duradouras.
          </p>
        </div>

        <div className={styles.benefitGrid}>
          {benefits.map((benefit) => (
            <article className={styles.benefitCard} key={benefit.title}>
              <span>{benefit.number}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </article>
          ))}
        </div>

        <div className={styles.benefitFeature}>
          <img
            src="/landing/professional/acauamedia-126.jpg"
            alt="Magaly Abreu segurando uma ampulheta"
          />

          <div>
            <span>Rotina possível</span>
            <h3>Bem-estar também é escolher o momento certo.</h3>
            <p>
              A consultoria une escuta, organização e produtos adequados para
              transformar pequenas escolhas diárias em um cuidado mais
              consistente.
            </p>

            <ul>
              <li>Plano alinhado ao seu objetivo</li>
              <li>Acompanhamento para manter constância</li>
              <li>Produtos escolhidos com orientação</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.steps}>
        <div className={styles.sectionHeader}>
          <span>Como funciona</span>
          <h2>Três passos para uma vida mais plena.</h2>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <article className={styles.stepCard} key={step.title}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.testimonials} id="testimonials">
        <div className={styles.sectionHeader}>
          <span>Depoimentos</span>
          <h2>Quem já vive essa jornada.</h2>
        </div>

        <VideoTestimonials items={videoTestimonials} />
      </section>

      <section className={styles.faq} id="faq">
        <div className={styles.sectionHeader}>
          <span>Perguntas Frequentes</span>
          <h2>
            Tire suas dúvidas
            <br />
            antes de começar.
          </h2>
          <p>
            Reuni as perguntas mais comuns para que você se sinta seguro em dar
            o primeiro passo.
          </p>
        </div>

        <div className={styles.faqGrid}>
          <div className={styles.faqCta}>
            <strong>Ainda tem dúvidas?</strong>
            <p>Fale comigo pelo WhatsApp e receba uma orientação inicial.</p>

            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              Conversar agora
            </a>
          </div>

          <div className={styles.questions}>
            {faqs.map((faq) => (
              <details key={faq}>
                <summary>{faq}</summary>
                <p>
                  A resposta depende do seu objetivo, rotina e histórico. Por
                  isso, o ideal é conversar comigo para uma orientação
                  personalizada.
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div>
          <span>Vamos conversar</span>
          <h2>
            Pronta para investir
            <br />
            na sua maior riqueza?
          </h2>
          <p>
            Vamos conversar e montar o plano ideal para sua nova fase de
            bem-estar.
          </p>
        </div>

        <div className={styles.finalCtaMedia}>
          <img
            src="/landing/professional/acauamedia-135.jpg"
            alt="Magaly Abreu em atendimento de consultoria"
          />
        </div>

        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
          WhatsApp (84) 99412-4712
        </a>
      </section>

      <footer className={styles.footer}>
        <div>
          <strong>Magaly Abreu</strong>
          <span>
            Consultora Independente Herbalife. Psicóloga dedicada ao bem-estar
            integral.
          </span>
        </div>

        <div className={styles.footerLinks}>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            (84) 99412-4712
          </a>
          <a href="mailto:magalyabreu@gmail.com">magalyabreu@gmail.com</a>
          <a href={CATALOG_URL} target="_blank" rel="noreferrer">
            Catálogo completo
          </a>
        </div>

        <small>© 2026 Magaly Abreu — Todos os direitos reservados.</small>
      </footer>
    </main>
  );
}
