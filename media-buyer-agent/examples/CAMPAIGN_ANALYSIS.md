# Exemple : analyse de campagne (mode M4)

> Données **fictives**. Produit : « Cube compressible FICTIF ». Prix moyen de commande (AOV) 52 €. Marge de contribution par commande 27,5 €, donc **break-even CPA 27,5 €** et **break-even ROAS ≈ 1,9**. Période : 14 jours, pays fictif, aucun changement de budget ni de page pendant la période.

## Données (extrait)

| Créatif | Dépense | Impressions | Fréq. | CPM | Vues 3 s | Clics lien | CTR lien | LPV | ATC | IC | Achats | CPA | ROAS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A — Scène aéroport | 450 € | 38 000 | 1,5 | 11,8 € | 9 500 | 760 | 2,0 % | 600 | 90 | 40 | 9 | 50 € | 1,0 |
| B — Démo face caméra | 430 € | 31 000 | 1,3 | 13,9 € | 4 300 | 1 020 | 3,3 % | 540 | 60 | 12 | 2 | 215 € | 0,24 |
| C — Témoignage client réel | 380 € | 52 000 | 1,8 | 7,3 € | 15 600 | 620 | 1,2 % | 560 | 70 | 35 | 9 | 42 € | 1,2 |

Ratios dérivés (dénominateur indiqué) :

| Créatif | Hook rate (vues 3 s ÷ impressions) | Taux de chargement (LPV ÷ clics) | ATC ÷ LPV | IC ÷ ATC | Achats ÷ LPV |
|---|---|---|---|---|---|
| A | 25,0 % | 79 % | 15 % | 44 % | 1,5 % |
| B | 13,9 % | 53 % | 11 % | 20 % | 0,4 % |
| C | 30,0 % | 90 % | 12,5 % | 50 % | 1,6 % |

Note sur le créatif C : hold rate (ThruPlays ÷ vues 3 s) = 18,6 %, donnée disponible.

## Hygiène des données

- Source de vérité : les commandes réelles ne sont pas fournies. **Information manquante** : comparaison des 9 + 2 + 9 achats Meta aux commandes. Résultat partiel.
- Pas de changement détecté. Phase d'apprentissage : non renseignée. **Information manquante**.

## Verdict de suffisance

- Hook rate, CPM, CTR : sur 31 000 à 52 000 impressions et 620 à 1 020 clics par variante, **données suffisantes pour comparer l'attention et le clic**.
- CPA et ROAS : 2 à 9 achats par variante, **données insuffisantes pour conclure** sur la conversion. Ce sont des signaux précoces.

## Rapport (sections clés)

**1. Résumé** : aucune variante n'est rentable sur le CPA (break-even 27,5 €). Le créatif C a la meilleure attention et le meilleur CPA (42 €), avec le CTR le plus faible. Le créatif A a un CTR solide mais un CPA de 50 €. Le créatif B a un CTR élevé mais une conversion très faible. Données insuffisantes pour désigner un gagnant sur les achats.

**2. Performance** : CPM entre 7,3 € et 13,9 €, dépense répartie. Fréquence basse (1,3 à 1,8) : pas de saturation.

**3. Funnel** : le plus grand écart est sur **B entre LPV et clics** (53 %, contre 79 % et 90 % ailleurs) et sur **B entre ATC et LPV** (11 %). Hypothèse principale : clics accidentels ou trafic curieux, ou page lente sur mobile.

**4. Créatifs** :
- A : hook solide (25 %), hold non renseigné, CTR solide, conversion en cours d'évaluation.
- B : CTR élevé mais hook et conversion faibles. Le clic ne qualifie pas.
- C : attention la plus forte, CTR le plus faible. La pub retient mais ne pousse pas au clic. Hypothèse : CTA peu explicite ou fin qui conclut sans action.

**5. Qualité du trafic** : CTR élevé de B + conversion faible = trafic de mauvaise qualité possible. Non confirmé.

**6. Conversion** : achats trop peu nombreux pour un verdict. IC ÷ ATC élevé sur A et C, faible sur B.

**7. Économie** : aucune variante n'atteint le CPA de 27,5 €. Les ROAS de A (1,0) et C (1,2) sont sous le break-even (1,9). Aucune variante ne doit recevoir de budget supplémentaire sur ces données.

**8. Hypothèses** :

| # | Hypothèse | Données pour | Données contre | Confiance | Test |
|---|---|---|---|---|---|
| H1 | Le créatif B attire des clics non qualifiés | CTR le plus haut, LPV faible, ATC faible | 2 achats seulement | Moyen | Comparer le trafic B à une audience plus étroite |
| H2 | La page produit ou le chargement pénalise B sur mobile | LPV ÷ clics à 53 % | Pas de mesure de vitesse fournie | Faible | Mesurer la vitesse mobile, comparer LPV ÷ clics par placement |
| H3 | Le CTA de C est trop faible pour convertir le clic | Hold et hook élevés, CTR faible | Un seul créatif testé | Faible | Tester une fin avec action explicite |
| H4 | C est le plus proche d'un signal de rentabilité | CPA le plus bas (42 €), IC ÷ ATC le plus élevé (50 %), ROAS 1,2 | 9 achats seulement, CTR le plus faible | Faible | Prolonger le test sans changer les variables |
| H5 | Le suivi des achats est incomplet | Aucune comparaison aux commandes | Données cohérentes entre ATC, IC, achats | Moyen | Comparer aux commandes réelles |

**9. Erreurs à éviter** : couper B parce que « le CTR est bon » ; scaler C parce qu'il a le meilleur CPA sur 9 achats ; conclure que le produit ne marche pas.

**10. Décision** : maintenir les trois créatifs au budget actuel pendant 7 jours, sans nouvelle modification, pour atteindre le niveau « tendance » sur les achats. Vérifier le suivi et la page avant toute autre action. Ne pas augmenter le budget.

**11. Plan de test** :
- PRIORITAIRE : vérifier le suivi (H5), puis la vitesse et la page (H2). Aucun créatif ne se modifie avant.
- SECONDAIRE : tester la fin de C avec action explicite (H3). Une variable.

**12. Nouveaux créatifs** : garder la structure de A (situation reconnaissable) et la preuve de C (témoignage réel, si disponible), changer le CTA. Pas de nouveau concept avant la fin du test.

## Apprentissage

```
CE QUE LES DONNÉES DISENT : attention forte sur C, clic fort sur B, conversion trop faible pour trancher.
CE QUE NOUS PENSONS : H1 et H3 sont les hypothèses les plus probables, avec confiance moyenne et faible.
CE QUE NOUS NE SAVONS PAS : les achats réels, la vitesse de page, la phase d'apprentissage.
CE QUE NOUS DEVONS TESTER : suivi (H5), page mobile (H2), fin de C (H3).
CE QUE NOUS AVONS APPRIS : rien de définitif. Signal précoce sur l'attention.
CE QUE NOUS FERONS ENSUITE : revue dans 7 jours avec les commandes réelles.
```
