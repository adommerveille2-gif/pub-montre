# AUDIO ENGINE : voix, dialogue, bruitages, musique

## Séparer les couches

Chaque scène doit distinguer :
- **VISUEL** : ce qu'on voit
- **DIALOGUE** : ce que dit un personnage à l'écran
- **VOIX-OFF** : ce qu'on entend sans voir le locuteur
- **SFX** : bruitages liés à une action
- **MUSIQUE** : ambiance musicale
- **TEXTE À L'ÉCRAN** : seulement si demandé

Ne jamais mettre un texte à l'écran par défaut.

## Dialogue et lip-sync

- Le dialogue à l'écran demande un plan où la bouche est visible et lisible.
- Éviter le dialogue sur un plan de profil, de nuque ou en contre-jour.
- Pour un dialogue long, découper en plans courts : un plan par phrase ou par respiration.
- Pour synchroniser une voix sur une vidéo : générer la vidéo, préparer l'audio, puis utiliser `sync_so` (entrées : vidéo et audio). Choisir `sync_mode` selon la durée : `remap` ou `cut_off` pour aligner, `silence` pour compléter.

## Voix-off

- Une voix-off explique ce que l'image ne peut pas montrer : prix, bénéfice, contexte, émotion.
- Éviter une VO qui décrit exactement ce qui est vu.
- Si le plan est silencieux, laisser respirer ; pas besoin de VO sur chaque scène.
- Durée : 2,5 à 3 mots par seconde en débit posé, en français.

## Voix du personnage

Décrire la voix dans la fiche personnage : ton (chaleureux, posé, enjoué), débit, accent éventuel, âge perçu. Garder la même voix pour le même personnage d'une scène à l'autre.

## Bruitages (SFX)

- Un bruitage par action forte : ouverture, clic, pas, frottement, cliquetis de bracelet.
- Un bruitage doit correspondre à l'action visuelle, pas l'accompagner en décor.
- Dans les modèles qui génèrent l'audio nativement, décrire le bruitage dans le prompt : « léger bruit de fermeture de boîte ».

## Musique

- Discrète en UGC, présente en cinéma, rythmée en social.
- Ne pas couvrir la voix : une musique sous la voix doit être nettement plus basse.
- Décrire le style plutôt que citer un titre ou un artiste protégé : « piano doux, tempo lent, ambiance premium ».
- Silence stratégique : un silence avant un reveal ou une phrase clé renforce l'effet.

## Activer ou couper l'audio

- Activer si le plan a une voix, un bruitage utile ou une ambiance importante.
- Couper si le plan est silencieux, si la voix sera ajoutée en post-production, ou pour réduire le coût quand le modèle le permet (ex. `kling3_0` avec `sound: off`).

## Exemple de bloc audio

```
SFX      : léger bruit de couvercle qui se détache
MUSIQUE  : piano discret, très bas, entre en fin de plan
VOIX-OFF : « Je ne quitte plus ma montre. »
DIALOGUE : aucun
TEXTE    : aucun
```
