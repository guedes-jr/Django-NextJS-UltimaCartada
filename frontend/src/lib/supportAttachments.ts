/** Espelha somente tamanho/extensão de apps.support.serializers; servidor continua validando o envio. */
export const SUPPORT_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
export const SUPPORT_ATTACHMENT_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".pdf", ".txt", ".doc", ".docx"] as const;
export const SUPPORT_ATTACHMENT_ACCEPT = SUPPORT_ATTACHMENT_EXTENSIONS.join(",");
export const SUPPORT_ATTACHMENT_HINT = "JPG, JPEG, PNG, WEBP, PDF, TXT, DOC ou DOCX. Até 10 MB.";

export function getSupportAttachmentError(file: Pick<File, "name" | "size"> | null): string | null {
  if (!file) return null;
  if (file.size > SUPPORT_ATTACHMENT_MAX_BYTES) return "O anexo deve ter no máximo 10 MB.";
  const dot = file.name.lastIndexOf(".");
  const extension = dot > 0 ? file.name.slice(dot).toLowerCase() : "";
  if (!(SUPPORT_ATTACHMENT_EXTENSIONS as readonly string[]).includes(extension)) {
    return "Formato de anexo não permitido. Use JPG, JPEG, PNG, WEBP, PDF, TXT, DOC ou DOCX.";
  }
  return null;
}
