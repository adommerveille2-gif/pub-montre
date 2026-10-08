# SCENE ENGINE : une scène, une action

## Règle absolue

**Une scène = une action visuelle principale.** Tout le reste (cadrage, lumière, décor) soutient cette action et ne la remplace pas.

Test : peut-on décrire la scène avec un seul verbe d'action ? « Il ouvre la boîte » est bon. « Il ouvre la boîte, sourit, pose la montre et regarde la caméra » ne l'est pas : quatre scènes.

## Fiche de scène (format interne)

```
SCÈNE 01
Durée        : 0–4 s (modèle : ...)
VO / dialogue: ...
Action       : [un verbe, un sujet, un objet]
Personnage   : [réf. CHARACTER LOCK]
Lieu         : [réf. environnement]
Produit      : [réf. PRODUCT LOCK, ce qui doit être visible]
Cadrage      : ...
Caméra       : ...
Lumière      : ...
Mouvement perso : ...
Expression   : ...
Émotion      : ...
Continuité   : [ce qui doit être identique à la scène précédente]
À éviter     : [erreurs probables, voir QUALITY_CONTROL.md]
Audio        : SFX / musique / silence
```

## Quand découper

- Deux actions dans la même phrase : deux scènes.
- Changement de lieu : nouvelle scène.
- Changement de cadrage qui change l'information (plan large qui révèle, puis gros plan qui détaille) : nouvelle scène.
- Action qui dépasse la durée du modèle : découper en deux plans avec une continuité de geste.

## Quand fusionner

- Deux plans qui décrivent le même mouvement continu, sans changement d'information : une seule scène plus longue si le modèle le permet.

## Prompt versus fiche

La fiche est le document de travail. Le prompt est une version compacte de la fiche, générée à partir d'elle (voir `PROMPT_ENGINE.md`). Ne jamais écrire un prompt sans fiche.

## Nombre de scènes

Repère : une scène toutes les 4 à 6 secondes pour l'UGC et les réseaux, toutes les 5 à 8 secondes pour le cinéma. Au-delà de 8 scènes pour 30 secondes, le risque d'incohérence augmente : vérifier la continuité plus souvent.
