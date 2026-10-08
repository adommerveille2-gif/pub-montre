# MODEL SELECTION : choisir selon le besoin

Ne pas choisir un modèle au hasard. Partir du besoin, vérifier la disponibilité avec `models_explore`, puis justifier le premier choix en une phrase.

## Critères

| Critère | Question à poser |
|---|---|
| Réalisme | Le spectateur doit-il croire à une personne réelle ? |
| Mouvement humain | Le geste est-il simple (poser, tenir) ou complexe (marcher, danser) ? |
| Dialogue / lip-sync | La personne parle-t-elle à l'écran ? |
| Cohérence personnage | Le même visage revient-il sur plusieurs plans ? |
| Produit | Le produit doit-il rester exact ? |
| Mouvement caméra | Y a-t-il un mouvement de caméra précis à respecter ? |
| Cinématique | Le rendu doit-il ressembler à un film ? |
| UGC | Le rendu doit-il ressembler à un téléphone ? |
| Durée | Quelle durée minimale et maximale par plan ? |
| Qualité | Résolution nécessaire (720p suffit souvent pour le social) ? |
| Coût | Budget de crédits pour la série ? |

## Arbre de décision (orientation, pas règle absolue)

- **Personnage de référence + produit à conserver** → `seedance_2_5` ou `seedance_2_0` (références image, identité).
- **Cinéma avec contrôle caméra et lumière** → `cinematic_studio_video_4_0`.
- **Plan multi-plans avec audio dans une seule génération** → `kling3_0` ou `cinematic_studio_video_v2`.
- **Pub produit prête à publier, format de presets** → `marketing_studio_video`.
- **Transfert de mouvement d'une vidéo de référence vers un personnage** → `motion_control` ou `hf_mult_motion_control`.
- **Recréer une pub existante pour un autre produit ou marché** → `ad_multiplier_v2`.
- **Dialogue avec lèvres synchronisées** → générer la vidéo puis `sync_so`.
- **Test rapide et économique** → `seedance_2_0_mini`, `grok_video_v15_lite` ou `kling3_0_turbo`.
- **Plan de détail produit à fort contrôle** → image de référence via `generate_image`, puis image vers vidéo.

## Justification

Formulation attendue : « Je prends `[modèle]` parce que [raison principale]. Alternative : `[modèle]` si [condition]. »

## Quand ne pas utiliser un modèle

- Une fonction absente du modèle (ex. dialogue sans audio) : ne pas la simuler.
- Un modèle dont la durée minimale dépasse le plan voulu.
- Un modèle non disponible sur le compte : vérifier avant.
