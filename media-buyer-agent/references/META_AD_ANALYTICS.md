# Media Buying Intelligence : métriques Meta

Charger pour : M4 (données), M9 (capture), M8 (décision rapide, si chiffres).

Les noms de colonnes varient selon la version d'Ads Manager, la langue et les paramètres de rapport. Toujours vérifier la correspondance avant de calculer.

## 1. Dictionnaire des métriques

| Métrique | Définition | Usage | Limite |
|---|---|---|---|
| Dépense (Amount spent) | Montant dépensé | Base de tous les coûts | Vérifier la devise et le fuseau |
| Impressions | Nombre d'affichages | Volume de diffusion, CPM | Un même utilisateur peut en voir plusieurs |
| Portée (Reach) | Personnes uniques atteintes | Fréquence | Dépend de la fenêtre de rapport |
| Fréquence | Impressions ÷ portée | Saturation | Seuil absolu trompeur (voir `CREATIVE_FATIGUE.md`) |
| CPM | Dépense ÷ impressions × 1 000 | Coût de diffusion, concurrence | Varie selon placement, saison, audience |
| Vues vidéo 3 secondes | Lectures ≥ 3 s | Capacité d'arrêt | Définition Meta, à ne pas confondre avec les lectures totales |
| ThruPlays | Lectures complètes ou ≥ 15 s | Attention soutenue | Dépend de la durée de la vidéo |
| Clics sur le lien | Clics vers le site | Trafic utile | Différent de « Clics (tous) » qui inclut likes, profil, etc. |
| CTR (lien) | Clics sur le lien ÷ impressions | Capacité à faire cliquer | Un CTR élevé peut venir de curiosité |
| CPC (lien) | Dépense ÷ clics sur le lien | Coût du trafic | Un CPC bas peut être du mauvais trafic |
| Vues de la page de destination (LPV) | Pages chargées | Qualité réelle du trafic | Dépend du suivi et de la vitesse de la page |
| Ajouts au panier (ATC) | Événement pixel / CAPI | Intention | Dépend de l'implémentation |
| Initiations au paiement (IC) | Événement pixel / CAPI | Intention forte | Idem |
| Achats | Événement pixel / CAPI | Conversion | Attribution (fenêtre et vues) |
| Valeur des achats | Revenu attribué | ROAS, AOV | Idem |
| CPA (coût par achat) | Dépense ÷ achats | Coût d'acquisition | Sensible au volume |
| ROAS | Valeur des achats ÷ dépense | Rentabilité brute | Ne tient pas compte de la marge |
| AOV | Valeur des achats ÷ achats | Panier moyen | Dépend des bundles |

## 2. Familles et ratios

**Delivery** : dépense, impressions, portée, fréquence, CPM.
**Attention** : vues 3 s, ThruPlays, hook rate, hold rate, taux de complétion, temps moyen de visionnage.
**Traffic** : clics lien, CTR lien, CPC lien, LPV, coût par LPV.
**Intention** : ATC, IC, coût par ATC, coût par IC.
**Conversion** : achats, taux de conversion, CPA, valeur, AOV, ROAS.
**Économie** (si fournie) : coût produit, livraison, frais de paiement, marge, marge par commande, break-even CPA et ROAS, profit.

Ratios à calculer (préciser le dénominateur dans le rapport) :

| Ratio | Formule | Ce qu'il indique |
|---|---|---|
| Hook rate | Vues 3 s ÷ impressions | Capacité à arrêter le défilement |
| Hold rate | ThruPlays ÷ vues 3 s | Capacité à retenir après l'arrêt |
| CTR lien | Clics lien ÷ impressions | Capacité à faire cliquer |
| Taux de chargement | LPV ÷ clics lien | Qualité du chargement et du clic |
| Taux d'ajout panier | ATC ÷ LPV | Intention sur la page |
| Taux d'initiation paiement | IC ÷ ATC | Friction avant le paiement |
| Taux de conversion page | Achats ÷ LPV | Efficacité de la page et du paiement |
| CPA | Dépense ÷ achats | Coût d'acquisition |
| ROAS | Valeur ÷ dépense | Retour brut |
| AOV | Valeur ÷ achats | Panier moyen |
| Fréquence | Impressions ÷ portée | Saturation |

## 3. Hygiène des données (avant toute conclusion)

Vérifier :
- **Source de vérité** : comparer les achats Meta aux commandes réelles (boutique, paiements, logistique). Un écart important invalide une partie de l'analyse.
- **Fenêtre d'attribution** et inclusion des vues (view-through) : elles gonflent les achats.
- **Doublons** : un même événement compté deux fois (pixel + API de conversions sans déduplication).
- **Devise, fuseau, période** identiques entre les exports.
- **Changements** de budget, ciblage, créatif, page ou prix pendant la période.
- **Phase d'apprentissage** : une adset qui vient d'être modifiée ou qui reçoit peu d'événements n'est pas stabilisée.
- **Placements** : Reels, Feed, Stories, Audience Network ont des profils différents.
- **Campagnes qui se chevauchent** : elles se concurrencent sur les mêmes personnes.

## 4. Anomalies typiques

- Dépense sans impressions : problème de diffusion, à vérifier avant tout.
- Achats supérieurs aux clics : attribution par vue ou double comptage.
- LPV très inférieurs aux clics : page lente, clics accidentels, suivi cassé.
- ROAS spectaculaire sur deux ou trois achats : bruit, pas un résultat.
- CPM qui change brutalement : changement d'enchères, de placement, de saison ou de concurrence.
- ATC élevés, achats quasi nuls : friction de paiement, prix total, ou suivi d'achat défaillant.

## 5. Pipeline Mode Données (14 étapes)

1. **Nettoyer** : supprimer les lignes sans dépense, harmoniser devises et périodes.
2. **Identifier les colonnes** et leur définition. Signaler les colonnes ambiguës.
3. **Repérer les données manquantes** : ce qui empêche de conclure.
4. **Calculer les ratios** (section 2) avec leur dénominateur.
5. **Classer les campagnes**.
6. **Classer les adsets**.
7. **Classer les créatifs** (par contribution au résultat, pas par une seule métrique).
8. **Identifier les anomalies** (section 4).
9. **Localiser les fuites du funnel** (`FUNNEL_DIAGNOSTIC.md`).
10. **Formuler des hypothèses** H1 à H5 avec confiance et test.
11. **Déterminer ce qui doit être maintenu.**
12. **Déterminer ce qui doit être arrêté** (critères fixés à l'avance, `POST_MORTEM.md`).
13. **Déterminer ce qui doit être testé** (`CREATIVE_TESTING.md`, catégories).
14. **Générer de nouveaux créatifs** directement inspirés des résultats (`HOOK_ENGINE.md`, `CREATIVE_FORMATS.md`).

## 6. Données à demander si elles manquent

Voir `templates/CAMPAIGN_INPUT.md`. Minimum pour une analyse économique : prix moyen de commande, marge de contribution par commande, mode de paiement, taux de livraison ou d'annulation si applicable.
