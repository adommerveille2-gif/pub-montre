# Exemple : diagnostic « CTR élevé, peu de ventes » (scénario D, mode M4)

> Données **fictives**. Compte fictif, prix moyen de commande 52 €, break-even CPA 27,5 €.

## Demande

« Mon CTR est à 3,4 %, c'est le meilleur de mes campagnes, mais je n'ai presque rien vendu. Qu'est-ce qui se passe ? »

## Ce que la Skill fait d'abord (et ce qu'elle ne fait pas)

1. Elle **ne félicite pas** le CTR et ne conclut pas que la pub est bonne ou mauvaise.
2. Elle lit la chaîne complète : CTR → CPC → LPV → ATC → IC → achat.
3. Elle vérifie le suivi avant toute hypothèse marketing.

## Données fournies

| Métrique | Valeur | Ratio |
|---|---|---|
| Dépense | 300 € | |
| Impressions | 24 000 | CPM 12,5 € |
| Clics lien | 816 | CTR 3,4 %, CPC 0,37 € |
| LPV | 380 | Taux de chargement 47 % |
| ATC | 41 | ATC ÷ LPV 10,8 % |
| IC | 9 | IC ÷ ATC 22 % |
| Achats | 1 | Achats ÷ LPV 0,26 % |

Comparaison à l'historique du compte : CTR habituel 1,8 %, taux de chargement habituel 75 à 85 %.

## Diagnostic

**Étape décrochée** : entre clic et LPV (47 % contre 75–85 % habituellement). **Plus gros écart relatif de la chaîne**, avant même l'ATC.

Le CTR élevé combiné à un chargement faible suggère trois causes à vérifier, par ordre de coût de vérification :
1. **Clics accidentels ou redirections** : un clic qui ne charge pas la page n'est pas un intérêt.
2. **Page lente sur mobile** : la page n'a pas eu le temps de se charger avant que le visiteur parte.
3. **Suivi LPV incomplet** : une partie des pages chargées ne remonte pas l'événement.

Les étapes suivantes (ATC, IC, achat) sont **plus faibles, mais non décisives** : elles sont calculées sur un volume de 380 LPV, ce qui reste faible.

## Verdict de suffisance

- Clics (816) : **suffisants pour comparer le CTR**.
- Achats (1) : **données insuffisantes pour conclure** sur la conversion ou le CPA. Un achat ne mesure rien.

## Hypothèses

| # | Hypothèse | Pour | Contre | Confiance | Test |
|---|---|---|---|---|---|
| H1 | Problème de chargement ou de redirection | Taux de chargement 47 % contre 75–85 % habituel | Pas de mesure de vitesse fournie | Élevé | Mesurer le temps de chargement mobile ; tester le lien sur téléphone |
| H2 | Clics accidentels (placement ou format) | CTR élevé pour peu de LPV | Format et placement non détaillés | Moyen | Comparer le taux de chargement par placement |
| H3 | Trafic curieux attiré par la promesse du hook | CTR élevé, ATC faible | Ne peut pas être isolé tant que H1 n'est pas vérifiée | Moyen | Après correction de la page, comparer ATC ÷ LPV |
| H4 | Suivi LPV ou achat défaillant | Achats très faibles pour 380 LPV, à vérifier | Pas de comparaison aux commandes | Moyen | Comparer les LPV et achats Meta aux commandes et aux visites du site |
| H5 | Promesse de la pub mal alignée avec la page | ATC faible | Page non fournie | Faible | Relire la page avec la promesse de la vidéo |

## Décision

**DÉCISION** : ne pas modifier le créatif. Ne pas couper la campagne sur ces données.

**POURQUOI** : le CTR est au-dessus de l'historique, mais 53 % des clics ne deviennent pas une page vue. Le problème le plus probable est situé entre le clic et la page, pas dans la publicité. Un achat ne permet aucune conclusion.

**ACTION IMMÉDIATE** :
1. Vérifier la vitesse de la page sur mobile et le fonctionnement du lien.
2. Comparer les LPV Meta aux visites enregistrées par l'outil d'analyse du site.
3. Vérifier les événements d'achat contre les commandes réelles.

**TEST SUIVANT** : une fois la page corrigée, relancer la même pub sans modification pendant 7 jours. Variable unique : la page. Métrique principale : taux de chargement. Garde-fou : ATC ÷ LPV.

## Ce qui ne doit pas se produire

- Remplacer la pub alors qu'elle n'est peut-être pas en cause.
- Lancer deux nouveaux créatifs pour « corriger » le problème.
- Augmenter le budget « parce que le CTR est bon ».
- Déclarer la pub gagnante sur le CTR.
