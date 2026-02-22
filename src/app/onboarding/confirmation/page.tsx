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
    <main className="min-h-screen bg-dark-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-dark-100 p-8 text-center">
          {/* Success icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-3">
            C&apos;est parti !
          </h1>

          <p className="text-dark-600 mb-8">
            Merci{clientName ? ` ${clientName}` : ""} ! Votre cahier des charges
            est enregistré.
          </p>

          {/* Timeline */}
          <div className="text-left space-y-4 mb-8">
            <h2 className="text-sm font-semibold text-dark-800 text-center mb-4">
              Ce qui va se passer :
            </h2>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-dark-800">
                  1. Récapitulatif par email
                </p>
                <p className="text-xs text-dark-500">
                  Vous recevez un récapitulatif dans les minutes qui suivent
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-dark-800">
                  2. Configuration de {agentName}
                </p>
                <p className="text-xs text-dark-500">
                  Notre équipe configure votre assistant dans les 48h
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-dark-800">
                  3. Accès + accompagnement
                </p>
                <p className="text-xs text-dark-500">
                  Vous recevrez un accès direct + une session d&apos;accompagnement
                  pour la prise en main
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-dark-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-dark-600">
              Une question ? Contactez-nous à{" "}
              <a
                href="mailto:gilles@coachdigitalparis.com"
                className="text-primary-600 font-medium hover:underline"
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
        <main className="min-h-screen bg-dark-50 flex items-center justify-center">
          <div className="text-dark-500">Chargement...</div>
        </main>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
