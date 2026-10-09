# FICHE PRODUIT — Pages produit qui convertissent

Skill Claude pour rédiger des fiches produit et pages de vente e-commerce orientées conversion, basée sur la méthode des 5 blocs (« Pourquoi ton trafic ne convertit pas : la vraie erreur est sur ta page produit ») et adaptée au type de produit et à l'angle marketing.

## Installation

**Claude (application web ou bureau)** : compresser le dossier `fiche-produit/` en ZIP, puis l'importer dans les paramètres Skills.

**Claude Code** : copier le dossier dans `~/.claude/skills/fiche-produit/` (usage personnel) ou `.claude/skills/fiche-produit/` (projet).

## Structure

```
fiche-produit/
├── SKILL.md                       Rôle, principes, workflow, format de livraison, checklist
├── references/
│   ├── METHODE_5_BLOCS.md         La méthode du PDF, bloc par bloc
│   ├── TYPES_PRODUITS.md          Adapter les blocs : douleur, désir, confort, cadeau, prévention
│   ├── ANGLES.md                  Penser et juger l'angle marketing
│   └── CONFORMITE.md              Honnêteté, promesses, marques, Meta
├── templates/BRIEF_PRODUIT.md     Informations à fournir
└── examples/
    ├── ANTI_RONFLEMENT.md         Produit-douleur
    └── MONTRE.md                  Produit-désir/statut (+ variante cadeau)
```

## Utilisation

- « Fiche produit pour cette montre, angle cadeau pour la fête des pères, Dakar »
- « Réécris cette description, les gens cliquent mais n'achètent pas » (texte collé)
- « Donne-moi 3 titres pour mon correcteur de posture, angle douleurs de dos au bureau »

Le minimum : **le produit** et **l'angle**. Le reste (prix, offre, preuves, livraison) améliore la fiche — gabarit dans `templates/BRIEF_PRODUIT.md`.

## Limites

- N'invente aucun témoignage, chiffre ni caractéristique : les manques sont marqués `[À REMPLIR]` / `[À VÉRIFIER]`.
- Ne garantit aucun résultat de conversion ; une page se valide avec des données (voir `media-buyer-agent`).
