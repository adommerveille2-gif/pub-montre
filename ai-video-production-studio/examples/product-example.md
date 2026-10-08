# EXEMPLE : publicité produit premium, montre

Brief utilisateur : « Pub premium pour une montre, 20 secondes, très sobre, avec la montre qui doit être parfaitement fidèle. »

Photo de la montre fournie : oui.

## Tri du brief

- Critique : photo produit (OK).
- Assumé : 16:9 pour le web, sinon 9:16 en variante ; style premium sobre ; pas de personnage, ou un plan mains uniquement.
- Assumé : musique piano discrète, aucun texte à l'écran.

## PRODUCTION PLAN

```
Type            : produit premium, sobre
Durée           : 20 s
Format          : 16:9 (version 9:16 à produire ensuite)
Style           : premium sobre, lumière dramatique latérale
Nombre de scènes: 4
Hypothèses      : pas de personnage ; mains uniquement sur un plan ; pas de texte
```

## PRODUCT LOCK

```
PRODUIT         : montre, cadran clair, boîtier acier, bracelet cuir brun
À ne jamais modifier : forme du boîtier, cadran, index, couleur du bracelet, logo
Référence       : photo fournie
```

## STORYBOARD

**SCÈNE 01 (0–4 s)** : Fond noir, une source de lumière latérale découvre le boîtier.
- Action : la lumière glisse sur le boîtier.
- Caméra : close-up, static, léger push-in lent.
- Audio : nappe discrète.

**SCÈNE 02 (4–9 s)** : Gros plan sur le cadran.
- Action : aucune, le cadran est net.
- Caméra : extreme close-up, static.
- Audio : bruitage très léger de mécanisme.

**SCÈNE 03 (9–15 s)** : La montre posée sur une surface sombre, mains qui la prennent.
- Action : une main ferme la montre au poignet.
- Caméra : medium close-up, static.
- Audio : silence, puis musique.

**SCÈNE 04 (15–20 s)** : Plan final, la montre seule dans le cadre, reflet doux.
- Action : aucune.
- Caméra : medium, static, sortie lente.
- Audio : musique qui se termine.

## Lumière

- Source latérale unique, ombre marquée, reflet contrôlé sur le verre et le métal.
- Palette : noir, gris chaud, reflet clair.

## GENERATION PLAN

```
Modèle          : cinematic_studio_video_4_0 (contrôle lumière et caméra, 4 à 30 s)
Référence       : image produit (si le modèle la prend en entrée via medias, rôle image)
Durée           : 5 s par plan
Variantes       : 2 pour la scène 02 (détail cadran, fidélité critique)
Coût            : get_cost avant lancement, puis confirmation
```

## Contrôle produit (critique)

Comparer chaque plan avec la photo : cadran, index, bracelet, logo. Une seule différence = À REFAIRE.
