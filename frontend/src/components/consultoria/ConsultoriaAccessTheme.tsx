import type { ReactNode } from "react";
import { isConsultoriaSiteEnabled } from "./release";
import { cormorant, montserrat } from "./fonts";
import theme from "./BrandTheme.module.css";
import styles from "./ConsultoriaAccessTheme.module.css";

/** A mudança de apresentação não participa da autorização das páginas. */
export function ConsultoriaAccessTheme({ children, preview = false }: { children: ReactNode; preview?: boolean }) {
  if (!preview && !isConsultoriaSiteEnabled()) return <>{children}</>;
  return <div data-consultoria-access-theme="true" className={`${theme.theme} ${styles.scope} ${preview ? styles.preview : ""} ${cormorant.variable} ${montserrat.variable}`}>{children}</div>;
}
