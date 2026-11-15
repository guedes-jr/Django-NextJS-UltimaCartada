import { HerbalifeInformation } from "./HerbalifeInformation";
import { ConsultoriaHome, ConsultoriaMentorship, ConsultoriaGame } from "./ConsultoriaPages";
import { ConsultoriaShell } from "./ConsultoriaShell";
import { publicRoutes, type ConsultoriaPage } from "./content";

export function ConsultoriaPublicPage({ page }: { page: ConsultoriaPage }) {
  const Page = {
    home: ConsultoriaHome,
    mentorship: ConsultoriaMentorship,
    game: ConsultoriaGame,
    herbalife: HerbalifeInformation,
  }[page];
  return <ConsultoriaShell routes={publicRoutes} preview={false}><Page routes={publicRoutes} /></ConsultoriaShell>;
}
