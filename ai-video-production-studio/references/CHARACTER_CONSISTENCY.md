# CHARACTER CONSISTENCY : une identité, toutes les scènes

## Principe

Un personnage est une référence visuelle, pas une description. Plus la description est longue, plus le modèle dérive. La méthode la plus fiable :

1. **Créer ou fixer une image de référence** du personnage (portrait, buste, plein pied selon les besoins).
2. **Générer les plans à partir de cette image** (image-to-video, références `start_image` ou `image_references`), pas uniquement à partir d'un texte.
3. **Répéter les éléments d'identité** dans chaque prompt, dans les mêmes termes.

Si l'utilisateur fournit une image de personnage, elle devient la référence prioritaire. Ne rien changer à son visage, sa morphologie, sa coiffure.

## CHARACTER LOCK (fiche à remplir pour chaque personnage)

```
PERSONNAGE : [nom interne, ex. "Femme 30 ans"]
Âge apparent :
Sexe :
Origine / carnation (si pertinent, décrite avec respect et précision) :
Morphologie :
Visage : [traits saillants, expression de base]
Coiffure : [longueur, texture, couleur, style]
Pilosité : [barbe, sourcils si pertinents]
Tenue principale : [pièces, couleurs, matières]
Accessoires : [montre, bijoux, lunettes, sac]
Mains : [détail visible : vernis, bague, bracelet]
Voix (si parle) : [ton, débit, langue, accent]
Image de référence : [oui/non, source]
```

Chaque fois que le personnage apparaît, copier les éléments de la fiche à l'identique.

## Personnages africains et noirs

Quand le brief demande un personnage africain ou noir, respecter précisément la demande. Éviter le générique occidental ou le stéréotype.

- **Préciser le contexte** : pays ou ville si le brief le permet, environnement cohérent (Dakar, Abidjan, Lagos, Nairobi, Kinshasa, Casablanca ou autre), vêtements et décor qui correspondent au quotidien réel de la cible.
- **Décrire la carnation avec précision et respect** : nuance de peau, pas de vocabulaire péjoratif ou exotisant. Éviter la surcaractérisation (sourire forcé, gestes folkloriques).
- **Coiffure** : décrire le style exact (tresses, locks, afro, coupe courte, tissage), car c'est un point de dérive fréquent. Une coiffure qui change d'un plan à l'autre est une erreur de continuité.
- **Lumière** : voir `LIGHTING.md`, section peaux foncées.
- **Modernité** : tenues, téléphones, espaces de travail et intérieurs contemporains, sans clichés de « village ».
- **Diversité réelle** : un personnage africain n'est pas un figurant interchangeable ; il a une expression, un rôle, une personnalité.

## Dérives fréquentes et corrections

| Dérive | Cause probable | Correction |
|---|---|---|
| Visage qui change | Référence absente ou trop faible | Ajouter l'image de référence en `start_image` |
| Tenue qui change | Tenue décrite à moitié | Verrouiller la tenue complète dans chaque prompt |
| Âge qui change | Expression ou éclairage | Fixer l'âge apparent et la morphologie |
| Coiffure qui change | Pas de description précise | Décrire longueur, texture, style |
| Mains qui se déforment | Plan trop serré sans référence | Plan moins serré, ou action simplifiée, ou main hors cadre |

## Règle de non-invention

Ne pas inventer de caractéristique qui n'est pas dans le brief (tatouage, cicatrice, handicap, marque d'origine). Si une caractéristique est nécessaire et absente, la déclarer comme hypothèse dans le plan de production.
