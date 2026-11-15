import localFont from "next/font/local";

export const cormorant = localFont({
  src: "../../assets/fonts/CormorantGaramond-Latin.woff2",
  variable: "--font-editorial",
  weight: "500 600",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const montserrat = localFont({
  src: "../../assets/fonts/Montserrat-Latin.woff2",
  variable: "--font-interface",
  weight: "400 600",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});
