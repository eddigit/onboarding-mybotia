"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle, Mail, Clock, Headphones } from "lucide-react";
import Link from "next/link";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const clientName = searchParams.get("name") || "";
  const agentName = searchParams.get("agent") || "votre assistant";

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(79,125,243,0.15) 0%, transparent 70%)" }}
      />

      <div className="max-w-lg w-full relative z-10">
        <div className="glass-card p-8 text-center">
          {/* Success icon */}
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ background: "rgba(34,197,94,0.15)" }}
          >
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-txt-primary mb-3">
            C&apos;est parti !
          </h1>

          <p className="text-txt-secondary mb-8">
            Merci{clientName ? ` ${clientName}` : ""} ! Votre cahier des charges
            est enregistré.
          </p>

          {/* Timeline */}
          <div className="text-left space-y-4 mb-8">
            <h2 className="text-sm font-semibold text-txt-primary text-center mb-4">
              Ce qui va se passer :
            </h2>

            <div className="flex gap-4 items-start">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(79,125,243,0.12)" }}
              >
                <Mail className="w-5 h-5 text-accent-blue" />
              </div>
              <div>
                <p className="text-sm font-medium text-txt-primary">
                  1. Récapitulatif par email
                </p>
                <p className="text-xs text-txt-secondary">
                  Vous recevez un récapitulatif dans les minutes qui suivent
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(79,125,243,0.12)" }}
              >
                <Clock className="w-5 h-5 text-accent-blue" />
              </div>
              <div>
                <p className="text-sm font-medium text-txt-primary">
                  2. Configuration de {agentName}
                </p>
                <p className="text-xs text-txt-secondary">
                  Notre équipe configure votre assistant dans les 48h
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(79,125,243,0.12)" }}
              >
                <Headphones className="w-5 h-5 text-accent-blue" />
              </div>
              <div>
                <p className="text-sm font-medium text-txt-primary">
                  3. Accès + accompagnement
                </p>
                <p className="text-xs text-txt-secondary">
                  Vous recevrez un accès direct + une session d&apos;accompagnement
                  pour la prise en main
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div
            className="rounded-xl p-4 mb-6"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <p className="text-sm text-txt-secondary">
              Une question ? Contactez-nous à{" "}
              <a
                href="mailto:gilles@coachdigitalparis.com"
                className="text-accent-blue font-medium hover:underline"
              >
                gilles@coachdigitalparis.com
              </a>
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/"
            className="btn-secondary"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-txt-muted">Chargement...</div>
        </main>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
