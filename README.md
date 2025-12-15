# Refuge de chats – Application Web

## Description sommaire de l’application publiée

Cette application web permet la gestion d’un refuge de chats.  
Elle permet d’afficher les chats disponibles à l’adoption et,  
pour les utilisateurs authentifiés, d’ajouter, modifier et supprimer des chats.  
L’interface est responsive et disponible en français et en anglais.

---

## Authentification

Certaines fonctionnalités nécessitent une authentification :

- Ajouter un chat
- Modifier un chat
- Supprimer un chat

Compte de démonstration :

- Email : admin@example.com
- Mot de passe : 1234

L’authentification est gérée par l’API à l’aide de jetons JWT.

---

## Procédure d’installation de l’application sur un poste local

```bash
git clone https://github.com/Victo-2342698/chat-frontend.git
cd chat-frontend
npm install
npm run dev
```
