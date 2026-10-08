# Architecture

Cette page décrit l'architecture retenue et son état d'avancement. Elle évolue avec le projet.

## Choix de la phase 0

| Sujet | Choix | Raison |
|---|---|---|
| Dépôt | Monorepo pnpm (`apps/*`, `packages/*`) | La future app mobile réutilisera la logique métier. |
| Frontend | Next.js (App Router), React 19, TypeScript strict | Rendu serveur, routage, streaming. |
| Style | Tailwind CSS 4, composants maison (`components/ui`) | Tokens sémantiques clair/sombre, sans dépendance lourde. |
| Données | PostgreSQL 16 + Prisma 7 (adaptateur `pg`) | Relations fortes, migrations versionnées. |
| Vecteurs | pgvector (extension installée, aucune table vectorielle encore) | Un seul moteur de données jusqu'au RAG. |
| Authentification | Auth.js v5, lien magique par e-mail, sessions en base | Pas de mot de passe ; sessions révocables côté serveur. |
| Autorisation | Rôles `STUDENT`, `CONTENT_REVIEWER`, `ADMIN` ; identité lue uniquement depuis la session (`lib/session.ts`) | Aucun accès aux données d'un autre étudiant par paramètre client. |
| Tests | Vitest (unitaire, schéma), Playwright (parcours E2E desktop et mobile) | Vérification réelle du parcours de connexion. |
| CI | GitHub Actions : lint, typecheck, tests, build, E2E, avec PostgreSQL pgvector | Chaque push est vérifié de la même façon qu'en local. |

## Hors périmètre

- **Monétisation** : aucun plan, quota ou paiement pour le moment. Ils seront ajoutés plus tard sans modifier le reste.

## Écarts par rapport à la cible initiale

- Les packages `core`, `ai` et `shared` ne sont pas encore créés : ils n'ont pas de logique à héberger en phase 0. Ils arrivent avec le moteur d'apprentissage (phase 1) et le tuteur (phase 2).
- Les tables d'embeddings ne sont pas créées : leur dimension dépend du fournisseur retenu pour le RAG (phase 2).

## Modèle de données (phase 0)

Le schéma couvre l'ensemble des entités prévues : taxonomie (`AcademicYear` → `SubjectYear` → `Subject` → `Chapter` → `Concept`), contenus (cours, questions, cas cliniques, flashcards, sources, modèles 3D), entraînement (`Quiz`, `QuizItem`, `QuizAttempt`), moteur (`LearningEvent`, `MasteryState`, `ReviewItem`, `LearningRecommendation`), tuteur (`Conversation`, `Message`), planification (`StudyPlan`, `StudySession`), gamification (`Achievement`, `UserAchievement`), traçabilité (`LlmUsage`, `AuditLog`).

Tout contenu pédagogique généré porte un `ContentStatus` (`DRAFT`, `VALIDATED`, `REJECTED`). Seul un contenu validé est présenté comme officiel.

Les matières et années ne sont pas codées en dur : `prisma/seed.ts` fournit une base de départ (années 1 à 6, 24 matières) modifiable ensuite depuis l'administration.

## Parcours d'authentification

1. `/login` : l'étudiant saisit son e-mail (`requestMagicLinkAction`).
2. Auth.js crée un jeton de vérification et envoie le lien (`lib/mailer.ts`, selon `EMAIL_DRIVER`).
3. Redirection vers `/login/verifier`, qui ne révèle pas si le compte existe.
4. Le lien ouvre une session en base, puis `/dashboard`.
5. Les sections authentifiées passent par `(app)/layout.tsx`, qui lit la session dans un `<Suspense>` (Cache Components).

## Feuille de route

| Phase | Statut |
|---|---|
| 0. Fondations : monorepo, CI, schéma, auth, design system, layout responsive, thème | Livrée |
| 1. MVP : dashboard, taxonomie, cours, QCM, correction, progression, niveau réel | À faire (moteur d'apprentissage v1 en premier) |
| 2. Import PDF, RAG, cas cliniques, raisonnement clinique, révision espacée, plan | À faire |
| 3. Voix, analyse d'images, flashcards avancées, gamification | À faire |
| 4. Anatomie 3D, administration avancée | À faire |
