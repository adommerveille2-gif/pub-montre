# WORKFLOW : démo produit

## Quand l'utiliser

Présentation du produit, utilisation, gros plans, détails, fonctionnement, comparaison visuelle, transformation.

## Références à charger

- `references/PRODUCT_CONSISTENCY.md` (prioritaire)
- `references/CAMERA_LANGUAGE.md`, `references/LIGHTING.md`
- `references/SCENE_ENGINE.md`, `references/PROMPT_ENGINE.md`
- `references/MODEL_SELECTION.md`, `references/HIGGSFIELD_ENGINE.md`

## Étapes

1. **Tri du brief**. Critique : photo du produit ou description précise. Sans photo, le dire et demander ou proposer une version neutre validée.
2. **PRODUCT LOCK** complet. Lister ce qui ne doit jamais changer.
3. **Fonctionnement** : décomposer ce que le produit fait en étapes visibles. Une étape = une scène.
4. **Plans clés** : plan d'ensemble (produit dans son contexte), gros plan (détail), usage (mains), résultat.
5. **Caméra** : static ou léger push-in pour les détails, stable pour la démonstration. Pas d'orbit sauf si demandé.
6. **Lumière** : neutre et propre, source motivée, reflets maîtrisés sur les surfaces brillantes.
7. **Modèle** : `seedance_2_5` ou `seedance_2_0` si photo produit de référence. `marketing_studio_video` si le format démo presets convient.
8. **Images de référence** : générer une image produit de référence (`marketing_studio_image` ou `gpt_image_2_5`) avant les plans si la photo fournie est insuffisante, en le disant.
9. **Présenter**, confirmer le coût, générer, contrôler la fidélité produit plan par plan.

## Points de vigilance

- Dérive du produit : c'est le risque principal. Contrôler chaque plan avec la photo de référence.
- Textes et logos illisibles : éviter les plans qui exigent leur lisibilité.
- Mouvement du produit lui-même : limiter, faire bouger la main.
- Comparaison visuelle : ne jamais inventer le produit concurrent, ni ses défauts.

## Sortie attendue

PRODUCTION PLAN, PRODUCT LOCK, STORYBOARD par étape de démonstration, GENERATION PLAN.
