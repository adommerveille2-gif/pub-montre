# EXEMPLE : correction d'une génération ratée (REWORK)

Contexte : une vidéo UGC de 4 plans a été générée. Le plan 02 est jugé à corriger par l'utilisateur, qui dit : « le bracelet de la montre change de couleur entre le plan 01 et le plan 02. »

## Étape 1 : identifier l'erreur

```
PLAN 02 : À REFAIRE
- Produit : ÉCHEC (bracelet plus clair que sur le plan 01 et que la photo de référence)
- Personnage : OK
- Action : OK
- Continuité : ÉCHEC sur le bracelet
- Camera : OK
```

## Étape 2 : diagnostic

```
ERREUR          : le bracelet passe du cuir brun foncé à un brun plus clair.
CAUSE PROBABLE  : la matière et la couleur du bracelet ne sont pas verrouillées
                  dans le prompt du plan 02 ; la référence produit n'est pas
                  utilisée sur ce plan.
```

## Étape 3 : correction

Correction du prompt :
- ajouter le bloc PRODUCT LOCK complet, avec la couleur exacte du bracelet et sa matière (cuir brun foncé, boucle acier)
- ajouter la photo produit comme référence (rôle image) sur ce plan
- retirer un adjectif de lumière qui pousse le modèle à éclaircir la scène

Ce qui n'est pas corrigé :
- le plan 01 est OK, ne pas le régénérer
- le plan 03 est OK, ne pas le régénérer

## Étape 4 : nouvelle génération

```
Plan           : 02 uniquement
Modèle         : seedance_2_5 (référence produit en image)
Variantes      : 2 (choisir la variante où le bracelet est identique à la référence)
Coût           : get_cost avant lancement, confirmation avant
```

Une fois la variante choisie, contrôler le plan 02 avec le plan 01 : même bracelet, même lumière, même décor.

## Ce qu'il ne faut pas faire

- Régénérer les 4 plans pour corriger un seul bracelet : coût inutile, nouvelles dérives possibles.
- Dire « le modèle a fait une erreur » sans identifier la cause : la correction serait aléatoire.
- Changer la couleur du bracelet dans la fiche pour s'adapter à la sortie : la référence reste la photo.
