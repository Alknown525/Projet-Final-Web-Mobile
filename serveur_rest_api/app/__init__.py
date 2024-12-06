from flask import Flask, flash, redirect, url_for
from flask_cors import CORS
from app.extensions import db, migrate, seeder, login, jwt
from flask_bootstrap import Bootstrap
from app.api import api_bp
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Initialize the extensions with the app
    db.init_app(app)
    migrate.init_app(app, db)
    seeder.init_app(app, db)  # Initialize seeder with app and db
    login.init_app(app)
    jwt.init_app(app)

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:8081"}})

    # Provide Bootstrap to the app
    Bootstrap(app)

    from app.modeles import Publication, Utilisateur

    with app.app_context():
        from . import routes

    # Register Blueprints
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
