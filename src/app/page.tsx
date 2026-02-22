import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-dark-50">
      <div className="text-center max-w-xl px-6">
        <h1 className="text-4xl font-bold text-dark-900 mb-4">
          Coach Digital Paris
        </h1>
        <p className="text-dark-600 mb-8 text-lg">
          Créez votre assistant IA personnalisé en quelques minutes.
        </p>
        <Link
          href="/onboarding"
          className="btn-primary text-base px-8 py-4"
        >
          Commencer l&apos;onboarding
        </Link>
      </div>
    </main>
  );
}
