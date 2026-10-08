# HIGGSFIELD ENGINE : utiliser le moteur réellement disponible

## 1. Disponibilité

Higgsfield est accessible via le connecteur MCP officiel. Avant toute action :

1. Vérifier que les outils `mcp__Higgsfield__*` sont chargés. S'ils n'apparaissent que comme noms différés, les charger avec ToolSearch (`select:mcp__Higgsfield__generate_video,...`).
2. Si aucun outil Higgsfield n'est disponible : livrer le PRODUCTION PLAN, les prompts et le GENERATION PLAN, dire clairement que la génération directe nécessite la connexion MCP de Higgsfield, et ne rien simuler.
3. Si disponibles : appeler `balance` une fois pour connaître les crédits et le plan.

## 2. Outils vérifiés (schémas lus)

| Outil | Rôle | Paramètres clés |
|---|---|---|
| `generate_video` | Une génération vidéo (variantes possibles, `count` 1 à 4) | `params.model` (requis), `prompt`, `medias` [{`role`, `value`}], `duration`, `aspect_ratio`, `count`, `get_cost`, `folder_id`, `use_unlim` |
| `generate_video_batch` | 2 à 12 requêtes indépendantes, sans widget | Même logique que `generate_video` |
| `generate_image` | Image de référence (personnage, produit, plan clé) | `params.model`, `prompt`, `medias`, `aspect_ratio`, `count`, `get_cost` |
| `models_explore` | Lister, chercher, lire les contraintes d'un modèle, recommander | `action` (list / search / get / recommend), `model_id` (pour get), `type`, `input` |
| `media_upload_widget` | Fichier local fourni par l'utilisateur | Appeler seul dans le tour. Schéma à charger avant usage |
| `media_import_url` | Importer un média depuis une URL HTTPS | `url`, `type` |
| `media_upload` + `media_confirm` | Upload par URL présignée (agent) | `files`, puis `media_ids` et `type` |
| `jobs_wait` | Attendre des jobs | `jobs` [{`index`, `job_id`}] (max 12), `timeout_seconds` ≤ 15 |
| `balance` | Crédits et plan | aucun |
| `transactions` | Historique de crédits | à charger avant usage |
| `get_workflow_instructions` | Charger un workflow multi-étapes | `workflow` (omis = liste) |
| `get_workflow_bundle_file` | Fichiers d'un workflow | à charger avant usage |
| `motion_control` | Transférer le mouvement d'une vidéo de référence vers un personnage (Kling 3.0) | `params.image_id`, `params.motion_video_id`, `resolution` (720p / 1080p), `scene_control` (image / video) |
| `upscale_video` | Améliorer la résolution d'une vidéo | `params.provider` (bytedance ou topaz), `video_id`, dimensions source pour bytedance |
| `reframe` | Recadrer une vidéo (modèle `reframe`) | voir `models_explore` |
| `show_generation_by_ids` | Afficher les résultats terminés | à charger avant usage |

Ne jamais utiliser un paramètre absent de ce tableau sans l'avoir lu via `models_explore` (action `get`).

## 3. Modèles vidéo vérifiés (listing du 8 octobre 2026)

Les durées et options sont celles renvoyées par `models_explore` au moment de la vérification. Relire `get` avant chaque génération : les contraintes peuvent changer.

| Modèle (`model`) | Usage principal | Durée | Remarques |
|---|---|---|---|
| `cinematic_studio_video_4_0` | Cinéma, contrôle caméra et lumière | 4 à 30 s | Modes t2v, omni_reference, video_edit, video_extension ; résolutions 480p, 720p, 1080p |
| `cinematic_studio_video_v2` | Cinéma, multi-plans | 3 à 12 s | `multi_shots`, `multi_prompt`, `sound` |
| `cinematic_studio_3_0` | Cinéma haut de gamme | 4 à 15 s | Résolutions 480p à 4k ; `genre`, `generate_audio` |
| `cinematic_studio_video` | Cinéma dramatique, plans courts | 5 ou 10 s | `sound`, `slow_motion` |
| `seedance_2_5` | Références image, vidéo, audio ; édition ; extension | 4 à 30 s | Très polyvalent, bon pour la cohérence de référence |
| `seedance_2_0` | Identité et produit en référence | 4 à 15 s | 4k en mode std |
| `seedance_2_0_mini` | Variante rapide et économique | 4 à 15 s | 480p / 720p |
| `seedance1_5` | Mouvement fiable | 4, 8 ou 12 s | Audio activable |
| `kling3_0` | Multi-plans, audio, transfert de mouvement | 3 à 15 s | Modes std, pro, 4k ; `sound` on / off |
| `kling3_0_turbo` | Image vers vidéo rapide | 3 à 15 s | 720p / 1080p |
| `kling_o3_image_reference` | Jusqu'à 7 images de référence | 3 à 15 s | `multi_shots`, `multi_prompt` |
| `kling_o3_flf` | Première et dernière image | 3 à 15 s | Idéal pour transitions contrôlées |
| `kling2_6` | Mouvement cinématique | 5 ou 10 s | Audio natif |
| `minimax_h3` | Références multimodales, 2K | 4 à 15 s | Keyframes, image/vidéo/audio en référence |
| `minimax_hailuo` | Physique naturelle, émotion faciale | 6 ou 10 s | Variantes minimax-2.3 et autres |
| `marketing_studio_video` | Pubs produit prêtes pour TikTok / Reels | 12 à 15 s | Presets `mode`, `product_ids`, `avatar_ids` (max 1), `hook_id`, `setting_id` |
| `grok_video_v15_lite` | Rapide, première image | 1 à 15 s | Audio disponible |
| `wan2_6` | Stylisé, expérimental | 5, 10 ou 15 s | Ratio 16:9, 9:16, 1:1 |
| `hf_mult_motion_control` (Genjutsu) | Transfert de mouvement et remplacement d'objet | selon modèle | Requiert image(s) et une vidéo de référence |
| `ad_multiplier_v2` | Recréer une pub source avec un autre casting ou produit | selon source | Source de 4 à 30 s |
| `sync_so` | Lip-sync : vidéo + audio | selon entrée | `sync_mode` : bounce, loop, cut_off, silence, remap |

Modèles d'image cités par l'outil `generate_image` (à vérifier avec `models_explore` avant usage) : `gpt_image_2_5` (image générale et édition de référence), `marketing_studio_image` (produit, pub), `soul_2` (portrait, UGC, éditorial), `soul_cast` (personnage texte seul).

## 4. Règles de génération

### Coût
1. Appeler avec `get_cost: true` avant toute génération. Ne jamais annoncer un coût de mémoire : le préflight est la seule source.
   Repère mesuré le 8 octobre 2026 : `seedance_2_0_mini`, 5 s, 720p, sans audio, 9:16 = 5 crédits. `grok_video_v15_lite`, 5 s, 480p = 5 crédits. Un plan de 5 s coûte donc souvent plus qu'il n'y paraît.
2. Présenter le total à l'utilisateur : nombre de plans × variantes × coût unitaire.
3. Attendre confirmation explicite avant de lancer, sauf budget accordé nommément.

### Variantes
- `count` (1 à 4) : variantes d'un même prompt, mêmes entrées, même affichage.
- `generate_video_batch` : requêtes indépendantes (plans différents).
- Ne pas multiplier les variantes sans raison : 2 variantes suffisent pour choisir un plan difficile.

### Médias
- Fichier local : `media_upload_widget` seul dans le tour. Ne jamais lire `/mnt/user-data/uploads` ni passer par le shell.
- URL web : `media_import_url`, puis utiliser le `media_id` retourné.
- Dans `medias[].value` : toujours un `media_id` ou un `job_id`, jamais une URL.
- Respecter les rôles déclarés par le modèle (ex. `start_image`, `end_image`, `image_references`, `video_references`, `audio_references`).

### Unlim
- Ne pas renseigner `use_unlim`. Si la réponse contient `unlim_choice`, poser la question à l'utilisateur, puis relancer avec le même paramètre et la réponse.
- Ne jamais utiliser `use_unlim: true` de sa propre initiative.

### Timeout
- Si l'appel expire sans réponse claire, l'issue de la soumission est inconnue. Ne pas resoumettre. Réutiliser les `job_id` déjà reçus, et ne relancer qu'après avoir connu l'issue.

### Attente et résultat
1. `jobs_wait` avec `timeout_seconds` ≤ 15, en répétant selon `poll_after_seconds` tant que `all_terminal` est faux. Repère mesuré : un clip de 5 s a pris environ 4 à 5 minutes (une dizaine d'appels `jobs_wait`). Prévenir l'utilisateur que l'attente est longue.
   Pendant l'attente, le type du job peut apparaître comme `image` : le type définitif est `video` une fois terminé. Ne pas en conclure une erreur.
2. Une fois tous les jobs terminés, un seul `show_generation_by_ids` pour l'affichage.
3. Un résultat n'est annoncé comme réussi que s'il a une URL ou un statut terminal réussi.

### Workflows
- Vidéo multi-plans, produit ou personnage à référencer : appeler `get_workflow_instructions` sans argument.
- Cas nommés (Ad Multiplier, Genjutsu, UGC, character sheet) : charger le workflow dédié avant la première génération.

## 5. Règles Marketing Studio

- `product_ids` (pluriel, tableau d'UUID). Ne pas utiliser `product_id`.
- `avatar_ids` : un seul avatar maximum.
- `mode` : choisir le format volontairement via les presets (`show_marketing_studio` action `presets`), ne pas laisser par défaut.
- `hook_id` et `setting_id` ne fonctionnent que sur les presets UGC, Tutorial, Unboxing, Product Review et UGC Virtual Try On.
- `ad_reference_id` est exclusif de `hook_id` et `setting_id`.
- Les avatars et produits liés à une référence ne sont pas appliqués automatiquement : les passer explicitement.
- Durée 12 à 15 s : prévoir le montage si la vidéo doit être plus courte.

## 6. Paramètres de format

- `aspect_ratio` : 9:16 pour TikTok, Reels, Shorts ; 16:9 pour le cinéma et le web.
- Certains modèles n'acceptent qu'une liste de ratios : vérifier avec `models_explore`.
- Ne pas combiner `width` / `height` et `aspect_ratio` sans vérifier.

## 7. Audio

- Certains modèles génèrent l'audio nativement (`generate_audio`, `sound`) : l'activer si le plan a une voix ou un bruitage utile, le couper sinon (coût réduit pour `kling3_0` avec `sound: off`).
- Lip-sync : générer la vidéo visuelle puis appliquer `sync_so` avec la vidéo et l'audio (voir `AUDIO_ENGINE.md`).

## 8. Erreurs de paramètres courantes

- Durée non supportée : Higgsfield ramène à la valeur autorisée la plus proche. Le signaler dans le plan et adapter le montage.
- Rôle de média inconnu : le serveur peut le corriger s'il est univoque, sinon l'erreur le signale. Relire `medias[].roles` via `models_explore`.
- Paramètre inexistant : ne pas le deviner, le retirer.
