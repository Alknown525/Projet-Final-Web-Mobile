from app.extensions import db
from app import login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime

suivis = db.Table(
    'suivis',
    db.Column('utilisateur_id', db.Integer, db.ForeignKey('utilisateur.id'), primary_key=True),
    db.Column('utilisateur_suivi', db.Integer, db.ForeignKey('utilisateur.id'), primary_key=True)
)

class Publication(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    auteur_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'), nullable=False)

class Utilisateur(UserMixin, db.Model):

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(50), nullable=False)
    courriel = db.Column(db.String(100), nullable=False, index=True, unique=True)
    mot_passe_hache = db.Column(db.String(256), nullable=False)
    image_profil = db.Column(db.String(255), nullable=True)

    followers = db.relationship(
        'Utilisateur',
        secondary='suivis',
        primaryjoin=(id == suivis.c.utilisateur_suivi),
        secondaryjoin=(id == suivis.c.utilisateur_id),
        backref='following',
        lazy='dynamic'
    )

    def encode_mot_passe(self, mot_passe):
        self.mot_passe_hache = generate_password_hash(mot_passe)

    def valide_mot_passe(self, mot_passe):
        return check_password_hash(self.mot_passe_hache, mot_passe)

    @login.user_loader
    def load_user(id):
        return db.session.get(Utilisateur, int(id))
