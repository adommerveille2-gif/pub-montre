# WORKFLOW : faceless

## Quand l'utiliser

Vidéo sans visage : mains, produit, environnement, POV, plans de détail, objets, actions.

## Références à charger

- `references/CAMERA_LANGUAGE.md`, `references/LIGHTING.md`
- `references/PRODUCT_CONSISTENCY.md`
- `references/SCENE_ENGINE.md`, `references/PROMPT_ENGINE.md`
- `references/MODEL_SELECTION.md`, `references/HIGGSFIELD_ENGINE.md`

## Étapes

1. **Tri du brief**. Critique : le produit et l'action principale. Assumable : durée 15 à 30 s, 9:16, ambiance quotidienne.
2. **Histoire sans visage** : l'action est portée par les mains, le produit, le lieu. Chaque scène a un geste.
3. **Types de plans** : POV (regard de la personne), macro (détail matière), top-down (objets sur une table), main en action, environnement qui révèle le contexte.
4. **Mains** : point de dérive fréquent. Limiter aux gestes simples (poser, tenir, ouvrir, tourner). Éviter les doigts entrelacés et les gestes fins, ou les filmer partiellement.
5. **Modèle** : `seedance_2_0` ou `seedance_2_5` avec référence produit. `kling3_0_turbo` pour un plan simple et rapide. `minimax_h3` pour des keyframes 2K.
6. **Son** : bruitages très présents, c'est le principal vecteur d'émotion sans voix.
7. **Présenter**, confirmer, générer, contrôler (mains, produit, continuité).

## Points de vigilance

- Mains déformées : simplifier le geste ou le couper.
- Produit qui change de taille entre deux plans : PRODUCT LOCK obligatoire.
- Plans trop nombreux sans logique : chaque plan doit faire avancer l'histoire.

## Sortie attendue

PRODUCTION PLAN, STORYBOARD avec action par plan, GENERATION PLAN.
