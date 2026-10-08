# WORKFLOW : cinématique

## Quand l'utiliser

Luxe, premium, storytelling, lifestyle, corporate, émotion, produit héroïque.

## Références à charger

- `references/CINEMATIC_ENGINE.md`, `references/LIGHTING.md`, `references/CAMERA_LANGUAGE.md`
- `references/PRODUCT_CONSISTENCY.md`, `references/CHARACTER_CONSISTENCY.md` si présents
- `references/AUDIO_ENGINE.md`, `references/PROMPT_ENGINE.md`
- `references/MODEL_SELECTION.md`, `references/HIGGSFIELD_ENGINE.md`

## Étapes

1. **Tri du brief**. Assumable par défaut : 20 à 30 s, 16:9 si web ou 9:16 si social, style premium sobre.
2. **Intention** : quelle émotion, quelle promesse, quel souvenir veut-on laisser ? Un seul sentiment dominant.
3. **Style** : choisir un style dans `CINEMATIC_ENGINE.md` (luxe sobre, lifestyle premium, émotionnel, héroïque, corporate). Une seule direction.
4. **Palette et lumière** : deux ou trois couleurs, une source de lumière par lieu.
5. **Découpage** : 4 à 6 plans pour 20 à 30 s, plans plus longs (5 à 8 s), mouvements lents.
6. **Produit** : reveal ou plan héroïque, fiche PRODUCT LOCK.
7. **Modèle** : `cinematic_studio_video_4_0` par défaut pour le contrôle caméra et lumière. `kling3_0` si plusieurs plans avec audio dans la même génération. `seedance_2_5` si références produit ou personnage fortes.
8. **Prompts** : une seule consigne caméra par plan.
9. **Son** : nappe, silence stratégique, bruitage sur le reveal.
10. **Présenter** le plan, confirmer le coût, générer, contrôler.

## Points de vigilance

- Trop de mouvements de caméra : un par plan.
- Produit décoratif : il doit avoir une fonction dans le plan.
- Étalonnage incohérent : fixer la palette dans chaque prompt.

## Sortie attendue

PRODUCTION PLAN avec style et palette, STORYBOARD avec plans longs, GENERATION PLAN.
