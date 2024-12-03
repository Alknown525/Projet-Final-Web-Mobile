from flask import jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.extensions import db

# Activer la ligne c-dessous lorsque le modele est cree
from app.modeles import Publication, Utilisateur, suivis
from app.api import api_bp

# Creer les routes d'authentifications


# Creer le login (session)
@api_bp.route("/jeton", methods=["POST"])
def demander_jeton():
    data = request.get_json()
    utilisateur = Utilisateur.query.filter_by(courriel=data["courriel"]).first()

    # valider le mot de passe
    if not utilisateur or not utilisateur.valide_mot_passe(data["password"]):
        return jsonify({"erreur": "Donnees d'authentifcation invalides"}), 401

    # l'utilisateur est authentifie, creer le jwt
    jeton = create_access_token(identity=utilisateur.id)

    return jsonify({"jeton": jeton, "username": utilisateur.nom, "userId": utilisateur.id}), 201


# Creer les routes pour les operations CRUD

@api_bp.route("/", methods=["GET"])
def accueil():

    id = get_jwt_identity()
    print(f"Id utilisateur: {id}")

    utilisateur = Utilisateur.query.get(id)

    return {utilisateur.id}



@api_bp.route("/utilisateur/<int:id>", methods=["GET"])
def get_utilisateur(id):
    user = Utilisateur.query.get(id)
    
    if not user:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    followers_count = db.session.query(suivis).filter(suivis.c.utilisateur_suivi == user.id).count()
    
    return jsonify({
        "id": user.id,
        "nom": user.nom,
        "courriel": user.courriel,
        "followers": followers_count,
    })


@api_bp.route("/utilisateur", methods=["GET"])
def liste_utilisateurs():
    utilisateurs = Utilisateur.query.all()
    liste_utilisateurs = [
        {
            "id": utilisateur.id,
            "nom": utilisateur.nom,
            "courriel": utilisateur.courriel,
            "followers": len(utilisateur.followers),
        }
        for utilisateur in utilisateurs
    ]

    return jsonify(liste_utilisateurs)


@api_bp.route("/utilisateur/<int:id>/suivre", methods=["GET"])
@jwt_required()
def suivre_utilisateur(id):
    current_user_id = get_jwt_identity()

    if current_user_id == id:
        return jsonify({"message": "Vous ne pouvez pas vous suivre vous-même"}), 400

    user_to_follow = Utilisateur.query.get(id)
    
    if not user_to_follow:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    current_user = Utilisateur.query.get(current_user_id)
    
    if user_to_follow in current_user.followers:
        return jsonify({"message": "Vous suivez déjà cet utilisateur"}), 400

    current_user.followers.append(user_to_follow)
    db.session.commit()

    return jsonify({"message": f"Vous suivez maintenant {user_to_follow.nom}"})


@api_bp.route("/utilisateur/<int:id>/ne_plus_suivre", methods=["GET"])
@jwt_required()
def ne_plus_suivre_utilisateur(id):
    current_user_id = get_jwt_identity()

    user_to_unfollow = Utilisateur.query.get(id)
    
    if not user_to_unfollow:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    current_user = Utilisateur.query.get(current_user_id)
    
    if user_to_unfollow not in current_user.followers:
        return jsonify({"message": "Vous ne suivez pas cet utilisateur"}), 400

    current_user.followers.remove(user_to_unfollow)
    db.session.commit()

    return jsonify({"message": f"Vous ne suivez plus {user_to_unfollow.nom}"})



@api_bp.route("/publications", methods=["GET"])
def liste_publications():
    try:
        publications = Publication.query.all()

        if not publications:
            return jsonify({"message": "Aucune publication disponible"}), 404

        publications_json = [
            {
                "id": publication.id,
                "titre": publication.titre,
                "message": publication.message,
                "date": publication.date.strftime("%Y-%m-%d %H:%M:%S"),
                "auteur_id": publication.auteur_id
            }
            for publication in publications
        ]
        return jsonify(publications_json), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"erreur": "Une erreur s'est produite"}), 500


@api_bp.route("/publications/<int:id>", methods=["GET"])
@jwt_required()
def get_publication(id):
    try:
        user_id = get_jwt_identity()

        publication = Publication.query.get(id)

        if not publication:
            return jsonify({"message": "Publication non disponible"}), 404

        publication_json = {
            "id": publication.id,
            "titre": publication.titre,
            "message": publication.message,
            "date": publication.date.strftime("%Y-%m-%d %H:%M:%S"),
            "auteur_id": publication.auteur_id,
        }
        return jsonify(publication_json), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"erreur": "Une erreur s'est produite"}), 500


@api_bp.route("/publications", methods=["POST"])
@jwt_required()
def creer_publication():

    try:
        user_id = get_jwt_identity()

        data = request.get_json()

        if not data.get("titre") or not data.get("message"):
            return jsonify({"error": "Titre et message requis"}), 400

        publication = Publication(
            titre=data["titre"],
            message=data["description"],
            auteur_id=user_id,
        )

        db.session.add(publication)
        db.session.commit()

        return jsonify({
            "status": "Publication créée",
            "publication": {
                "id": publication.id,
                "titre": publication.titre,
                "message": publication.message,
                "auteur_id": publication.auteur_id,
                "date": publication.date.strftime("%Y-%m-%d %H:%M:%S"),
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"erreur": "Une erreur s'est produite"}), 500
