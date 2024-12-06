from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_seeder import FlaskSeeder
from flask_login import LoginManager
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO


# Initialize the extensions here
db = SQLAlchemy()      # Initialize SQLAlchemy
migrate = Migrate()    # Initialize Flask-Migrate
seeder = FlaskSeeder() # Initialize Flask-Seeder (but to be connected to app later)
login = LoginManager() # Intialize LoginManager
jwt = JWTManager()
socketio = SocketIO()