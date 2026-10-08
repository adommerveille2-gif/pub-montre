# EXEMPLE : UGC 30 secondes, montre au poignet

Brief utilisateur : « Je veux une vidéo UGC de 30 secondes avec cette montre. Une personne qui découvre la montre et la trouve pratique au quotidien. »

Photo de la montre fournie : oui. Personnage : non fourni.

## Tri du brief

- Critique : photo produit fournie (OK).
- Assumé : personnage générique africain urbain, 25–35 ans, si le brief ne précise rien ; le signaler.
- Assumé : 9:16, voix française posée, pas de texte à l'écran, musique très discrète.

## PRODUCTION PLAN

```
Type            : UGC, découverte produit et usage quotidien
Durée           : 30 s
Format          : 9:16
Style           : natif, cadrage téléphone, lumière de fenêtre
Nombre de scènes: 6
Hypothèses      : personne générée, personnage à valider ; pas de texte à l'écran ; pas de claim chiffré
```

## CHARACTER LOCK (exemple)

```
PERSONNAGE   : femme, environ 28 ans, carnation foncée, visage ouvert, expression sincère
Coiffure     : tresses courtes attachées en arrière
Tenue        : chemise en lin beige, col ouvert, jean brut
Accessoires  : montre sur le poignet gauche (PRODUCT LOCK), petite boucle d'oreille
Voix         : chaleureuse, débit posé, français
Environnement: appartement moderne, fenêtre à gauche, plantes, lumière du matin
```

## PRODUCT LOCK (exemple)

```
PRODUIT         : montre à bracelet cuir brun
Cadran          : fond clair, index simples, aiguilles noires
Boîtier         : acier, rond, taille modeste au poignet
Bracelet        : cuir brun, boucle acier
Logo            : petit logo au centre du cadran, ne pas le modifier
À ne jamais modifier : couleur du cadran, couleur du bracelet, forme du boîtier, nombre d'index
```

## STORYBOARD

**SCÈNE 01 (0–4 s)**
- Visuel : la personne est assise près d'une fenêtre, regarde l'heure sur son téléphone, puis lève le poignet.
- Action : elle lève le poignet pour regarder la montre.
- Caméra : medium close-up, hauteur des yeux, légère tenue main.
- VO / dialogue : DIALOGUE « Je cherchais une montre qui ne fait pas trop habillée. »
- Audio : silence ambiant, léger bruit de rue.
- Continuité : ouverture, référence de tenue.

**SCÈNE 02 (4–8 s)**
- Visuel : gros plan du poignet, la montre est nette.
- Action : elle tourne légèrement le poignet vers la lumière.
- Caméra : close-up, static.
- VO : aucune.
- Audio : SFX léger frottement du bracelet.
- Continuité : même montre, même bracelet, même lumière de fenêtre.

**SCÈNE 03 (8–12 s)**
- Visuel : elle enfile une veste, la montre passe sous la manche.
- Action : elle glisse le bras dans la manche.
- Caméra : medium shot, static.
- VO : DIALOGUE « Celle-là je la mets tous les jours. »
- Audio : voix naturelle.
- Continuité : même tenue, même montre.

**SCÈNE 04 (12–17 s)**
- Visuel : elle marche dans la rue, la montre visible au poignet dans un geste naturel.
- Action : elle marche et consulte l'heure.
- Caméra : medium wide, handheld léger.
- VO : DIALOGUE « Le cuir se patine bien, et elle reste lisible. »
- Audio : bruit de rue discret.
- Continuité : même personne, même tenue.

**SCÈNE 05 (17–23 s)**
- Visuel : elle sourit à la caméra, la montre en bas du cadre.
- Action : elle parle, sourit brièvement.
- Caméra : medium close-up, static.
- VO : DIALOGUE « Franchement, je la recommande. »
- Audio : musique très discrète commence.
- Continuité : même décor, même lumière.

**SCÈNE 06 (23–30 s)**
- Visuel : plan final, la montre au poignet posé sur la table, lumière de fenêtre.
- Action : main pose la montre.
- Caméra : close-up, static.
- VO : aucune.
- Audio : musique discrète, silence final.
- Continuité : même montre.

## GENERATION PLAN

```
Plans           : 6
Modèle          : seedance_2_5 (références personnage et produit, audio natif)
Durée par plan  : 5 s, ajusté au besoin
Variantes       : 1 par plan, 2 pour la scène 01 (accroche)
Pré-étape       : image de référence personnage (generate_image) puis image de référence produit
Coût            : à estimer avec get_cost avant lancement, puis confirmation
```

## Notes

- La scène 05 contient une phrase de recommandation : elle a besoin d'un plan de visage avec bouche visible.
- Le texte « Franchement, je la recommande » est un témoignage. La personne est générée : le signaler à l'utilisateur (transparence).
