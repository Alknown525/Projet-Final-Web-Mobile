from flask import current_app as app, flash, redirect, render_template, request, url_for
from datetime import datetime
from flask_login import current_user, login_required, login_user, logout_user
from app.extensions import db
import sqlalchemy as sa
from app.modeles import Publication, Utilisateur



@app.route('/', methods=['GET'])
def index():
    # return render_template('index.html', titre='Accueil')
    return render_template('index.html')
