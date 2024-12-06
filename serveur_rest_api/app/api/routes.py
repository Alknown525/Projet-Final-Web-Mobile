from flask import current_app as app, jsonify, request, send_from_directory
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from app.extensions import db

# Activer la ligne c-dessous lorsque le modele est cree
from app.modeles import Publication, Utilisateur, suivis
from app.api import api_bp
import os

# Creer le login (session)
@api_bp.route("/jeton", methods=["POST"])
def demander_jeton():
    data = request.get_json()
    utilisateur = Utilisateur.query.filter_by(courriel=data["courriel"]).first()

    # valider le mot de passe
    if not utilisateur or not utilisateur.valide_mot_passe(data["password"]):
        return jsonify({
            "status": "PASOK",
            "erreur": "Donnees d'authentifcation invalides"
        }), 401

    # l'utilisateur est authentifie, creer le jwt
    jeton = create_access_token(identity=utilisateur.id)

    return jsonify({"status": "OK", "jeton": jeton, "username": utilisateur.nom, "userId": utilisateur.id}), 200


# Creer les routes pour les operations CRUD

@api_bp.route("/", methods=["GET"])
@jwt_required()
def accueil():
    id = get_jwt_identity()
    print(f"Id utilisateur: {id}")
    utilisateur = Utilisateur.query.get(id)

    if not utilisateur:
        return jsonify({"status": "PASOK", "message": "Utilisateur introuvable"}), 404

    return jsonify({"nom": utilisateur.nom, "courriel": utilisateur.courriel}), 200



@api_bp.route("/utilisateur/<int:id>", methods=["GET"])
def get_utilisateur(id):
    user = Utilisateur.query.get(id)
    
    if not user:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    followers = [
        {"id": suivis.id}
        for suivis in user.followers
    ]
    
    return jsonify({
        "id": user.id,
        "nom": user.nom,
        "courriel": user.courriel,
        "image_profil": user.image_profil,
        "followers": followers,
    }), 201


@api_bp.route("/utilisateur", methods=["GET"])
def liste_utilisateurs():
    utilisateurs = Utilisateur.query.all()
    liste_utilisateurs = []

    for utilisateur in utilisateurs:
        followers = [
            {"id": suivis.id}
            for suivis in utilisateur.followers
        ]

        liste_utilisateurs.append({
            "id": utilisateur.id,
            "nom": utilisateur.nom,
            "courriel": utilisateur.courriel,
            "image_profil": utilisateur.image_profil,
            "followers": followers,
        })

    return jsonify(liste_utilisateurs), 201


@api_bp.route("/utilisateur/suivre/<int:id>", methods=["GET"])
@jwt_required()
def suivre_utilisateur(id):
    current_user_id = get_jwt_identity()

    if current_user_id == id:
        return jsonify({"message": "Vous ne pouvez pas vous suivre vous-même"}), 400

    user_to_follow = Utilisateur.query.get(id)
    
    if not user_to_follow:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    current_user = Utilisateur.query.get(current_user_id)
    
    if current_user in user_to_follow.followers:
        return jsonify({"message": "Vous suivez déjà cet utilisateur"}), 400

    user_to_follow.followers.append(current_user)
    db.session.commit()

    return jsonify({"message": f"Vous suivez maintenant {user_to_follow.nom}"}), 200


@api_bp.route("/utilisateur/ne_plus_suivre/<int:id>", methods=["GET"])
@jwt_required()
def ne_plus_suivre_utilisateur(id):
    current_user_id = get_jwt_identity()

    user_to_unfollow = Utilisateur.query.get(id)
    
    if not user_to_unfollow:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    current_user = Utilisateur.query.get(current_user_id)
    
    if current_user not in user_to_unfollow.followers:
        return jsonify({"message": "Vous ne suivez pas cet utilisateur"}), 400

    user_to_unfollow.followers.remove(current_user)
    db.session.commit()

    return jsonify({"message": f"Vous ne suivez plus {user_to_unfollow.nom}"}), 200

@api_bp.route("/utilisateur/suivi", methods=["GET"])
@jwt_required()
def liste_suivis():
    current_user_id = get_jwt_identity()

    try:
        print('start')
        query_suivis = suivis.query.get(current_user_id)
        print('query_suivis créé')

        if not query_suivis:
            return jsonify({"message": "Vous ne suivez personne"}), 404
        
        suivis_liste = []

        for suivi in query_suivis:
            suivis_liste.append({
                "id": suivi.utilisateur_suivi
            })
        print('ajouté tout a la liste')

        return jsonify(suivis_liste), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"erreur": "Une erreur s'est produite"}), 500 

@api_bp.route("/publications", methods=["GET"])
@jwt_required()
def liste_publications():
    try:
        publications = Publication.query.all()

        if not publications:
            return jsonify({"message": "Aucune publication disponible"}), 404

        publications_liste = []

        for publication in publications:

            utilisateur = Utilisateur.query.get(publication.auteur_id)

            followers = [
                {"id": suivis.id}
                for suivis in utilisateur.followers
            ]
            
            publications_liste.append({
                "id": publication.id,
                "titre": publication.titre,
                "message": publication.message,
                "image": publication.image,
                "utilisateur": {
                    "id": utilisateur.id,
                    "nom": utilisateur.nom,
                    "courriel": utilisateur.courriel,
                    "image_profil": utilisateur.image_profil,
                    "followers": followers
                }
            })
            
        return jsonify({
            "status": "OK",
            "publications": publications_liste
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"erreur": "Une erreur s'est produite"}), 500


@api_bp.route("/publications/<int:id>", methods=["GET"])
@jwt_required()
def get_publication(id):
    try:
        publication = Publication.query.get(id)

        if not publication:
            return jsonify({"message": "Publication non disponible"}), 404

        publication_json = {
            "id": publication.id,
            "titre": publication.titre,
            "message": publication.message,
            "image": publication.image,
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

        titre = data.get("titre")
        description = data.get("description")
        image = data.get("image", "")

        if not titre or not description:
            return jsonify({
                "status": "PASOK",
                "erreur": "Donnees de publications invalides"
            }), 400
        

        publication = Publication(
            titre=titre,
            message=description,
            image=image,
            auteur_id=user_id,
        )

        db.session.add(publication)
        db.session.commit()

        publication_data = {
            "id": publication.id,
            "titre": publication.titre,
            "message": publication.message,
            "image": publication.image,
            "auteur_id": publication.auteur_id,
        }

        from app import socketio
        socketio.emit('nouvelle_publication', {'message': 'New publication created'})

        return jsonify({
            "status": "OK",
            "publication": publication_data,
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Une erreur s'est produite",
            "details": str(e)
        }), 500
    

@api_bp.route('/utilisateur/following', methods=['GET'])
@jwt_required()
def get_following_users():
    current_user_id = get_jwt_identity()
    utilisateurs = Utilisateur.query.all()

    if not current_user_id:
        return jsonify({"error": "User ID is required"}), 400

    following_users = []

    for utilisateur in utilisateurs:
        if any(follower['id'] == current_user_id for follower in utilisateur['followers']):
            following_users.append(utilisateur.id)

    return jsonify(following_users)
    