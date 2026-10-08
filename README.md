# Tuteur médical personnel

Application web pour étudiants en médecine, de la 1re à la 6e année : cours, QCM, cas cliniques, révision espacée et suivi du niveau réel.

> Outil éducatif. Il ne remplace pas un avis médical et ne sert pas au diagnostic ni au traitement de patients.

## Prérequis

- Node.js 22 (voir `.nvmrc`)
- pnpm 10
- PostgreSQL 16 avec l'extension **pgvector** (requise dès la phase 2)

## Démarrage

```bash
pnpm install
cp .env.example .env              # puis compléter (voir ci-dessous)
cp .env.example packages/db/.env  # même DATABASE_URL pour Prisma
cp .env.example apps/web/.env.local

pnpm db:migrate        # crée la base et applique les migrations (développement)
pnpm --filter @pub-montre/db exec prisma db seed   # années 1 à 6 et matières de départ
pnpm dev               # http://localhost:3000
```

En développement, `EMAIL_DRIVER=console` (valeur par défaut hors production) affiche le lien de connexion dans le terminal, sans SMTP.

## Structure

```
apps/web            Next.js (App Router), TypeScript, Tailwind CSS
packages/db         Schéma Prisma, migrations, seed, client partagé
docs/               Architecture et décisions
.github/workflows   CI : lint, typecheck, tests, build, E2E
```

Les packages `core` (moteur d'apprentissage), `ai` (LLM, RAG) et `shared` seront créés dans leurs phases respectives. Voir [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Commandes

| Commande | Rôle |
|---|---|
| `pnpm dev` | Serveur de développement |
| `pnpm build` | Build de production |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript (app + base) |
| `pnpm test` | Tests unitaires et tests de schéma (base de test) |
| `pnpm test:e2e` | Parcours Playwright (desktop et mobile) |
| `pnpm db:migrate` | Migration de développement |
| `pnpm db:studio` | Interface Prisma Studio |

Les tests de base utilisent `TEST_DATABASE_URL` (par défaut `pubmontre_test`) : ne jamais pointer vers la base de développement.

## Tests end-to-end

Playwright installe son navigateur en CI. En local, si Chromium est déjà disponible :

```bash
PLAYWRIGHT_CHROMIUM_PATH=/chemin/vers/chromium pnpm test:e2e
```
