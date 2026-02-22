# Onboarding MyBotIA

Formulaire d'onboarding en 7 étapes pour configurer un assistant IA personnalisé, intégré au site coachdigitalparis.com.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** pour le styling
- **Zod** pour la validation côté serveur
- **Framer Motion** pour les animations de transition
- **Lucide React** pour les icônes

## Installation

```bash
npm install
cp .env.example .env.local
# Remplir les variables d'environnement dans .env.local
npm run dev
```

## Variables d'environnement

Voir `.env.example` pour la liste complète. Les services (Resend, Notion, Webhook) fonctionnent en mode dégradé si non configurés (log d'avertissement, pas de blocage).

## Structure

```
src/
├── app/
│   ├── page.tsx                    # Page d'accueil
│   ├── layout.tsx                  # Layout racine
│   ├── globals.css                 # Styles globaux + Tailwind
│   ├── onboarding/
│   │   ├── page.tsx                # Formulaire multi-step
│   │   └── confirmation/
│   │       └── page.tsx            # Page de confirmation post-soumission
│   └── api/
│       └── onboarding/
│           └── route.ts            # API POST — validation + dispatch
├── components/
│   ├── ui/                         # Composants réutilisables
│   │   ├── StepProgress.tsx        # Barre de progression
│   │   ├── StepContainer.tsx       # Container avec navigation
│   │   ├── RadioOption.tsx         # Radio avec description
│   │   ├── CheckboxGroup.tsx       # Groupe de checkboxes
│   │   ├── RankList.tsx            # Classement par flèches
│   │   ├── DynamicTaskList.tsx     # Liste de tâches dynamique
│   │   ├── PlanCard.tsx            # Carte de tarification
│   │   ├── ExampleHint.tsx         # Exemples contextuels
│   │   └── InfoBox.tsx             # Encadré d'information
│   └── steps/                      # Les 7 étapes du formulaire
│       ├── Step1Profile.tsx
│       ├── Step2Assistant.tsx
│       ├── Step3Missions.tsx
│       ├── Step4Character.tsx
│       ├── Step5Rules.tsx
│       ├── Step6Routine.tsx
│       └── Step7Ecosystem.tsx
├── lib/
│   ├── validation.ts               # Validation côté client
│   ├── serverValidation.ts         # Schéma Zod côté serveur
│   ├── generateMarkdown.ts         # Génération du markdown structuré
│   ├── webhook.ts                  # Envoi webhook vers VPS Atlas
│   ├── notion.ts                   # Création entrée Notion
│   ├── email.ts                    # Envoi emails via Resend
│   └── rateLimit.ts                # Rate limiting en mémoire
└── types/
    └── onboarding.ts               # Types TypeScript + constantes
```

## Flux de soumission

1. Le client remplit les 7 étapes du formulaire
2. À la soumission, `POST /api/onboarding` est appelé
3. Validation Zod côté serveur
4. Génération du markdown structuré
5. Dispatch parallèle vers : Webhook VPS, Notion, Resend
6. Redirection vers la page de confirmation

## Pages

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/onboarding` | Formulaire 7 étapes |
| `/onboarding/confirmation` | Confirmation post-soumission |
| `/api/onboarding` | API POST |
