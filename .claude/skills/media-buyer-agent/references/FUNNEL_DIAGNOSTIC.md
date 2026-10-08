# Diagnostic du funnel

Charger pour : M4 (localisation des fuites), M5 (post-mortem), M8 (décision).

## 1. L'entonnoir

```
Impression → Vue 3 s → Attention (hold / ThruPlays) → Clic lien → LPV → ATC → Checkout (IC) → Achat
```

Chaque étape se compare à **l'historique du compte**, pas à une moyenne externe. Le plus grand écart relatif, sur une donnée suffisante, indique en général où chercher.

## 2. Procédure

1. Vérifier le **tracking** (section 4) avant toute hypothèse marketing.
2. Calculer chaque ratio de l'entonnoir sur la même période et le même périmètre.
3. Comparer à l'historique (même type de campagne, même audience, saison proche).
4. Identifier la **première étape qui décroche** de façon anormale.
5. Formuler les hypothèses, avec confiance et test. Ne pas conclure.

## 3. Table des symptômes

| Symptôme | Étape concernée | Hypothèses (non exclusives) | Vérifications | Test possible |
|---|---|---|---|---|
| CPM élevé | Diffusion | Concurrence sur l'enchère, audience étroite, placement coûteux, pertinence faible du créatif, saison | Historique CPM, répartition par placement, fréquence | Élargir l'audience, retirer un placement, tester un créatif plus pertinent |
| Hook rate faible | Attention initiale | Hook peu arrêtant, première scène lente, format mal adapté à l'audience froide | Hook rate par placement et par créatif | Tester 3 hooks sur le même corps |
| Hook rate correct, hold rate faible | Attention soutenue | Promesse non tenue, rythme lent, pas d'identification après le hook, fin floue | Courbe de rétention si disponible | Raccourcir, réordonner le corps |
| CTR lien faible, hold correct | Clic | CTA absent ou flou, promesse de clic peu claire, offre illisible, mauvaise audience | Position et formulation du CTA | Tester le CTA et la fin |
| CTR élevé, taux de chargement faible | Landing page | Page lente sur mobile, clics accidentels, suivi cassé, promesse différente de la page | Vitesse mobile, redirections, événements | Corriger la page avant de toucher la pub |
| CTR élevé, ATC faible | Intention | Trafic curieux (mauvaise qualité), promesse mal alignée, page produit peu convaincante, prix ou livraison inconnus | Comparer le trafic par créatif, contenu de la page | Aligner la promesse et la page |
| ATC élevé, IC faible | Checkout | Prix total ou frais de livraison surprenants, friction de formulaire | Parcours mobile, champs demandés | Afficher le prix total plus tôt |
| IC élevé, achat faible | Paiement | Moyens de paiement inadaptés, peur de l'arnaque, délai de livraison, bug, paiement à la livraison refusé | Taux d'échec paiement, refus à la livraison | Ajouter un moyen de paiement, rassurer sur la livraison |
| Achats corrects, ROAS faible | Économie | Panier moyen bas, marge faible, prix, absence de bundle | AOV, marge, break-even | Tester une offre de panier (voir `BREAK_EVEN.md`) |
| Tout correct en haut de funnel, achats quasi nuls | Suivi | Pixel ou API de conversions mal configuré, achats non remontés | Comparer aux commandes réelles | Corriger le suivi avant toute décision |

## 4. Tracking : vérifier en premier

Symptômes d'un suivi défaillant : achats nuls alors que les commandes existent, achats très supérieurs aux commandes, LPV ou ATC absents, événements dupliqués. Dans ces cas, **aucune décision créative n'est valable** tant que le suivi n'est pas corrigé.

## 5. Qualité du trafic

Un CTR élevé n'est pas un bon résultat en soi. Lire la chaîne :

**CTR → CPC → LPV → ATC → Checkout → Achat**

CTR élevé + conversion faible = trafic de mauvaise qualité **possible**. Hypothèses à tester : hook qui attire la curiosité sans lien avec le produit, promesse de clic ambiguë, clics accidentels sur mobile, audience trop large.

## 6. Ce qu'il ne faut pas faire

- Transformer une hypothèse en certitude sans données suffisantes.
- Changer le créatif avant d'avoir vérifié la page et le suivi.
- Corriger deux étapes en même temps : on ne sait plus laquelle a produit l'effet.
- Lire un ratio sans son dénominateur.
