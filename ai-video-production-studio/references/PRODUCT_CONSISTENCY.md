# PRODUCT CONSISTENCY : le produit ne change pas

## Principe

Le produit est le sujet le plus exposé aux erreurs : forme, couleur, logo, détails qui se dupliquent ou disparaissent. Sa fidélité dépend de trois choses : une image de référence réelle, une fiche produit verrouillée, et des plans adaptés à ce qui est visible.

## Image de référence produit

- Si l'utilisateur fournit une photo du produit, elle est la **référence visuelle principale**. Toute caractéristique du prompt doit être cohérente avec elle.
- Sans photo, la description doit être fournie par l'utilisateur. Ne pas inventer de détail visible (matière, gravure, couleur exacte) : le signaler et demander, ou proposer une version neutre et le dire.

## PRODUCT LOCK (fiche à remplir)

```
PRODUIT : [nom]
Catégorie : [montre, sac, cosmétique, vêtement, électronique, autre]
Forme générale :
Dimensions relatives (ce qui est petit, ce qui est grand) :
Couleurs exactes : [valeurs ou description validée]
Matériaux : [métal, cuir, plastique, verre, textile]
Logo / marque : [emplacement, forme, lisibilité]
Détails importants : [boutons, couronne, coutures, fermeture, texte gravé]
Accessoires inclus : [bracelet, boîte, housse]
Orientation et position habituelles :
Image de référence : [oui/non]
À ne jamais modifier : [liste]
```

## Produit par catégorie

**Montre** : cadran (couleur, index, aiguilles), boîtier (forme, taille relative), bracelet (matière, couleur, boucle), couronne, logo du cadran. Le bracelet et le cadran sont les deux points de dérive les plus fréquents : les verrouiller explicitement.

**Sac** : forme, couleur, matière, bretelle ou anse, fermeture, logo. Vérifier la taille par rapport à la main ou à l'épaule.

**Cosmétique** : forme du flacon, couleur du liquide, étiquette, bouchon. Le texte d'étiquette est souvent illisible : éviter les plans où il doit être lisible sans référence.

**Vêtement** : coupe, couleur, matière, coutures, détails. La matière se déforme facilement en mouvement.

**Électronique** : écran, boutons, ports, logo. Éviter d'afficher un écran avec un contenu précis sauf si fourni.

## Plans adaptés

- **Gros plan (macro)** : bon pour la matière et les détails, risque élevé de dérive sur les textes. Limiter à un détail par plan.
- **Produit en main** : vérifier la position, l'orientation et la taille relative.
- **Produit posé** : le plus stable. À privilégier pour les plans de référence.
- **Produit en mouvement** : risque élevé. Limiter le mouvement du produit lui-même, faire bouger la main ou la caméra.

## Contrôle produit

Avant de valider une scène, comparer avec la référence :
- forme et proportions
- couleurs (cadran, bracelet, matière)
- logo lisible et positionné correctement
- nombre de boutons et de détails
- absence de doublon ou d'objet flottant

## Règle de non-invention

Ne pas ajouter une caractéristique inexistante (gravure, pierre, marque) pour embellir. Un produit sans logo fourni reste sans logo.
