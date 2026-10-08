# MEDIA BUYER AGENT — Creative Intelligence & Conversion System

Skill Claude pour la publicité Meta (Facebook et Instagram) orientée conversion et rentabilité : analyse produit, compréhension client, angles, concepts créatifs, diagnostic de données, décisions de budget, tests et apprentissage continu.

## Installation

**Claude (application web ou bureau)** : compresser le dossier `media-buyer-agent/` en ZIP (le dossier doit contenir `SKILL.md` à sa racine ou dans un dossier unique), puis l'importer dans les paramètres Skills.

**Claude Code** : copier le dossier dans `~/.claude/skills/media-buyer-agent/` (usage personnel) ou `.claude/skills/media-buyer-agent/` (projet).

## Structure

```
media-buyer-agent/
├── SKILL.md                    Rôle, mission, routage, workflow, décisions, contrôle qualité
├── references/                 Connaissance spécialisée, chargée à la demande (14 fichiers)
├── examples/                   Exemples de comportement attendu (5 fichiers)
├── templates/                  Données à demander, journal d'apprentissage
└── tests/TEST_PROTOCOL.md      Protocole de test et auto-évaluation
```

## Utilisation

Exemples de demandes :

- « Voici mon produit et mon prix, par où commencer ? » → mode PRODUIT
- « Écris-moi 5 concepts pour un sac compressible, cible voyageurs » → mode CRÉATIF
- « Critique ce script UGC » (texte collé) → mode DIRECTION CRÉATIVE
- « Voici mon export Meta des 14 derniers jours » → mode DONNÉES
- « Mes campagnes ne vendent plus, pourquoi ? » → mode POST-MORTEM
- « Je fais quoi maintenant ? » → mode DÉCISION RAPIDE

Pour une analyse fiable, fournir : prix, coût produit, livraison, frais de paiement, marge, pays, export Meta (CSV ou capture lisible), période, changements de budget ou de créatifs. Le gabarit est dans `templates/CAMPAIGN_INPUT.md`.

## Limites

- La Skill ne se connecte à aucun compte publicitaire. Elle travaille sur ce qui lui est fourni.
- Elle ne garantit aucun résultat et ne remplace pas le Centre de politiques publicitaires de Meta.
- Elle n'invente aucune donnée. Les informations manquantes sont signalées.
