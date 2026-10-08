# EXEMPLE : cinématique storytelling, émotion

Brief utilisateur : « Transforme cette idée en vidéo cinématique : un homme qui quitte la ville à l'aube, sa montre à son poignet comme seul souvenir de son père. »

## Tri du brief

- Critique : l'idée est assez précise pour produire. Personnage à créer (homme, carnation foncée, 50 ans, sobre).
- Assumé : 25 s, 16:9, palette chaude-froide, musique piano et nappe, un seul dialogue éventuel (aucun ici).

## PRODUCTION PLAN

```
Type            : cinématique, storytelling, émotion
Durée           : 25 s
Format          : 16:9
Style           : émotionnel, basse lumière, couleurs désaturées avec une teinte chaude sur la montre
Nombre de scènes: 5
Hypothèses      : personnage créé, sans dialogue, sans texte
```

## Intention

Un seul sentiment dominant : la nostalgie qui devient apaisement. La montre est le fil narratif : elle est vue au début, portée au milieu, et regardée à la fin.

## CHARACTER LOCK

```
PERSONNAGE   : homme, environ 50 ans, carnation foncée, cheveux courts légèrement grisonnants, barbe courte
Tenue        : veste en laine sombre, chemise claire
Accessoire   : montre à bracelet cuir brun sur le poignet droit
Expression   : sobre, légèrement pensive
```

## STORYBOARD

**SCÈNE 01 (0–5 s)** : Aube, rue vide, lumière bleutée.
- Action : l'homme avance seul, de dos.
- Caméra : wide shot, static, léger tracking lent.
- Lumière : aube froide, premier rayon chaud au loin.
- Audio : nappe piano.

**SCÈNE 02 (5–10 s)** : Gros plan de la montre sur le poignet.
- Action : il regarde la montre, sans mouvement brusque.
- Caméra : close-up, push-in très lent.
- Lumière : rayon chaud sur le bracelet.
- Audio : silence léger, nappe qui baisse.

**SCÈNE 03 (10–16 s)** : Il s'arrête devant un portail ouvert.
- Action : il pose la main sur la montre, avant d'avancer.
- Caméra : medium shot, static, reveal lent du portail.
- Lumière : contre-jour doux.
- Audio : bruitage de pas qui s'arrêtent.

**SCÈNE 04 (16–21 s)** : Plan en surplomb, il traverse un champ au lever du soleil.
- Action : il marche vers l'horizon.
- Caméra : wide shot, pull-back lent.
- Lumière : golden hour.
- Audio : nappe qui monte doucement.

**SCÈNE 05 (21–25 s)** : Gros plan final, montre au soleil, flou d'arrière-plan.
- Action : aucune, la montre brille légèrement.
- Caméra : macro, static.
- Audio : silence, dernière note de piano.

## Continuité

- Même veste et même montre dans toutes les scènes.
- Palette : bleu froid pour l'aube, chaud pour le rayon et la golden hour. Transition de température logique, pas de saut arbitraire.
- Visage : même traits, même barbe, plan de visage peu fréquent pour éviter la dérive.

## GENERATION PLAN

```
Modèle        : cinematic_studio_video_4_0 (cadrage, lumière, mouvements lents)
Alternative   : kling3_0 si on veut une seule génération multi-plans avec audio
Durée         : 5 s par plan
Variantes     : 2 pour la scène 02 (le gros plan montre est la clé émotionnelle)
Pré-étape     : image de référence personnage (generate_image) pour la scène 01 et 03
Coût          : get_cost avant lancement, puis confirmation
```

## Notes

- Aucun élément de dialogue : la musique et le silence portent la scène.
- La montre n'est pas un argument produit ici, c'est un objet narratif. Si l'utilisateur veut un produit mis en avant, passer au workflow `product-demo` ou `cinematic` avec PRODUCT LOCK.
