# Projet Final Web Mobile

## Installation

1. Cloner le dépôt

`https://github.com/Alknown525/Projet-Final-Web-Mobile.git`

## Section Serveur REST API (Backend)

1. Changer au répertoire /serveur_rest_api

**Assurez-vous que le terminal est dans ce répertoire, sinon les commandes ne vont pas fonctionner et peuvent causer problème**

2. Créer un fichier `.env` à la racine du projet

```
SECRET_KEY='votre_clé_secrète'
DATABASE_URL=sqlite:///app.db
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_APP = "run.py"
```

3. Créer un environnement virtuel

`python -m venv venv`

4. Activer l'environnement virtuel

- Windows: `venv\Scripts\activate`
- MacOS/Linux: `source venv/bin/activate`

5. Installer les dépendances

`pip install -r requirements.txt`

6. Créer la base de données

`flask db upgrade`

7. Entrer les données de test

`flask seed run`

8. Démarrer le serveur

`flask run`

## Section Serveur REST API (Backend)

1. Changer au répertoire /web_mobile

**Assurez-vous que le terminal est dans ce répertoire, sinon les commandes ne vont pas fonctionner et peuvent causer problème**

2. Installer les dépendances

`npm install`

3. Démarrer le serveur

`npm start`
