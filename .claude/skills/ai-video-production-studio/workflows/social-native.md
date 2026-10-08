# WORKFLOW : pub native et réseaux sociaux

## Quand l'utiliser

Vidéo qui ressemble à du contenu normal de réseaux (TikTok, Instagram Reels, Facebook, YouTube Shorts), avec un objectif de publicité native.

## Références à charger

- `references/SOCIAL_VIDEO_ENGINE.md` (prioritaire)
- `references/UGC_ENGINE.md` si le format est une personne qui parle
- `references/SCENE_ENGINE.md`, `references/PROMPT_ENGINE.md`
- `references/MODEL_SELECTION.md`, `references/HIGGSFIELD_ENGINE.md`

## Étapes

1. **Tri du brief**. Assumable : 15 à 30 s, 9:16, ton organique.
2. **Accroche** : travailler les 2 premières secondes en premier. Une situation, un geste, une question.
3. **Structure** : accroche, contexte, démonstration, résolution, sortie.
4. **Native** : cadrage téléphone, son réel ou musique discrète, pas de logo animé, pas de transition élaborée.
5. **Rythme** : une scène toutes les 3 à 5 secondes.
6. **Texte à l'écran** : seulement si demandé, court, hors zones masquées par l'interface.
7. **Modèle** : `marketing_studio_video` pour un format pub rapide avec presets (format 9:16 explicite), `kling3_0` pour un plan avec audio, `seedance_2_0_mini` pour des tests rapides et économiques.
8. **Déclinaisons** : garder le même script et les mêmes personnages, varier seulement l'accroche. Proposer 2 accroches pour test si l'utilisateur veut tester.
9. **Présenter**, confirmer, générer, contrôler.

## Points de vigilance

- Format 16:9 pour du vertical : vérifier le ratio avant génération.
- Accroche trop lente : c'est la première chose à corriger.
- Ton publicitaire : réécrire en langage parlé.

## Sortie attendue

PRODUCTION PLAN avec accroche proposée, STORYBOARD, GENERATION PLAN, éventuellement variantes d'accroche.
