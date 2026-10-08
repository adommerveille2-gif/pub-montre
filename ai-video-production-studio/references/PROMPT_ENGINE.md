# PROMPT ENGINE : des prompts précis, courts et lisibles

## Principe

Un prompt traduit une fiche de scène. Il ne remplace pas la réflexion. Il est assez court pour que le moteur le suive, assez précis pour que le plan soit reconnaissable.

## Ordre recommandé

1. **Sujet** : qui ou quoi, avec les éléments de CHARACTER LOCK ou PRODUCT LOCK
2. **Action** : un seul verbe principal
3. **Environnement** : lieu, décor, heure
4. **Caméra et cadrage** : shot size, angle, mouvement
5. **Lumière** : source et qualité
6. **Matière et détail** : produit, tissu, peau
7. **Émotion et style** : une ou deux notions
8. **Continuité** : éléments à garder identiques

Longueur cible : 40 à 120 mots pour un plan. Au-delà, retirer les adjectifs superflus.

## Modèle de prompt

```
[Sujet avec identité verrouillée], [action unique], [lieu et heure],
[cadrage et mouvement de caméra], [source de lumière], [détail du produit],
[émotion], [style de rendu]. Continuité : [éléments identiques].
```

## Exemple

```
Femme d'environ 30 ans, carnation brune, cheveux tressés attachés, pull crème,
montre à bracelet cuir brun au poignet gauche, elle ouvre la boîte devant
une fenêtre en matinée. Medium close-up, caméra à hauteur des yeux, légère
tenue main. Lumière naturelle douce depuis la gauche. La montre reste
nette, cadran et bracelet identiques à la référence. Ton spontané, rendu
téléphone. Continuité : même pull, même tresses, même montre que la scène 01.
```

## Contraintes négatives

Les paramètres vus sur les modèles Higgsfield ne contiennent pas de champ de prompt négatif dédié. Donc :
- formuler les contraintes en positif (« cadran et bracelet identiques à la référence » plutôt que « pas de déformation »)
- renforcer la fidélité par les références image, pas uniquement par le texte
- lister les risques dans la fiche de scène (`À éviter`) pour la vérification, pas forcément dans le prompt

Risques à anticiper selon le plan : mains déformées, nombre de doigts, visage qui change, tenue qui change, produit dupliqué ou flottant, logo illisible, mouvement irréaliste, expression artificielle.

## Mots à éviter dans le prompt

- Termes sans effet concret : « magnifique », « incroyable », « ultra réaliste », « 8K » (sauf si le modèle le demande).
- Empilements : trois ou quatre adjectifs de lumière dans la même phrase.
- Actions multiples : « ouvre la boîte, sourit et pose la montre ».
- Texte à faire lire au modèle, sauf si voulu et testé.

## Prompt voix et dialogue

Séparer le visuel du dialogue. Le dialogue n'est pas écrit dans le prompt visuel sauf si le modèle le prend en charge ; dans ce cas, le mettre entre guillemets et indiquer la langue et le ton. Voir `AUDIO_ENGINE.md`.

## Prompt en français ou en anglais

Les moteurs répondent généralement mieux en anglais pour les termes de caméra et de lumière. Le script et le dialogue restent dans la langue voulue. Pour une pub destinée à un public francophone, garder le dialogue en français et écrire le reste du prompt en anglais est une bonne pratique.

## Vérification avant envoi

- Une seule action principale ?
- Le personnage et le produit sont-ils décrits à l'identique à chaque plan ?
- La caméra a-t-elle un seul mouvement ?
- Le prompt tient-il en 120 mots maximum ?
- Les éléments de continuité sont-ils présents ?
