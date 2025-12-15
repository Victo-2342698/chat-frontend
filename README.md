## React + TypeScript + Vite

Ce template fournit une configuration minimale pour faire fonctionner React avec Vite, incluant le Hot Module Replacement (HMR) et des règles ESLint de base.

---

## Refuge de chats – Application Web

Application web développée avec React permettant de gérer les chats d’un refuge (consultation, ajout, modification et suppression) via une API REST sécurisée.

L’application est responsive (mobile first), internationalisée (Français / Anglais) et nécessite une authentification pour accéder aux fonctionnalités principales.

---

## Technologies utilisées

- React (fonctionnel)
- TypeScript
- Vite
- React Router
- React Context (authentification)
- React-Intl (internationalisation)
- Fetch / Axios
- Tailwind CSS

---

## Application publiée

https://gentle-plant-0c9994e0f.3.azurestaticapps.net

## Authentification

L’accès aux fonctionnalités de gestion des chats nécessite une authentification.

### Identifiants de test

Courriel : admin@example.com
Mot de passe : 1234

Un token JWT est généré par l’API et stocké dans le navigateur.

---

## Communication avec l’API

L’application communique avec l’API suivante :

https://refugedechat2-cxd9cgfebzgch0gt.canadacentral-01.azurewebsites.net

### Méthodes HTTP utilisées

- GET (liste, détail, filtres)
- POST
- PUT
- DELETE

---

## Fonctionnalités principales

- Connexion / Déconnexion
- Affichage de la liste des chats
- Filtres (race, disponibilité, taux d’énergie)
- Ajout d’un chat
- Modification d’un chat
- Suppression d’un chat
- Changement de langue (FR / EN)

---

## Décomposition en composants

- LoginPage
- ChatsListPage
- AddChatPage
- EditChatPage
- Menu
- AuthContext

---

## Internationalisation

L’application est entièrement internationalisée en Français et Anglais à l’aide de React-Intl.

Fichiers de traduction :

- src/lang/fr.json
- src/lang/en.json

Un sélecteur de langue permet de changer dynamiquement la langue de l’application.

---

## Validations côté interface

- Champs requis
- Valeurs numériques valides
- Dates valides (naissance, mise en adoption)
- Messages d’erreur affichés à l’utilisateur
- Cohérence avec les validations serveur

---

## Design et responsivité

- Approche mobile first
- Interface responsive
- Affichage optimisé sur mobile, tablette et ordinateur

---

## Installation locale

### 1. Cloner le projet

```bash
git clone https://github.com/Victo-2342698/chat-frontend.git
cd refuge-chat-frontend
```
