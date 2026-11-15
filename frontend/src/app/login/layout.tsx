import type { ReactNode } from "react";
import { ConsultoriaAccessTheme } from "@/components/consultoria/ConsultoriaAccessTheme";

export default function AccessLayout({ children }: { children: ReactNode }) {
  return <ConsultoriaAccessTheme>{children}</ConsultoriaAccessTheme>;
}
