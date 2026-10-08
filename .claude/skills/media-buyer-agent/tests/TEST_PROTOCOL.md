# Protocole de test et auto-évaluation

Ce document définit comment vérifier la Skill et consigne l'auto-évaluation. Il ne fait pas partie du chargement normal : il ne doit pas être lu pendant une tâche réelle.

## 1. Nature de la vérification

Les tests ci-dessous sont des **revues de conception sur cas fictifs** (« tests mentaux ») : pour chaque scénario, on vérifie que les fichiers et les règles de `SKILL.md` produisent la réponse attendue. Aucune exécution réelle du modèle n'a été lancée pendant la construction. Pour une validation réelle, rejouer les scénarios de la section 3 dans une conversation neuve, en chargeant la Skill, puis cocher les critères de la section 4.

## 2. Matrice produits × scénarios

Chaque produit reçoit au moins deux scénarios. Chaque scénario est couvert au moins une fois.

| Produit (fictif) | Catégorie | Scénarios assignés |
|---|---|---|
| Cube compressible | Accessoire voyage | B, I |
| Sérum hydratant | Beauté | A, D |
| Sneakers basiques | Mode homme | C, H |
| Robe fluide | Mode femme | J, E |
| Écouteurs sans fil | Électronique | F, G |
| Lampe de bureau à réglage | Maison | K, B |
| Ceinture de maintien lombaire | Santé / bien-être | J, C (conformité renforcée) |
| Organisateur de sac à main | Accessoire | I, E |
| Pack de condiments (marché africain, pays fictif) | Alimentation | L, F |

## 3. Scénarios

| Code | Scénario | Ce qu'on attend de la Skill |
|---|---|---|
| A | Peu d'informations (« mon produit est un sérum ») | Mode PRODUIT, liste des manquants bloquants, pas de publicité écrite avant l'étape 12 |
| B | Beaucoup d'informations (export, prix, marge, historique) | Analyse complète, MEDIA BUYER DIAGNOSTIC 12 sections, hypothèses H1–H5 |
| C | Publicité qui échoue (CTR et ROAS faibles) | Localisation de l'étape, pas de « change la pub », suivi vérifié |
| D | CTR élevé mais peu de ventes | Chaîne complète, taux de chargement, suivi, pas de conclusion sur le CTR |
| E | Beaucoup d'ATC mais peu d'achats | Analyse IC ÷ ATC, paiement, livraison, prix total |
| F | CPA élevé | Comparaison au break-even, demande de marge si absente |
| G | ROAS faible | AOV, marge, offre, pas seulement le créatif |
| H | Pub gagnante qui commence à fatiguer | Lecture temporelle, fatigue créatif ou audience, renouvellement en 2 variables |
| I | Demande de nouvelles idées | Distance par rapport aux concepts existants, pas de reformulation |
| J | Mauvaise idée proposée par l'utilisateur | Challenge explicite, raison, meilleure stratégie, pas d'approbation automatique |
| K | Produit difficile à vendre (faible marge, concurrence forte, usage complexe) | Angles de réserve, démonstration, test de prix ou d'offre, honnêteté sur les limites |
| L | Marché africain | Demande du pays, COD, confiance, pas de stéréotype, pas de chiffres inventés |

## 4. Critères de vérification

Pour chaque scénario, cocher :

- [ ] Compréhension du produit
- [ ] Compréhension du client (psychologie, pas démographie)
- [ ] Qualité des angles (familles variées, scoring)
- [ ] Originalité (pas de reformulation)
- [ ] Analyse des données (ratios avec dénominateur, suffisance)
- [ ] Diagnostic du funnel (étape localisée)
- [ ] Capacité à challenger
- [ ] Absence d'invention (chiffres, offres, témoignages)
- [ ] Conformité (politiques Meta)
- [ ] Qualité des recommandations (actions, tests, seuils)

## 5. Mesures de robustesse (vérifiées en revue de conception)

| Risque identifié | Fichier qui le traite | Vérification |
|---|---|---|
| Invention d'un benchmark ou d'une moyenne | SKILL.md règle 7 ; META_AD_ANALYTICS.md ; BREAK_EVEN.md | Présent |
| Invention d'une marge ou d'un coût | SKILL.md règle 3 ; BREAK_EVEN.md §1 | Présent |
| Conclusion sur quelques achats | SKILL.md règle 4 ; CREATIVE_TESTING.md §4 | Présent, seuils chiffrés |
| Reformulation d'anciennes idées | MARKETING_ANGLES.md ; SKILL.md M6 | Distance à 3 niveaux |
| Stéréotypes sur l'Afrique | AFRICAN_MARKETS.md §1 et §6 | Présent |
| Formulation à risque (attribut personnel, santé, fausse urgence) | META_AD_POLICY.md ; contrôle qualité SKILL.md §7 | Présent |
| Dérive vers un message « pub classique » | HOOK_ENGINE.md §3 ; CREATIVE_DIAGNOSTIC.md §3 | Présent |
| Analyse trop longue pour une question simple | SKILL.md M8 (format strict) | Présent |
| Mode ambigu (données + création) | SKILL.md §4 (ordre données → diagnostic → créatif) | Présent |
| Verdict sans trace de suffisance | SKILL.md règle 4 ; CREATIVE_TESTING.md §5 | Présent |

## 6. Auto-évaluation (revue de conception)

Notes sur 5. Ces notes sont des **estimations de conception**, pas des mesures de performance. Les faiblesses trouvées pendant la construction sont corrigées dans les fichiers ; la colonne « Après correction » reflète l'état livré.

| Dimension | Avant correction | Faiblesse trouvée | Correction apportée | Après correction |
|---|---|---|---|---|
| Stratégie | 4 | Le workflow ne disait pas quand arrêter de poser des questions | Limite de cinq questions bloquantes, hypothèses étiquetées (SKILL.md §5) | 4,5 |
| Créativité | 4 | Risque de concepts génériques sans distance | Distance à trois niveaux (SKILL.md M6, MARKETING_ANGLES.md) | 4,5 |
| Psychologie | 4 | Avatars trop proches d'une fiche démographique | Fiche psychologique et phrases réelles (CUSTOMER_PSYCHOLOGY.md) | 4,5 |
| Media buying | 4 | Pas de hiérarchie de vérification du tracking | Tracking avant hypothèses (FUNNEL_DIAGNOSTIC.md §4) | 4,5 |
| Analyse de données | 3 | Seuils de suffisance absents | Table de suffisance par type de métrique (CREATIVE_TESTING.md §4) | 4 |
| Diagnostic | 4 | Pas de distinction créatif / audience | Test de saturation (CREATIVE_FATIGUE.md §4) | 4,5 |
| Conversion | 4 | Break-even ignorant le paiement à la livraison | Ajustement COD (BREAK_EVEN.md §6) | 4,5 |
| Originalité | 4 | Exemples possiblement « passe-partout » | Exemples fictifs, angles hors évidence (examples/) | 4 |
| Capacité d'apprentissage | 3 | Pas de mémoire entre sessions | Journal d'apprentissage à recoller (templates/LEARNING_LOG.md) | 4 |
| Challenge de l'utilisateur | 4 | Risque d'approbation par politesse | Règle 9 et scénario J | 4,5 |
| Marchés africains | 3 | « Afrique » traitée comme un bloc, risque de stéréotype | Demande de pays, règles sans caricature (AFRICAN_MARKETS.md §1) | 4,5 |
| Sécurité / conformité | 3 | Filtre de conformité absent du workflow | Filtre en 5 étapes (META_AD_POLICY.md §3), contrôle §7 | 4,5 |
| Maintenabilité | 4 | Chiffres d'exemple incohérents (ROAS, marge) | Corrigés et recalculés (CAMPAIGN_ANALYSIS.md, BREAK_EVEN.md §8) | 4,5 |

## 7. Limites connues (non corrigées)

- Les seuils de suffisance, de scoring et de fatigue sont des **règles de travail**, pas des vérités statistiques. Ils doivent être recalibrés sur l'historique réel du compte de l'utilisateur.
- Le résumé des politiques Meta peut devenir obsolète. Le document le signale ; il doit être relu régulièrement.
- Les exemples sont fictifs. Ils montrent un niveau de détail, pas des résultats attendus.
- Pas de test sur de vraies données ni sur des exports réels : les formats de colonnes Ads Manager varient selon les langues et les versions.

## 8. Procédure de validation réelle

1. Charger la Skill dans une conversation neuve.
2. Rejouer chaque scénario de la matrice avec le produit fictif assigné.
3. Vérifier les critères de la section 4 et noter les écarts.
4. Pour chaque écart, identifier le fichier responsable, le corriger, puis rejouer le scénario concerné.
5. Consigner les résultats dans ce fichier, avec la date et la version de la Skill.
