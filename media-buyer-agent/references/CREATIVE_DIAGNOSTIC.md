# Diagnostic créatif (Mode M3 et lecture des données créatives)

Charger pour : M3 (script ou idée fournie), M4 (lecture d'un créatif dans un rapport).

## 1. Arbre de décision : où le créatif perd-il le spectateur ?

Lire les métriques dans l'ordre. Le premier maillon faible désigne la zone à corriger. Les ratios sont définis dans `META_AD_ANALYTICS.md`.

```
Hook rate faible ?                → Problème de hook ou de première scène (HOOK_ENGINE.md)
Hook rate OK, hold rate faible ?  → Problème de corps : rythme, promesse, identification
Hold OK, CTR lien faible ?        → Problème de CTA, de promesse de clic ou d'offre lisible
CTR OK, taux de chargement faible → Problème de page ou de suivi (FUNNEL_DIAGNOSTIC.md)
Chargement OK, ATC faible         → Problème de promesse alignée, page produit, prix, confiance
ATC OK, IC ou achat faible        → Problème de checkout, paiement, livraison
Achats OK, ROAS faible            → Problème d'économie : AOV, marge, prix (BREAK_EVEN.md)
```

Ce diagnostic ne dit jamais « la pub est mauvaise ». Il dit **quelle étape** est en cause, et quelles hypothèses la expliquent.

## 2. Les dix points de direction créative

Pour un script ou une idée fournie, répondre à chaque point. Être concret : citer la réplique, la scène, le plan.

1. **Ce qui fonctionne** : éléments à conserver, avec la raison.
2. **Ce qui est faible** : la réplique, le plan ou le choix qui affaiblit.
3. **Ce qui manque** : identification, preuve, démonstration, objection traitée, CTA.
4. **Pourquoi le spectateur pourrait partir** : le moment précis (ex. : « 0 à 3 s : aucune situation reconnaissable »).
5. **Renforcer l'identification** : ajouter un détail concret de la vie du client.
6. **Réduire l'impression de publicité** : supprimer la voix corporate, les superlatifs, la liste de bénéfices, le logo trop tôt.
7. **Augmenter le désir** : montrer la transformation, pas seulement le produit.
8. **Renforcer la preuve** : démonstration visible, témoignage réel, chiffre fourni par l'utilisateur, source.
9. **Améliorer la fin** : une action claire, liée à la promesse, avec la prochaine étape.
10. **Version améliorée** : réécriture complète ou par scène, en marquant ce qui a changé.

## 3. Anti-patterns fréquents

- Ouverture sur le produit, son nom ou son logo.
- Liste de trois à cinq bénéfices sans scène qui les porte.
- « Découvrez », « révolutionnaire », « incroyable », « le meilleur » : mots vides qui signalent la publicité.
- Voix off qui récite un argumentaire.
- Musique forte qui couvre la parole, ou absence de sous-titres.
- CTA vague (« cliquez ici ») sans promesse associée.
- Preuve sans source : « des milliers de clients » sans chiffre fourni.
- Fin qui revient au produit au lieu de conclure la situation.
- Fausse urgence ou fausse rareté (voir `META_AD_POLICY.md`).

## 4. Gabarit de feedback

```
CE QUI FONCTIONNE : …
CE QUI EST FAIBLE : [moment] → [problème] → [effet probable sur le spectateur]
CE QUI MANQUE : …
POURQUOI LE SPECTATEUR PEUT PARTIR : …
IDENTIFICATION (à renforcer) : …
IMPRESSION DE PUB (à réduire) : …
DÉSIR (à augmenter) : …
PREUVE (à renforcer, avec source réelle) : …
FIN (à améliorer) : …
VERSION AMÉLIORÉE : (scène par scène, avec le changement signalé)
CONFORMITÉ : (risques identifiés et alternatives)
TEST RECOMMANDÉ : (variable isolée, métrique, seuil)
```

## 5. Lire un créatif dans un rapport

Pour chaque créatif, indiquer :
- le **niveau de suffisance** des données (`CREATIVE_TESTING.md`, section 4) ;
- la **première étape qui décroche** ;
- l'**hypothèse créative** la plus probable, avec confiance ;
- ce qu'il faut **garder** (la partie qui fonctionne) et **changer** (une seule variable).

Un créatif peut être excellent sur l'attention et mauvais sur la conversion : cela signifie que le hook marche, pas que la pub est bonne. Ne pas le déclarer gagnant ni perdant.
