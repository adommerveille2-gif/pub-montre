# WORKFLOW : REWORK (correction d'une génération existante)

## Quand l'utiliser

L'utilisateur fournit une vidéo ou un plan déjà généré et demande une correction : produit qui change, personnage différent, mouvement raté, lip-sync décalé, plan à refaire.

## Ne jamais refaire toute la vidéo

Corriger le plan fautif, pas l'ensemble. Une génération complète coûte cher et peut introduire de nouvelles erreurs.

## Références à charger

- `references/QUALITY_CONTROL.md` (diagnostic)
- `references/PRODUCT_CONSISTENCY.md` ou `references/CHARACTER_CONSISTENCY.md` selon l'erreur
- `references/PROMPT_ENGINE.md`
- `references/HIGGSFIELD_ENGINE.md`

## Étapes

1. **Identifier le plan** et l'axe en erreur (grille de QUALITY_CONTROL).
2. **Diagnostic** au format :
   ```
   ERREUR       : ce qui ne va pas, précisément
   CAUSE PROBABLE : pourquoi (référence absente, prompt flou, action trop chargée, durée inadaptée)
   CORRECTION   : ce qui change dans le prompt ou les entrées
   NOUVELLE GÉNÉRATION : quel plan, quel modèle, combien de variantes, coût
   ```
3. **Choisir la correction la moins coûteuse** :
   - Retouche de prompt et référence renforcée : première option.
   - Changement de modèle si le modèle est inadapté à la tâche.
   - Édition vidéo (`flux_3_video_edit`, `kling_video_edit`, `seedance_2_5` en mode `video_edit`) si le problème est local et l'édition le permet.
   - Montage : couper une partie du plan, recadrer (`reframe`), ou remplacer un plan par un autre.
   - Upscale (`upscale_video`) uniquement si le problème est de qualité, pas de contenu.
4. **Confirmer le coût** puis générer, avec `count` 2 au plus si une variante doit être choisie.
5. **Contrôler** le nouveau plan et la continuité avec les plans voisins.

## Correspondances fréquentes

| Erreur | Cause probable | Correction |
|---|---|---|
| Bracelet de la montre qui change | Matière et couleur non verrouillées | Renforcer la référence produit, verrouiller matière, couleur, structure du bracelet |
| Visage qui change | Référence absente ou faible | Ajouter l'image de référence personnage en `start_image` |
| Mains déformées | Geste trop fin, plan trop serré | Simplifier le geste, élargir le cadre, couper le plan |
| Lip-sync décalé | Audio et vidéo de durées différentes | `sync_so` avec un `sync_mode` adapté |
| Caméra qui bouge alors qu'elle doit être fixe | Mouvement non précisé | Ajouter « caméra fixe » en tête du bloc caméra |
| Produit qui flotte | Action trop chargée | Produit posé, action réduite |

## Sortie attendue

Diagnostic court par plan, correction proposée, coût, puis le plan corrigé et son contrôle.
