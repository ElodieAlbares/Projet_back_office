from django.core.management.base import BaseCommand
from MyBdd.models import Category

class Command(BaseCommand):
    help = 'Ajoute plusieurs categories dans la base de données'

    def handle(self, *args, **kwargs):
        # Liste des produits à ajouter
        categories = [
            {'id': "1",'nom': "Poissons"},
            {'id': "2",'nom': "Fruits de mer"},
            {'id': "3",'nom': "Crustasés"},
        ]

        # Ajouter les produits dans la base de données
        for categorie_data in categories:
            categorie = Category(**categorie_data)
            categorie.save()

        self.stdout.write(self.style.SUCCESS(f'{len(categories)} catégories ajoutés avec succès!'))
