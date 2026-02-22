import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Créez Votre Assistant IA | Coach Digital Paris",
  description:
    "Configurez votre assistant IA personnalisé en quelques minutes. Un parcours simple et guidé pour définir votre collaborateur virtuel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-navy-950 antialiased">{children}</body>
    </html>
  );
}
