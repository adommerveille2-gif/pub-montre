# Post-mortem de campagne (Mode M5)

Charger pour : toute campagne qui échoue, ou que l'utilisateur juge mauvaise.

## 1. Chaîne obligatoire

```
SYMPTÔME → HYPOTHÈSES → PREUVES → CAUSE PROBABLE → CAUSES ALTERNATIVES → TEST → NOUVELLE HYPOTHÈSE
```

Ne jamais sauter de SYMPTÔME à « refais une autre pub ». Chaque étape a une sortie écrite.

## 2. Gabarit

```
SYMPTÔME : (métrique, écart, période, comparaison avec l'historique)
HYPOTHÈSES : H1 … H5 (étape du funnel, confiance)
PREUVES : pour chaque hypothèse, les données qui la soutiennent et celles qui la contredisent
CAUSE PROBABLE : (une hypothèse, avec confiance et raison)
CAUSES ALTERNATIVES : (les autres, non exclues)
TEST : (variable isolée, métrique, seuil, durée)
NOUVELLE HYPOTHÈSE : (ce qu'on croit maintenant, et ce qu'on abandonne)
```

## 3. Questions d'enquête (dans l'ordre)

1. **Le suivi fonctionne-t-il ?** Achats, ATC et LPV correspondent-ils aux commandes réelles ? (`FUNNEL_DIAGNOSTIC.md`, section 4)
2. **La période est-elle comparable ?** Saison, jours fériés, promotion concurrente, rupture de stock, changement de prix.
3. **La campagne a-t-elle été modifiée ?** Budget, ciblage, créatif, placement, page, prix.
4. **Le volume est-il suffisant ?** (`CREATIVE_TESTING.md`, section 4)
5. **Le trafic est-il qualifié ?** CTR, LPV, ATC par créatif.
6. **Le créatif a-t-il usé ?** Fréquence, tendance du CTR et du hook rate (`CREATIVE_FATIGUE.md`).
7. **La page ou l'offre tient-elle la promesse ?** Chargement, prix total, livraison, preuve.
8. **L'économie tient-elle ?** Break-even (`BREAK_EVEN.md`).
9. **L'audience est-elle la bonne ?** Test de saturation ou de mauvaise cible.
10. **La concurrence a-t-elle changé ?** Enchères, offres concurrentes.

## 4. Interdits

- « Refais une autre pub. »
- « Le produit ne marche pas. » (sans avoir isolé l'étape)
- « Meta est cassé. » (sans preuve de suivi défaillant)
- « Il faut augmenter le budget pour sortir de la phase d'apprentissage. » (sans données qui le justifient)
- Conclure sur un seul créatif, une seule journée, ou quelques achats.

## 5. Règles d'arrêt

Une campagne ou un créatif s'arrête quand, **sur une donnée suffisante**, l'un de ces critères est atteint :
- le coût par achat dépasse le break-even pendant la durée convenue, sans cause corrigeable identifiée ;
- la dépense atteint le seuil défini avant lancement sans aucun signal sur l'étape visée ;
- la publicité viole une politique Meta ou une règle de l'utilisateur ;
- le produit, l'offre ou le stock ne peut plus être livré.

Si ces critères ne sont pas définis, les proposer à l'utilisateur, et ne pas arrêter sur une impression.

## 6. Sortie

Livrer le post-mortem en une page maximum : la chaîne complète, la cause la plus probable, le test à lancer, et ce qui est abandonné. Terminer par la mise à jour du journal (`templates/LEARNING_LOG.md`).
