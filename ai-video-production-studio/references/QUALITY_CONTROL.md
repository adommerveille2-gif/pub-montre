# QUALITY CONTROL : contrôler avant de valider

## Quand contrôler

- après chaque génération terminée, plan par plan
- avant de livrer la version finale, en enchaînant les plans
- avant de relancer une génération, pour identifier la cause réelle

## Grille de contrôle

| Axe | Question | Signal d'alerte |
|---|---|---|
| PERSONNAGE | Même identité, même âge, même morphologie ? | Visage, coiffure, âge qui changent |
| VÊTEMENTS | Même tenue et accessoires ? | Couleur, coupe, accessoire qui disparaît |
| PRODUIT | Ressemble-t-il à la référence ? | Forme, couleur, logo, cadran, bracelet différents |
| ACTION | L'action demandée est-elle exécutée ? | Geste absent, geste partiel, action remplacée |
| PHYSIQUE | Les mouvements sont-ils réalistes ? | Mains déformées, objet flottant, traversée de matière |
| CAMÉRA | Le mouvement est-il correct ? | Mouvement absent, trop rapide, direction contraire |
| CONTINUITÉ | Le plan s'enchaîne-t-il avec les autres ? | Lumière, décor ou position qui sautent |
| SCRIPT | Le plan montre-t-il ce qui est dit ? | VO qui parle d'un bénéfice non visible |
| AUDIO | Le dialogue et le son correspondent-ils ? | Lip-sync décalé, bruitage absent ou hors action |
| FORMAT | Le cadrage et le ratio sont-ils corrects ? | Mauvais ratio, sujet coupé, produit hors cadre |

## Notation

Pour chaque plan : OK / À CORRIGER / À REFAIRE.

- **OK** : tous les axes passent.
- **À CORRIGER** : un axe mineur échoue (un détail, un léger décalage). Se corrige en montage ou par une variante.
- **À REFAIRE** : un axe majeur échoue (produit faux, personnage différent, action absente). Une correction de prompt et une nouvelle génération sont nécessaires.

## Cas à traiter comme majeurs

- Produit qui n'est pas celui de la référence
- Personnage qui n'est pas celui de la référence
- Action principale absente
- Mains ou visage manifestement déformés
- Texte illisible qui doit être lisible

## Contrôle de continuité en séquence

Regarder les plans dans l'ordre, deux à deux. Pour chaque paire, vérifier : même personnage, même tenue, même lumière, même décor, même produit. Une rupture sur une paire demande une correction du plan le plus récent.

## Rapport de contrôle (format court)

```
PLAN 02 : À CORRIGER
- Produit : OK
- Personnage : OK
- Continuité : bracelet plus clair que sur le plan 01
- Action : OK
Cause probable : bracelet non verrouillé dans le prompt
```

## Ce que le contrôle ne fait pas

- Il ne remplace pas la validation humaine finale.
- Il ne juge pas l'efficacité marketing (c'est un autre sujet).
- Il ne rend pas une vidéo conforme aux règles des plateformes : signaler les points de transparence (personnes générées présentées comme réelles, claims) séparément.
