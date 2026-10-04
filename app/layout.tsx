import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { NAME, TAGLINE } from "./site";

const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://charoori.com"),
  title: { default: `${NAME} — ${TAGLINE}`, template: `%s — ${NAME}` },
  description: TAGLINE,
  openGraph: { title: NAME, description: TAGLINE, type: "website", url: "https://charoori.com" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${mono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
