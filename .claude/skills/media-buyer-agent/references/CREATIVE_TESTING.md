# Tests créatifs et boucle d'apprentissage

Charger pour : M1 (plan de test), M4 (verdict), M7 (tests), M6 (nouvelles idées à tester).

## 1. Principes

- **Une variable testée à la fois.** Angle, hook, format, persona, offre, message et preuve se testent séparément.
- **Une matrice, pas vingt vidéos au hasard.**
- **Seuils de décision fixés avant le lancement**, pas après avoir vu les chiffres.
- **Garde-fous** : une métrique principale et au moins une métrique de contrôle (par exemple, le hook rate ne doit pas servir seul de critère).

## 2. Matrice de test (exemple structurel)

```
ANGLE A (problème émotionnel)
  → Hook 1 (identification)   → Format UGC témoignage
  → Hook 2 (démonstration)    → Format démonstration
  → Hook 3 (curiosité)        → Format POV
FORMAT UGC
  → Persona 1 (même angle, même hook)
  → Persona 2 (même angle, même hook)
```

Lecture : chaque ligne isole une variable. Comparer les variantes qui ne diffèrent que par cette variable.

## 3. Structure de la campagne de test

- Les variantes d'un même test sont dans le **même ad set** ou dans des ad sets à audience comparable, avec budgets proches. Comparer des pubs servies à des audiences différentes ne prouve rien.
- Lancer les variantes **en même temps** pour éviter le biais de calendrier.
- Éviter les fonctionnalités d'automatisation créative qui modifient les pubs pendant le test, sauf si l'objectif est précisément de les évaluer.
- Durée : au moins 7 jours pour les conversions, pour couvrir un cycle hebdomadaire complet, sauf si le volume est déjà suffisant.
- Documenter : hypothèse, variable, variantes, métrique principale, garde-fous, seuil, date de revue.

## 4. Règles de suffisance (heuristiques de travail)

Ces seuils ne sont pas des vérités statistiques. Ils évitent les conclusions précoces. Les ajuster à l'historique du compte si nécessaire.

| Niveau | Hook rate et attention | Clic (CTR) | Achats (conversion, CPA, ROAS) |
|---|---|---|---|
| Signal faible | < 3 000 impressions par variante | < 100 clics lien | < 30 achats |
| Tendance | 3 000 à 10 000 impressions | 100 à 300 clics | 30 à 100 achats |
| Conclusion probable | > 10 000 impressions, effet stable sur 3 jours ou plus | > 300 clics, effet stable | > 100 achats, ou écart net stable sur 7 jours et dépense ≥ 3 × CPA cible par variante |

Verdict à écrire explicitement :
- **« Données suffisantes pour conclure »** : niveau « conclusion probable » atteint sur la métrique décisive.
- **« Données insuffisantes pour conclure »** : niveau « signal faible » ou « tendance ». Dans ce cas, le résultat s'appelle un **signal précoce**, et la décision reste « observer ».

Une métrique peut être suffisante et une autre non. Ex. : 40 000 impressions suffisent à comparer des hook rates, mais 9 achats ne suffisent pas à comparer des CPA. Le dire.

## 5. Priorisation des tests

Score = Impact × Probabilité × Facilité de test, chacun noté de 1 à 5 (maximum 125).

| Catégorie | Critère indicatif | Action |
|---|---|---|
| PRIORITAIRE | Impact élevé, hypothèse forte, test facile (score ≥ 60) | À lancer en premier |
| SECONDAIRE | Potentiel élevé mais incertitude supérieure (score 30 à 59) | Après les prioritaires |
| EXPLORATOIRE | Idée intéressante mais moins urgente (score < 30) | Réserve, à revoir si les données changent |

## 6. Plan de test (gabarit)

```
TEST : [nom]
Hypothèse : (une phrase, testable, avec confiance)
Variable testée : (une seule)
Variantes : A (contrôle) / B / C
Constant : angle, audience, budget, page, offre
Métrique principale : (ex. hook rate, CTR lien, CPA)
Garde-fous : (ex. CPA, ROAS, taux de chargement)
Seuil de décision : (ex. variante B retenue si CPA ≤ X sur ≥ 100 achats)
Durée et volume minimum : …
Date de revue : …
Que fait-on si le résultat est nul ? : (abandonner ou changer une autre variable)
```

## 7. Interprétation et attribution

Ne jamais attribuer une performance à une seule variable sans preuve suffisante. Lister les variables qui ont changé en même temps (créatif, moment, audience, placement, prix). Une amélioration qui coïncide avec une baisse de prix ou une fête saisonnière n'est pas une preuve du hook.

## 8. Boucle d'apprentissage

```
CRÉATIF → DONNÉES → OBSERVATION → HYPOTHÈSES → TEST → APPRENTISSAGE → NOUVEAU CRÉATIF
```

À la fin de chaque analyse, produire la structure suivante :

```
CE QUE LES DONNÉES DISENT      Faits, chiffres, périodes, niveau de suffisance.
CE QUE NOUS PENSONS            Hypothèses, avec confiance.
CE QUE NOUS NE SAVONS PAS      Incertitudes, données manquantes.
CE QUE NOUS DEVONS TESTER      Tests classés PRIORITAIRE / SECONDAIRE / EXPLORATOIRE.
CE QUE NOUS AVONS APPRIS       Résultats confirmés, hypothèses abandonnées.
CE QUE NOUS FERONS ENSUITE     Décision et prochaine action.
```

Règles d'apprentissage :
- **Hypothèse contredite** : l'abandonner, et le noter dans le journal (`templates/LEARNING_LOG.md`).
- **Idée qui fonctionne** : comprendre le mécanisme avant de la répliquer. Quelle émotion, quelle situation, quelle promesse, quelle preuve ? Ce qui se transfère à un autre angle est l'apprentissage ; ce qui tient à la scène précise ne l'est pas.
- **Ne jamais répliquer une idée gagnante en la reformulant** : changer au moins deux variables pour obtenir une nouvelle hypothèse.

## 9. Journal d'apprentissage

Mettre à jour `templates/LEARNING_LOG.md` à chaque cycle, si l'utilisateur le partage. Sans journal partagé, reprendre les conclusions précédentes que l'utilisateur fournit en début de session.
