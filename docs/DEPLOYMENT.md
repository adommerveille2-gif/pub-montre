# Mise en production

Cette page décrit ce qu'il faut préparer pour mettre l'application en ligne. Elle ne déploie rien seule : chaque service demande un compte et une facturation à votre nom.

## 1. Services nécessaires

| Besoin | Exemple | Points à vérifier |
|---|---|---|
| Hébergement de l'application (Next.js) | Vercel, ou tout hébergeur Node.js | Variables secrètes, commande de build |
| Base PostgreSQL 16 | Neon, Supabase, ou PostgreSQL géré | **Extension pgvector disponible** (sinon la recherche sémantique ne fonctionne pas) |
| Stockage objet privé | Cloudflare R2, AWS S3 | Bucket privé, jeton avec accès en lecture et écriture à ce seul bucket |
| Envoi d'e-mails (SMTP) | Brevo, Postmark, Resend en SMTP | Domaine d'envoi vérifié, sinon les liens de connexion finissent en spam |
| IA (facultatif) | Anthropic, OpenAI | Clés dédiées à la production, avec limite de dépense |

## 2. Variables d'environnement

À renseigner dans les réglages secrets de l'hébergeur, **jamais** dans le dépôt.

| Variable | Obligatoire | Exemple | Rôle |
|---|---|---|---|
| `DATABASE_URL` | oui | `postgresql://…?sslmode=require` | Base de données |
| `AUTH_SECRET` | oui | 32 caractères ou plus (`openssl rand -base64 32`) | Signature des sessions |
| `AUTH_URL` | oui | `https://votre-domaine.fr` | Adresse publique (https) |
| `EMAIL_DRIVER` | oui | `smtp` | Envoi réel des liens |
| `SMTP_URL` | oui | `smtp://utilisateur:motdepasse@smtp.exemple.fr:587` | Serveur SMTP |
| `EMAIL_FROM` | non | `Tuteur médical <no-reply@votre-domaine.fr>` | Expéditeur |
| `STORAGE_DRIVER` | oui | `s3` | Stockage persistant |
| `S3_BUCKET` | oui | `pub-montre-prod` | Nom du bucket |
| `S3_ENDPOINT` | pour R2 | `https://<identifiant-compte>.r2.cloudflarestorage.com` | Point d'accès S3 |
| `S3_REGION` | non | `auto` (R2) ou `eu-west-3` (AWS) | Région |
| `S3_ACCESS_KEY_ID` | oui | | Identifiant du jeton |
| `S3_SECRET_ACCESS_KEY` | oui | | Secret du jeton |
| `ANTHROPIC_API_KEY` | non | | Tuteur IA |
| `OPENAI_API_KEY` | non | | Recherche sémantique |

Au démarrage, le serveur signale dans ses journaux toute variable obligatoire manquante ou mal formée. La route `/api/health` vérifie la base de données sans rien révéler de la configuration.

## 3. Ordre de mise en place

1. **Base** : créer la base, activer l'extension `vector` (`CREATE EXTENSION IF NOT EXISTS vector;`).
2. **Stockage** : créer le bucket **privé**, générer un jeton limité à ce bucket.
3. **E-mail** : vérifier le domaine d'envoi, récupérer les identifiants SMTP.
4. **Variables** : renseigner le tableau ci-dessus dans l'hébergeur (environnement de production).
5. **Migrations** : appliquer le schéma avant de démarrer l'application :
   ```bash
   DATABASE_URL="…production…" pnpm db:migrate:deploy
   ```
6. **Données de base** (une seule fois, sans contenu de démonstration) :
   ```bash
   DATABASE_URL="…production…" SEED_DEMO=false pnpm --filter @pub-montre/db exec prisma db seed
   ```
7. **Premier administrateur** : il n'existe qu'en base, puisque personne ne peut s'en donner un depuis l'interface. Après une première connexion avec votre adresse, passez votre rôle à `ADMIN` :
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'votre-adresse@exemple.fr';
   ```
8. **Déploiement** de l'application, puis vérifications :
   - `https://votre-domaine.fr/api/health` répond `{"status":"ok"}` ;
   - la connexion par lien reçu par e-mail fonctionne ;
   - un import de cours PDF et sa recherche fonctionnent ;
   - les journaux ne contiennent aucune erreur de configuration.

## 4. Points à régler avant d'ouvrir à de vrais étudiants

- **Contenu validé** : remplacer les QCM, cas et cartes de démonstration par du contenu relu par des enseignants.
- **Modèles 3D** : seuls des modèles licenciés et relus peuvent être publiés.
- **Limitation par adresse IP** : active. Vérifiez que l'hébergeur transmet bien l'adresse du client dans `x-forwarded-for` (sinon la limite IP ne s'applique pas).
- **Sauvegardes** de la base et du bucket, avec un test de restauration.
- **Relecture juridique** (dispositif médical, RGPD, droit d'auteur sur les cours importés) et mentions légales.
- **Surveillance** : un contrôle externe sur `/api/health` et la consultation régulière des journaux.
- **Limite de dépense** sur les clés d'IA.

## 5. Ce qui n'a pas été vérifié ici

Le stockage S3 n'a pas été testé contre un vrai bucket : seule la logique de contrôle des clés, de la configuration et de la route de santé a été vérifiée. Le premier déploiement doit être suivi de près.
