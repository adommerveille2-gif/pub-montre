# Analyse produit (Mode M1)

Charger pour : toute nouvelle stratégie sur un produit, ou quand l'utilisateur ne fournit que le produit.

## 1. Entrées minimales

| Donnée | Pourquoi | Si absente |
|---|---|---|
| Nom, catégorie, description factuelle | Base de l'analyse | Bloquant |
| Prix de vente, promotions réelles | Économie, offre | Bloquant pour le break-even |
| Coût produit, livraison, paiement, retours | Break-even | Ne jamais inventer : marquer `Information manquante` |
| Pays et ville de vente | Marché, paiement, livraison | Bloquant pour la partie marché |
| Preuves existantes (avis, photos clients, démonstrations, résultats mesurés) | Crédibilité | Signaler : aucune preuve = aucune promesse forte |
| Concurrents connus, publicités concurrentes | Angles non exploités | Demander les liens Ad Library ou captures |
| Objectif (volume, rentabilité, lancement) | Priorité | Hypothèse : rentabilité |

## 2. Grille d'analyse

Pour chaque dimension, écrire la réponse et son statut : **FAIT**, **HYPOTHÈSE** ou **INCONNU**.

| Dimension | Question |
|---|---|
| Caractéristiques | Qu'est-ce que le produit possède (matière, forme, composants) ? |
| Fonctionnalités | Que permet-il de faire ? |
| Bénéfices fonctionnels | Quel problème concret résout-il, et pour qui ? |
| Bénéfices émotionnels | Comment la personne veut-elle se sentir en l'utilisant ? |
| Bénéfices sociaux | Comment influence-t-il la façon dont elle est perçue ? |
| Transformation | Qu'est-ce qui change concrètement dans sa vie ou sa routine ? |
| Désirs | Que veut-elle réellement obtenir ? |
| Peurs | Que veut-elle éviter ? |
| Frustrations | Qu'est-ce qui l'énerve ou la bloque aujourd'hui ? |
| Identité | Qui veut-elle devenir ? |
| Statut | Comment veut-elle être vue par les autres ? |
| Conséquences de l'inaction | Que se passe-t-il si elle ne résout pas le problème ? |

## 3. Chaîne de motivation (Pourquoi ×3)

1. Pourquoi quelqu'un achèterait-il réellement ce produit ?
2. Pourquoi cette raison est-elle assez forte pour dépenser de l'argent ?
3. Quelle motivation plus profonde se trouve derrière ?

Arrêter la chaîne quand la réponse s'exprime dans le langage d'un client (émotion, identité, situation vécue). Une motivation profonde reste une **hypothèse à tester**, jamais un fait.

## 4. Test de la promesse

Pour chaque promesse candidate :
- Est-elle **vraie** et vérifiable avec les données fournies ?
- Peut-elle être **démontrée à l'image** (oui / non / partiellement) ?
- Quelle **preuve** la soutient, et est-elle réelle ?
- Présente-t-elle un **risque de politique** Meta (voir `META_AD_POLICY.md`) ?
- La landing page la confirme-t-elle ?

Une promesse non démontrable reste une promesse faible, même si elle est forte émotionnellement.

## 5. Points de vigilance produit

- Marge : une marge trop faible rend toute campagne difficile à rentabiliser (voir `BREAK_EVEN.md`).
- Saisonnalité, concurrence, taille de marché potentielle.
- Délai de livraison, politique de retour, SAV : ils deviennent des objections dans les commentaires.
- Notes et avis existants : leur contenu révèle souvent les vrais mots du client.
- Complexité d'usage : un produit qui demande une explication longue exige une démonstration.

## 6. Étapes 1 à 14 (résumé opérationnel)

1. Analyse produit (section 2).
2. Analyse marché : taille, saisonnalité, concurrence, prix de référence, niveau de sophistication. Pays requis.
3. Clients potentiels : 2 à 3 avatars psychologiques (`CUSTOMER_PSYCHOLOGY.md`).
4. Motivations : chaîne Pourquoi ×3 pour chaque avatar.
5. Problèmes : ce qui arrive réellement, avec les mots du client.
6. Désirs : la transformation désirée, formulée côté client.
7. Objections : prix, confiance, livraison, efficacité, « j'ai déjà essayé ».
8. Transformations : avant / après réels, décrits en situations, pas en chiffres inventés.
9. Positionnements : 2 à 3 façons de se différencier, chacune testable.
10. Angles : au moins 12, issus d'au moins 6 familles différentes (`MARKETING_ANGLES.md`).
11. Scoring des angles (`MARKETING_ANGLES.md`, section 3).
12. Sélection : TOP ANGLES, ANGLES À TESTER, ANGLES DE RÉSERVE.
13. Formats créatifs pour les angles retenus (`CREATIVE_FORMATS.md`).
14. Plan de test (`CREATIVE_TESTING.md`) : matrice, métriques, seuils.

Ne pas écrire de publicité avant l'étape 12, sauf si l'utilisateur insiste. Dans ce cas, livrer le minimum et noter la limite.

## 7. Gabarit : PRODUCT BRIEF

```
PRODUCT BRIEF — [nom produit]
Marché : [pays, ville] | Prix : [valeur fournie] | Marge : [valeur fournie ou INCONNU]
Résumé : (3 lignes)
Clients prioritaires : Avatar A (…), Avatar B (…)
Problème central : (une phrase, langage client)
Désir central : (une phrase)
Promesse défendable : (ce qui est vrai et démontrable)
Objections principales : …
TOP ANGLES : 1) … 2) … 3) …
ANGLES À TESTER : …
ANGLES DE RÉSERVE : …
Formats recommandés : …
Information manquante bloquante : …
Plan de test : (renvoi vers la matrice)
```
