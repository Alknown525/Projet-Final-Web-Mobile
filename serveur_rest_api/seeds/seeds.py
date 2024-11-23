from datetime import datetime
from faker import Faker
from flask_seeder import Seeder, generator
from werkzeug.security import generate_password_hash
import random
from app.modeles import Publication, Utilisateur, suivis
from app import db


class PublicationSeeder(Seeder):

    def empty_database(self):
        """Supprime tous les enregistrements des tables de la base de données."""
        db.session.execute(suivis.delete())
        db.session.execute(db.delete(Publication))
        db.session.execute(db.delete(Utilisateur))

        db.session.commit()

    def run(self):

        self.empty_database()

        # Creer les publications
        faker = Faker()

        publication_instances = []
        for _ in range(10):
            publication = Publication(
                titre=faker.sentence(nb_words=5),
                message=faker.paragraph(nb_sentences=2),
                date=faker.date_this_year(),
                auteur_id=random.choice([1, 2, 3, 4])
            )
            print(f"Ajout publication: {publication.titre}")
            publication_instances.append(publication)
            self.db.session.add(publication)

        # Creer les utilisateurs
        utilisateurs = [
            {
                "nom": "Bob",
                "courriel": "Bob@gmail.com",
                "mot_passe_hache": generate_password_hash("Bob123"),
                "image_profil": faker.image_url()
            },
            {
                "nom": "Bobby",
                "courriel": "Bobby@gmail.com",
                "mot_passe_hache": generate_password_hash("Bobby123"),
                "image_profil": faker.image_url()
            },
            {
                "nom": "Jean",
                "courriel": "jean@gmail.com",
                "mot_passe_hache": generate_password_hash("Jean123"),
                "image_profil": faker.image_url()
            },
            {
                "nom": "Paul",
                "courriel": "paul@gmail.com",
                "mot_passe_hache": generate_password_hash("Paul123"),
                "image_profil": faker.image_url()
            }
        ]

        utilisateur_instances = []
        for user in utilisateurs:
            utilisateur = Utilisateur(
                nom=user['nom'],
                courriel=user['courriel'],
                mot_passe_hache=user['mot_passe_hache'],
                image_profil=user['image_profil']
            )
            print(f"Ajout utilisateur: {user['nom']}")

            assigned_publications = random.sample(publication_instances, 3)
            utilisateur.publications = assigned_publications
            utilisateur_instances.append(utilisateur)
            self.db.session.add(utilisateur)

        self.db.session.commit()


        all_users = Utilisateur.query.all()
        for user in utilisateur_instances:
            users_to_follow = random.sample([u for u in utilisateur_instances if u != user], random.randint(1, 3))
            for followed_user in users_to_follow:
                follow = suivis.insert().values(
                    utilisateur_id=user.id,
                    utilisateur_suivi=followed_user.id
                )
                self.db.session.execute(follow)

        self.db.session.commit()
