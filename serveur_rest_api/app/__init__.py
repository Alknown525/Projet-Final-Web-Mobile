from flask import Flask, flash, redirect, url_for
from flask_cors import CORS
from app.extensions import db, migrate, seeder, login
from flask_jwt_extended import JWTManager
from flask_bootstrap import Bootstrap
from app.api import api_bp


def create_app():
    app = Flask(__name__)

    # Load the configuration from config.py or environment variables
    app.config.from_object('config.Config')

    # Initialize the extensions with the app
    db.init_app(app)
    migrate.init_app(app, db)
    seeder.init_app(app, db)  # Initialize seeder with app and db
    login.init_app(app)

    CORS(app)

    jwt = JWTManager(app)

    # Provide Bootstrap to the app
    Bootstrap(app)

    from app.modeles import Publication, Utilisateur

    with app.app_context():
        from . import routes

    # Register Blueprints
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
