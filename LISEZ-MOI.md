# Widget agenda — projet complet

Conforme aux 11 décisions de ta spécification du 17 septembre 2026.

---

## 1. Installation (2 minutes)

Décompresse l'archive et place tous les fichiers dans
`C:\Users\mkoua\widget-agenda\`. Tu dois obtenir ceci :

```
widget-agenda/
├── index.html          la structure de la page
├── style.css           l'apparence, et les tokens de couleur
├── app.js              la logique
├── programme.json      TON ÉVÉNEMENT — le seul fichier à changer
├── annonce.json        le bandeau d'annonce
├── manifest.json       ce qui rend la page installable
├── sw.js               le hors-connexion
└── icones/
    ├── icone-192.png
    ├── icone-512.png
    └── icone-512-masque.png
```

Remplace ton `index.html` de l'étape 1 par celui-ci.

## 2. Lancer (obligatoire)

**Ne double-clique pas sur `index.html`.** Le chargement de
`programme.json` échouerait — c'est le piège n°1 de ta spec.

Dans VS Code : clic droit sur `index.html` → **Open with Live Server**.

## 3. Tester les moments de l'événement

Ajoute `?t=` suivi d'une date-heure à la fin de l'adresse :

| Adresse | Ce que tu vérifies |
|---|---|
| `?t=2026-09-21T10:50` | Une session en cours, avec sa barre de progression |
| `?t=2026-09-21T12:20` | Le creux de midi : la prochaine session annoncée |
| `?t=2026-09-21T14:50` | Trois sessions simultanées, priorité au panel IFC |
| `?t=2026-09-22T17:45` | L'événement terminé |

Sans paramètre, tu vois le compte à rebours jusqu'à lundi 09h30.

## 4. Publier une annonce pendant l'événement

Ouvre `annonce.json`, et modifie **seulement** ces trois lignes :

```json
"actif": true,
"message": {
  "fr": "Cérémonie décalée de 30 minutes",
  "en": "Ceremony delayed by 30 minutes"
}
```

`"niveau"` accepte `"info"` ou `"alerte"`.
Publie le fichier sur GitHub : l'annonce atteint tous les téléphones
en moins de 3 minutes, **même ceux déjà ouverts**.

Pour la retirer : `"actif": false`.

## 5. Mettre en ligne sur GitHub Pages

1. Sur github.com, crée un dépôt public nommé `agenda-gbm`
2. Bouton **Add file** → **Upload files** → glisse tous tes fichiers
3. Onglet **Settings** → **Pages** → Source : **Deploy from a branch**,
   branche `main`, dossier `/ (root)` → **Save**
4. Après deux minutes, ton adresse est :
   `https://<ton-compte>.github.io/agenda-gbm/`

Cette adresse est en HTTPS, donc le service worker s'active et
l'installation sur l'écran d'accueil devient possible.

Il ne reste plus qu'à régénérer le QR code avec cette adresse.

## 6. Réutiliser pour un autre événement

Change **uniquement `programme.json`**. Rien d'autre.

Si l'événement n'est pas à Abidjan, modifie aussi la ligne
`"utcOffset"` en haut du fichier — c'est la seule trace du fuseau
horaire dans tout le projet, et c'est volontaire.

---

## Ce que le projet ne contient pas encore

- **Le plan des stands** — en attente du plan d'implantation de la Patinoire
- **Les intervenants définitifs** — seuls les noms du programme officiel y figurent
- **L'agenda à jour** — le fichier reçu est identique à celui du 15 septembre

## L'ordre de lecture conseillé

1. `programme.json` — ce sont des données, tu comprendras tout
2. `index.html` — la structure, courte et lisible
3. `style.css` — commence par le bloc des tokens, tout en haut
4. `app.js` — les sept sections sont numérotées en commentaire
5. `sw.js` — le plus subtil, garde-le pour la fin
