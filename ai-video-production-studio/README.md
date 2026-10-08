# AI VIDEO PRODUCTION STUDIO

Skill Claude de réalisation vidéo IA. Il transforme un script, un brief, une idée, un produit ou une image de référence en production structurée (concept, storyboard, scènes, direction artistique, prompts), puis lance la génération via le MCP officiel Higgsfield lorsqu'il est connecté.

Indépendant de tout Skill marketing ou média.

## Installation

Dans ce dépôt, le Skill est déjà copié dans `.claude/skills/ai-video-production-studio/`, là où Claude Code le charge automatiquement.

Pour l'utiliser ailleurs : copier le dossier `ai-video-production-studio/` dans `~/.claude/skills/` (usage personnel) ou dans `.claude/skills/` d'un autre projet.

## Connexion Higgsfield (génération réelle)

Sans connexion, le Skill produit le plan, les scènes et les prompts, mais ne génère rien. Pour lancer les générations :

1. Connecter le MCP officiel de Higgsfield à Claude (voir la documentation Higgsfield pour l'endpoint MCP et l'authentification).
2. Vérifier que les outils `mcp__Higgsfield__*` apparaissent dans la session.
3. Demander une vidéo : le Skill vérifie les outils, les modèles et les crédits avant de lancer.

Les générations consomment des crédits. Le Skill annonce le coût estimé et attend ta confirmation avant de lancer.

## Utilisation

| Demande | Ce qui se passe |
|---|---|
| « Voici mon script, crée la vidéo. » | Mode AUTO : plan de production, storyboard, génération après confirmation du coût |
| « Propose-moi le concept avant de générer. » | Mode DIRECTOR : s'arrête après la direction artistique |
| « Fais juste cette scène. » | Mode SCENE |
| « Corrige le plan 02, le bracelet change. » | Mode REWORK : diagnostic et correction du seul plan |
| « Refais ce style. » | Mode REPLICATE : principe visuel, sans copie d'une œuvre protégée |

## Structure

```
ai-video-production-studio/
├── SKILL.md              cerveau : rôle, modes, workflow, règles Higgsfield et continuité
├── README.md             ce fichier
├── references/           15 moteurs de connaissance, chargés à la demande
├── workflows/            7 marches à suivre par type de vidéo
└── examples/             4 cas complets (UGC, produit, cinéma, correction)
```

## Limites connues

- Les modèles Higgsfield changent. Les durées et options listées dans `references/HIGGSFIELD_ENGINE.md` datent du 8 octobre 2026 : le Skill les relit via `models_explore` avant chaque génération.
- La fidélité d'un produit ou d'un visage dépend des images de référence fournies. Sans référence, la cohérence est plus fragile.
- Le lip-sync parfait n'est pas garanti : un contrôle humain reste nécessaire.
- Les personnes générées ne doivent pas être présentées comme de vraies clientes ou expertes sans preuve et sans respect des règles de transparence des plateformes.
