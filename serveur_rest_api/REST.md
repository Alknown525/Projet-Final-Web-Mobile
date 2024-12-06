# REST


## CRUD

- Read

- `GET /` -> Obtenir id de l'utilisateur avec un jeton
- `GET /utilisateur/` -> Liste des utilisateurs
- `GET /utilisateur/<int: id>` -> Obtenir infos sur un utilisateur avec son id 
- `GET /utilisateur/suivre/<int: id>` -> Suivre utilisateur avec son id
- `GET /utilisateur/ne_plus_suivre/<int: id>` -> Ne plus suivre utilisateur avec son id
- `GET /publications/` -> Liste des publications
- `GET /publications/<int: id>` -> Obtenir infos sur une publication avec son id 
- `GET /uploads/<filename>` -> Obtenir image (je crois?)

- Create

- `POST /jeton/` -> Creer un jeton d'accès
- `POST /publications/` -> Creer une nouvelle publication
- `POST /televerser_image/` -> Publier une image (je crois?)

- Update

- Delete
