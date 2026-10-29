# Procedurae : mise en ligne

Ce dossier contient l'application complète. Pour la mettre en ligne gratuitement sur GitHub Pages et l'installer sur un téléphone Android, suivez ces étapes depuis un ordinateur.

## 1. Créer un compte GitHub
Rendez vous sur https://github.com et créez un compte gratuit. Votre nom d'utilisateur figurera dans l'adresse de l'application.

## 2. Créer un dépôt
1. Cliquez sur « New repository » (bouton « + » en haut à droite, puis « New repository »).
2. Nom du dépôt : par exemple `procedure-civile`.
3. Choisissez « Public » : l'hébergement gratuit de GitHub Pages l'exige. Le contenu sera donc consultable par quiconque connaît l'adresse.
4. Cliquez sur « Create repository ».

## 3. Déposer les fichiers
1. Décompressez l'archive sur votre ordinateur.
2. Sur la page du dépôt, cliquez sur le lien « uploading an existing file ».
3. Faites glisser dans la fenêtre le contenu du dossier décompressé : `index.html`, `manifest.json`, `sw.js`, et les dossiers `js` et `icons`.
4. Cliquez sur « Commit changes ».

## 4. Activer GitHub Pages
1. Dans le dépôt, ouvrez « Settings », puis « Pages » dans le menu de gauche.
2. Sous « Build and deployment », source : « Deploy from a branch ».
3. Branche : `main`, dossier : `/ (root)`. Cliquez sur « Save ».
4. Après quelques minutes, l'adresse s'affiche en haut de cette page, sous la forme `https://votre-nom.github.io/procedure-civile/`.

## 5. Installer sur Android
1. Ouvrez l'adresse dans Chrome sur le téléphone.
2. Touchez le menu ⋮ puis « Installer l'application » ou « Ajouter à l'écran d'accueil ».
3. L'application s'ouvre ensuite en plein écran et fonctionne hors connexion après une première visite.

La progression (QCM, fiches, réponses aux cas pratiques) est enregistrée sur chaque appareil, pour chaque utilisateur.

## Mettre à jour l'application
Déposez les nouveaux fichiers dans le dépôt de la même façon (ils remplacent les anciens). Le fichier `sw.js` porte un numéro de version : il est modifié à chaque livraison afin que les téléphones récupèrent la nouvelle version.
