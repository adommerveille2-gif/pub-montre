# Break-even engine

Charger pour : M4 (économie), M5 (post-mortem), M1 (fixer une cible CPA), M8 (décision).

## 1. Données nécessaires (ne jamais inventer)

| Donnée | Obligatoire | Si absente |
|---|---|---|
| Prix de vente encaissé (hors TVA si applicable) | Oui | Demander |
| Coût produit (achat ou fabrication) | Oui | Demander |
| Coût d'emballage et de livraison | Oui | Demander |
| Frais de paiement (passerelle, mobile money, commission) | Oui | Demander |
| Coût des retours, annulations, livraisons échouées | Si applicable | Marquer `Information manquante` |
| Autres coûts variables (commission plateforme, SAV) | Si applicable | Marquer `Information manquante` |
| Panier moyen (AOV) observé | Pour le ROAS | Utiliser les commandes réelles |

Si une donnée manque, calculer ce qui est possible, présenter le résultat comme **partiel**, et demander la donnée manquante. Ne jamais estimer une marge à la place de l'utilisateur.

## 2. Marge de contribution par commande

```
Marge de contribution = Prix encaissé HT
                       − coût produit
                       − emballage et livraison
                       − frais de paiement
                       − coûts de retour, annulation, livraison échouée
                       − autres coûts variables
```

C'est la marge **avant publicité**. Elle doit être calculée sur une commande **livrée et conservée**.

## 3. Break-even CPA

```
Break-even CPA = Marge de contribution par commande livrée
```

C'est le coût maximal d'acquisition au-delà duquel chaque achat publicitaire détruit de la marge (sans prendre en compte la valeur de réachat).

## 4. Break-even ROAS

```
Break-even ROAS = Panier moyen (AOV) ÷ Marge de contribution par commande
                = 1 ÷ taux de marge de contribution
```

Le ROAS nécessaire pour couvrir les coûts. Un ROAS inférieur au break-even signale une perte sur la commande, avant prise en compte d'autres effets.

## 5. Cible CPA

Le break-even est un plafond, pas une cible. Fixer la cible selon l'objectif :

```
CPA cible = Break-even CPA × (1 − marge de sécurité)
```

La marge de sécurité dépend de l'objectif (rentabilité immédiate, volume, lancement) et de la confiance dans les données. Le préciser à l'utilisateur ; ne pas la fixer arbitrairement sans le dire.

## 6. Paiement à la livraison (COD)

Dans un paiement à la livraison, une commande confirmée n'est pas une commande livrée. Ajuster :

```
Coût par commande livrée = Coût par commande confirmée ÷ taux de livraison effective
```

Ajouter le coût des livraisons échouées (aller-retour, frais de relance, stock immobilisé) dans la marge de contribution.

**Exemple fictif** : coût par commande confirmée 12 €, taux de livraison 60 %, coût d'une livraison échouée 4 €, 40 % d'échecs.
- Coût par commande livrée = 12 ÷ 0,60 = 20 €.
- Le break-even CPA doit être recalculé sur la marge après coûts d'échec, et comparé à 20 €, pas à 12 €.

Mesurer séparément : taux de confirmation, taux de livraison, taux de refus, délai, coût par commande livrée.

## 7. Bundles et mix produit

Si plusieurs produits ou bundles sont vendus, calculer une marge pondérée par le mix réel des commandes, pas par le produit le plus vendu ou le plus rentable.

## 8. Exemple chiffré (fictif)

Panier moyen (AOV) de 52 € (fictif, deux produits), coût produit 16 €, livraison et emballage 7 €, frais de paiement 1,5 €, pas de retour significatif.
- Marge de contribution par commande = 52 − 16 − 7 − 1,5 = 27,5 €.
- Break-even CPA = 27,5 €.
- Break-even ROAS = 52 ÷ 27,5 ≈ 1,9.

Sur ce compte, un CPA de 35 € (ROAS ≈ 1,5) est déficitaire sur la commande : même un ROAS qui paraît « acceptable » peut être sous le break-even. Toujours lire les deux ensemble.

## 9. Lecture et limites

- Un CPA au-dessus du break-even n'impose pas l'arrêt immédiat si l'utilisateur **documente** un réachat ou une valeur vie client mesurée. Sinon, la décision se base sur la rentabilité de la commande.
- Un ROAS élevé sur un petit volume n'est pas une preuve de rentabilité (voir `CREATIVE_TESTING.md`).
- Le break-even varie avec le prix, la promotion, les frais de livraison et le mode de paiement : le recalculer à chaque changement.
