import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(79,125,243,0.15) 0%, transparent 70%)" }}
      />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.2) 0%, transparent 70%)" }}
      />
      <div className="text-center max-w-2xl px-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm text-accent-blue font-medium"
          style={{ background: "rgba(79, 125, 243, 0.1)", border: "1px solid rgba(79, 125, 243, 0.2)" }}>
          <Sparkles className="w-4 h-4" />
          Nouveau : Votre assistant IA sur mesure
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
          <span className="text-txt-primary">Créez votre </span>
          <span className="bg-gradient-to-r from-accent-blue via-accent-indigo to-accent-purple bg-clip-text text-transparent">assistant IA</span>
        </h1>
        <p className="text-txt-secondary text-lg sm:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
          Un parcours guidé en quelques minutes pour configurer votre collaborateur virtuel, adapté à votre pratique.
        </p>
        <Link href="/onboarding" className="btn-primary text-base px-10 py-4 gap-2 group">
          Commencer
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </main>
  );
}
