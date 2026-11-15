/** Ativar somente no build do ambiente aprovado; o valor padrão preserva o site atual. */
export function isConsultoriaSiteEnabled(): boolean {
  return process.env.ENABLE_CONSULTORIA_SITE === "true";
}
