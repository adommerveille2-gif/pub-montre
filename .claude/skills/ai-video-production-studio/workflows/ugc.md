# WORKFLOW : UGC

## Quand l'utiliser

Témoignage, selfie, face caméra, découverte produit, unboxing, démonstration, problème → solution, réaction, avant/après, avis client, conversation naturelle.

## Références à charger

- `references/UGC_ENGINE.md` (grammaire et types)
- `references/CHARACTER_CONSISTENCY.md` (personnage)
- `references/PRODUCT_CONSISTENCY.md` (produit)
- `references/PROMPT_ENGINE.md`, `references/AUDIO_ENGINE.md`
- `references/MODEL_SELECTION.md`, `references/HIGGSFIELD_ENGINE.md`

## Étapes

1. **Tri du brief** (SKILL.md section 7). Critique : produit, idée, présence ou non d'un personnage. Assumable : durée (30 s par défaut), 9:16, style natif.
2. **Choisir le type UGC** dans `UGC_ENGINE.md`. Un seul type par vidéo.
3. **Structure** : hook (0–3 s), problème ou contexte, découverte, usage ou démonstration, ressenti, recommandation. Retirer tout ce qui ne fait pas avancer.
4. **Personnage** : fiche CHARACTER LOCK. Si l'utilisateur n'a pas fourni de personnage, en proposer un crédible et cohérent avec la cible. Dire qu'il s'agit d'une personne générée.
5. **Produit** : fiche PRODUCT LOCK. Montrer le produit au moins une fois de façon nette, pas forcément au premier plan.
6. **Scènes** : 5 à 7 scènes pour 30 secondes, une action par scène.
7. **Prompts** par scène (PROMPT_ENGINE).
8. **Modèle** : privilégier un modèle à références (`seedance_2_5`, `seedance_2_0`) si personnage et produit sont fournis en image. Sinon `kling3_0` (audio, multi-plans) ou `marketing_studio_video` si le format presets convient.
9. **Présenter** PRODUCTION PLAN, STORYBOARD, GENERATION PLAN.
10. **Confirmer** le coût (`get_cost`) avant génération.
11. **Générer** : image de référence personnage et produit si nécessaire (`generate_image`), puis plans image vers vidéo.
12. **Contrôler** (QUALITY_CONTROL), corriger plan par plan, assembler.

## Points de vigilance

- Ne jamais présenter la personne générée comme une vraie cliente sans preuve. Le signaler.
- Éviter les acteurs trop parfaits, la lumière de studio, le produit centré.
- Pas de texte à l'écran sauf demande.

## Sortie attendue

PRODUCTION PLAN, STORYBOARD par scène, GENERATION PLAN avec coût estimé, puis résultats et contrôle si générés.
