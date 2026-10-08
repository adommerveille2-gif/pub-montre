# CINEMATIC ENGINE : luxe, émotion, produit héroïque

## Objectif

Donner à la marque une présence de film : le produit est un personnage, la lumière est travaillée, le rythme respire. Le piège est l'excès : un plan qui cherche à être beau sans raison devient vide.

## Ingrédients

- **Lumière motivée** : une source claire, des ombres assumées (voir `LIGHTING.md`).
- **Mouvement lent et motivé** : push-in lent, reveal, pull-back, tracking doux.
- **Profondeur de champ choisie** : bokeh pour isoler, profondeur pour raconter.
- **Palette maîtrisée** : deux ou trois couleurs dominantes, une teinte d'accent.
- **Son** : une nappe musicale discrète, des bruitages précis, parfois du silence.
- **Découpage** : plans plus longs (5 à 8 s), transitions simples.

## Styles

| Style | Lumière | Caméra | Palette | Son |
|---|---|---|---|---|
| Luxe sobre | Source douce, contre-jour léger | Lente, statique ou push-in | Noir, or discret, blanc chaud | Nappe + détail mécanique |
| Premium lifestyle | Golden hour, fenêtre | Tracking lent, medium wide | Tons chauds naturels | Ambiance + musique légère |
| Storytelling émotionnel | Basse lumière, contraste | Medium close-up, mouvements très lents | Désaturée, teinte unique | Silence, puis musique |
| Produit héroïque | Dramatique, reflets maîtrisés | Reveal, orbit lent | Fond neutre ou sombre | Impact sonore sur le reveal |
| Corporate | Neutre, propre | Static, medium | Bleu ou gris de marque | Musique discrète |

## Choix de modèle (rappel)

- Cinéma le plus avancé avec contrôle caméra et lumière : `cinematic_studio_video_4_0` (durée 4 à 30 s, options caméra, lumière et genre).
- Cinéma avec multi-plans et son : `cinematic_studio_video_v2` ou `kling3_0`.
- Référence d'identité ou de produit forte : `seedance_2_5` ou `seedance_2_0`.

Détails et contraintes : `MODEL_SELECTION.md`, `HIGGSFIELD_ENGINE.md`.

## Erreurs fréquentes

- Trop de mouvement de caméra : un plan = un mouvement.
- Produit trop lent ou trop figé, rendant la vidéo statique.
- Musique qui couvre la voix-off.
- Étalonnage incohérent d'un plan à l'autre.
- Effet « film de parfum » générique : partir du produit réel, de son usage réel, de la personne réelle.

## Checklist cinématique

- La lumière a une source identifiable.
- Un seul mouvement de caméra par plan.
- Le produit a un rôle dans le plan (il n'est pas là pour décorer).
- La palette est la même sur toute la vidéo.
- Le son soutient le plan, il ne le double pas.
