/** Fatos confirmados em CONSULTORIA.md. Não inferir condições da oferta do schema do jogo. */
export const consultoria = {
  name: "Magaly Abreu",
  role: "Psicóloga e Mentora",
  mentorship: "A Última Cartada",
  game: "Cartada Viva",
  message: "Consciência para mudar. Hábitos para continuar.",
  symbolicPhrase: "Foi uma carta, não foi o jogo.",
  inclusion: "Quem participa da Mentoria A Última Cartada tem direito de participar do Game Cartada Viva, sem precisar adquirir o game novamente.",
} as const;

export const pendingContactNotice = "Canal de contato: a confirmar. Enquanto isso, conheça as condições de participação.";

/** Identificação literal fornecida pela consultoria para as superfícies públicas. */
const confirmedProfessionalIdentity = "Magaly Abreu · Psicóloga · CRP 17/5894";

/** Dados provisórios autorizados. Uma fonte para páginas, FAQ e painel de revisão. */
export const consultoriaOfferDetails = {
  mentorshipDuration: process.env.CONSULTORIA_MENTORSHIP_DURATION?.trim() || "A confirmar",
  gameDuration: process.env.CONSULTORIA_GAME_DURATION?.trim() || "A confirmar",
  format: process.env.CONSULTORIA_FORMAT?.trim() || "A confirmar",
  meetings: process.env.CONSULTORIA_MEETINGS?.trim() || "A confirmar",
  materials: process.env.CONSULTORIA_MATERIALS?.trim() || "A confirmar",
} as const;

export const consultoriaPendingDetails = [
  { label: "Duração da mentoria", value: consultoriaOfferDetails.mentorshipDuration },
  { label: "Duração e jornadas do game incluído", value: consultoriaOfferDetails.gameDuration },
  { label: "Formato do acompanhamento", value: consultoriaOfferDetails.format },
  { label: "Encontros e frequência", value: consultoriaOfferDetails.meetings },
  { label: "Materiais e suporte", value: consultoriaOfferDetails.materials },
  { label: "WhatsApp oficial", value: getConsultoriaContact() ? "Configurado; validar destino na revisão final" : "A confirmar" },
  { label: "Instagram oficial", value: getConsultoriaInstagram()?.username ?? "A confirmar" },
  { label: "Contato comercial Herbalife", value: getHerbalifeContact() ? "Configurado; validar destino na revisão final" : "A confirmar" },
  { label: "Instagram comercial Bistrô Slim", value: "A confirmar; não publicar destino sem confirmação" },
  { label: "Checkout da mentoria", value: "A confirmar; não publicar destino sem aprovação expressa" },
  { label: "Identificação e registro profissional", value: getConsultoriaProfessionalIdentity() ?? "A confirmar" },
] as const;

export type ConsultoriaPage = "home" | "mentorship" | "game" | "herbalife";
export type ConsultoriaRoutes = Record<ConsultoriaPage, string>;

export const publicRoutes: ConsultoriaRoutes = {
  home: "/",
  mentorship: "/public/ultima-cartada",
  game: "/public/cartada-viva",
  herbalife: "/public/herbilife",
};

export const previewRoutes: ConsultoriaRoutes = {
  home: "/preview/consultoria",
  mentorship: "/preview/consultoria/mentoria",
  game: "/preview/consultoria/game",
  herbalife: "/preview/consultoria/herbalife",
} as const;

export const sharedQuestions = [
  {
    question: "Qual é a relação entre a mentoria e o game?",
    answer: "A Última Cartada é a mentoria de Magaly Abreu. Cartada Viva é o game de hábitos incluído nessa experiência. São propostas distintas e relacionadas: a mentoria oferece o acompanhamento, e o game aproxima a prática do cotidiano.",
  },
  {
    question: "Preciso comprar o game além da mentoria?",
    answer: consultoria.inclusion,
  },
  {
    question: "Preciso manter uma rotina perfeita para participar?",
    answer: "A proposta considera a vida real. Observar o contexto, experimentar pequenas ações e retomar depois de uma interrupção fazem parte do caminho. Não há promessa de um percurso sem dificuldades ou de resultados garantidos.",
  },
  {
    question: "Como saber as condições para participar?",
    answer: "Antes de decidir, esclareça com Magaly o formato do acompanhamento, a duração, os materiais, o investimento e as condições de acesso à mentoria e ao game.",
  },
  {
    question: "Qual é a duração da mentoria e do game incluído?",
    answer: `Duração da mentoria: ${consultoriaOfferDetails.mentorshipDuration}. Duração e jornadas incluídas no game: ${consultoriaOfferDetails.gameDuration}. A inclusão do game na mentoria está confirmada; os prazos devem ser esclarecidos antes da participação.`,
  },
  {
    question: "O game substitui atendimento psicológico, nutricional ou médico?",
    answer: "O Game Cartada Viva é uma experiência educativa de hábitos e não substitui atendimento psicológico, nutricional ou médico. A proposta e as condições da mentoria são apresentadas separadamente antes da participação.",
  },
] as const;

/** Sem valor padrão: um número encontrado na versão antiga não confirma o contato oficial. */
export function getConsultoriaContact(subject: "mentoria" | "game" = "mentoria") {
  const phone = process.env.CONSULTORIA_WHATSAPP_NUMBER?.trim() ?? "";
  if (!/^[1-9]\d{9,14}$/.test(phone)) return null;
  const message = subject === "game"
    ? "Olá, Magaly! Quero conhecer o Game Cartada Viva e entender sua relação com a mentoria."
    : "Olá, Magaly! Quero conhecer a Mentoria A Última Cartada e suas condições de participação.";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}


/** Canal comercial separado; não reutilizar automaticamente o contato da mentoria. */
export function getHerbalifeContact(existingCustomer = false) {
  const phone = process.env.CONSULTORIA_HERBALIFE_WHATSAPP_NUMBER?.trim() ?? "";
  if (!/^[1-9]\d{9,14}$/.test(phone)) return null;
  const message = existingCustomer
    ? "Olá, Magaly! Já tenho cadastro Herbalife e quero orientação para acessar minha conta e conferir as condições de compra."
    : "Olá, Magaly! Quero orientação sobre cadastro e compra de produtos Herbalife, separadamente da mentoria e do game.";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getHerbalifeRegistrationUrl() {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_HERBALIFE_REGISTRATION_URL?.trim() ?? "");
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

/** Checkout só pode ser habilitado com um destino Hotmart HTTPS explicitamente aprovado. */
export function getMentorshipCheckoutUrl(raw = process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_URL) {
  try {
    const url = new URL(raw?.trim() ?? "");
    const approvedHosts = new Set(["pay.hotmart.com", "checkout.hotmart.com", "go.hotmart.com"]);
    return url.protocol === "https:" && approvedHosts.has(url.hostname) && !url.port && !url.username && !url.password && !url.hash
      ? url.href
      : null;
  } catch {
    return null;
  }
}

/**
 * A variável permite complementar a identificação após nova aprovação, sem
 * ocultar o registro profissional já fornecido para o rodapé público.
 */
export function getConsultoriaProfessionalIdentity() {
  return process.env.CONSULTORIA_PROFESSIONAL_IDENTITY?.trim() || confirmedProfessionalIdentity;
}

/** Recebe somente o nome de usuário, evitando destinos externos arbitrários. */
export function getConsultoriaInstagram() {
  const username = (process.env.CONSULTORIA_INSTAGRAM_USERNAME?.trim() ?? "").replace(/^@/, "");
  if (!/^[a-zA-Z0-9_](?:[a-zA-Z0-9_.]{0,28}[a-zA-Z0-9_])?$/.test(username) || username.includes("..")) return null;
  return { username: `@${username}`, url: `https://www.instagram.com/${username}/` };
}
