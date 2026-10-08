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

## Moteur d'apprentissage v1 (phase 1)

Code dans `packages/core`, sans dépendance à la base ni à React.

- **Maîtrise** : moyenne pondérée des scores, avec deux pseudo-observations à 0,5. Pondération par difficulté, décroissance par demi-vie de 30 jours. Une bonne réponse isolée ne donne pas 100 %.
- **Confiance** : croît avec le poids des preuves. Un niveau « Maîtrisé » est plafonné tant que la confiance est faible.
- **Niveaux** : 1 à 5, dérivés de la maîtrise (`levelFromEstimate`).
- **Agrégation** : moyenne pondérée par notion ; les notions sans preuve réduisent la couverture, pas la moyenne.
- **Révision** : intervalles par niveau (1 à 14 jours), version v1 à remplacer par FSRS sans changer les appelants.
- **Parcours** : règles explicites (`buildPlan`), le LLM ne fait que formuler.
- **Calendrier** : « aujourd'hui » et séries calculés dans le fuseau de l'étudiant.

Chaque réponse produit une `LearningEvent` par notion liée à la question. La `MasteryState` et la `ReviewItem` sont recalculées à partir des événements.

## Tuteur IA

- SDK Anthropic, modèle `TUTOR_MODEL` (défaut : `claude-sonnet-5-5`).
- Consignes pédagogiques : explique, propose des questions de vérification, ne pose aucun diagnostic.
- Sans `ANTHROPIC_API_KEY`, l'interface l'indique et désactive l'envoi. Aucune réponse n'est simulée.
- Pas encore de RAG ni de citations de cours (phase 2).

## Phase 2 : documents, RAG partiel, cas cliniques, plan

- **Import** : PDF, DOCX, PPTX, PNG, JPEG, 15 Mo maximum. Le contenu doit correspondre au format annoncé (signature vérifiée). Extraction page par page (PDF) ou diapositive par diapositive (PPTX).
- **Images** : enregistrées, mais le texte n'est pas extrait (OCR non disponible). Le motif est affiché à l'étudiant.
- **Stockage** : fichiers privés, nom aléatoire, un dossier par étudiant, hors dossier public (`STORAGE_DIR`). Aucune URL de téléchargement n'est exposée.
- **Fragments** : 350 mots avec 50 mots de recouvrement, numéro de page conservé.
- **Recherche** : plein texte français (`to_tsvector('french')`), filtrée par propriétaire dans la requête SQL.
- **Tuteur** : option « Répondre uniquement à partir de mon cours ». Les passages trouvés sont fournis au modèle, cités `[C1]`, et les citations sont enregistrées avec la réponse. Activé uniquement avec la clé API.
- **Pas encore fait** : RAG vectoriel (embeddings, pgvector) et « Je réfléchis » (notation du raisonnement), qui demandent la clé API.
- **Cas cliniques** : parcours étape par étape, indices à la demande, réponse attendue après réflexion. Rien n'est enregistré en base à ce stade.
- **Révisions espacées** : bilan par échéance (aujourd'hui, demain, 3, 7, 14 jours) calculé dans le fuseau de l'étudiant.
- **Plan de révision** : répartition du temps jusqu'à l'examen, proportionnelle à la priorité des notions et alternée chaque jour. Recalculable à tout moment.

## Contenu de démonstration

`packages/db/prisma/seed-demo.ts` ajoute 5 QCM et 2 cours marqués comme démonstration. Ils doivent être remplacés par du contenu rédigé et validé par des enseignants avant tout usage réel.

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
| 1. MVP : dashboard, taxonomie, cours, QCM, correction, progression, niveau réel, tuteur | Livrée : moteur v1, QCM et correction, progression, niveau réel, tuteur (activé par `ANTHROPIC_API_KEY`) |
| 2. Import PDF, RAG, cas cliniques, raisonnement clinique, révision espacée, plan | À faire |
| 3. Voix, analyse d'images, flashcards avancées, gamification | À faire |
| 4. Anatomie 3D, administration avancée | À faire |
