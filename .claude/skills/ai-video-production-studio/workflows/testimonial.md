# WORKFLOW : témoignage

## Quand l'utiliser

Témoignage de client, avis d'expert, professionnel, influenceur, créateur UGC. Médecin uniquement lorsque pertinent et avec prudence (voir points de vigilance).

## Références à charger

- `references/UGC_ENGINE.md`, `references/CHARACTER_CONSISTENCY.md`
- `references/AUDIO_ENGINE.md` (lip-sync, voix)
- `references/PROMPT_ENGINE.md`, `references/MODEL_SELECTION.md`, `references/HIGGSFIELD_ENGINE.md`

## Étapes

1. **Tri du brief**. Critique : qui parle (type de personne), ce qu'il dit (script ou idée), et si la personne est générée ou réelle (un témoignage réel fourni par l'utilisateur change tout).
2. **Vérification d'honnêteté** avant de travailler le script :
   - Le témoignage décrit-il une expérience vraisemblable et vérifiable par le client ?
   - Aucun résultat chiffré ou promesse médicale n'est inventé.
   - Si la personne est générée : elle ne doit pas être présentée comme une vraie cliente ou experte sans que l'utilisateur ait la preuve et respecte les règles de transparence.
3. **Structure** : contexte de la personne, problème, découverte, ressenti, recommandation. Une idée par plan.
4. **Personnage** : CHARACTER LOCK. Pour un expert, tenue professionnelle et lieu de travail crédible, sans titre inventé.
5. **Plans** : medium close-up pour le témoignage, plan de produit en usage, retour au visage.
6. **Voix** : ton posé et sincère. Lip-sync si la personne parle à l'écran (`sync_so` après génération).
7. **Modèle** : `minimax_hailuo` pour l'émotion faciale, `seedance_2_5` pour la cohérence de référence, `kling3_0` pour un plan avec audio natif.
8. **Présenter**, confirmer, générer, contrôler (lèvres, expression, honnêteté du discours).

## Points de vigilance

- **Médical et santé** : pas de promesse de guérison, pas de dosage, pas de figure de médecin qui recommande un traitement sans encadrement. Si le secteur est sensible, le signaler à l'utilisateur et proposer une formulation neutre.
- **Faux avis** : refuser de produire un témoignage présenté comme réel et factuellement inventé.
- **Expression exagérée** : garder une expression sobre.

## Sortie attendue

PRODUCTION PLAN avec note d'honnêteté, STORYBOARD, GENERATION PLAN.
