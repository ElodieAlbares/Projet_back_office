from django.core.management.base import BaseCommand
from MyBdd.models import Produit

class Command(BaseCommand):
    help = "Ajoute plusieurs produits dans la base de données"

    def handle(self, *args, **kwargs):
        # Liste des produits à ajouter
        from MyBdd.models import Category, Produit

        # Récupérer les catégories en fonction de leur ID
        category_1 = Category.objects.get(id=1)
        category_2 = Category.objects.get(id=2)
        category_3 = Category.objects.get(id=3)

        produits = [
            {
                "nom": "Aile de raie",
                "description": "elle peut plus voler",
                "prix": 19.99,
                "category": category_1,  # Catégorie 1
                "unit": "pièce",
                "availability": True,
                "sale": False,
                "discount": 0.00,
                "quantity": 10,
            },
            {
                "nom": "Araignées",
                "description": "8 pattes",
                "prix": 29.99,
                "category": category_3,  # Catégorie 3
                "unit": "pièce",
                "availability": True,
                "sale": False,
                "discount": 0.00,
                "quantity": 5,
            },
            {
                "nom": "Bar de ligne",
                "description": "Description du produit 3",
                "prix": 39.99,
                "category": category_1,  # Catégorie 1
                "unit": "pièce",
                "availability": True,
                "sale": True,
                "discount": 5.00,
                "quantity": 20,
            },
            {
                "nom": "Bar de ligne portion",
                "description": "Description du produit 4",
                "prix": 49.99,
                "category": category_1,  # Catégorie 1
                "unit": "pièce",
                "availability": True,
                "sale": True,
                "discount": 10.00,
                "quantity": 15,
            },
            {
                "nom": "Bouquets cuits",
                "description": "Description du produit 3",
                "prix": 39.99,
                "category": category_3,  # Catégorie 3
                "unit": "pièce",
                "availability": True,
                "sale": True,
                "discount": 5.00,
                "quantity": 20,
            },
            {
                "nom": "Filet Bar de ligne",
                "description": "Description du produit 3",
                "prix": 39.99,
                "category": category_1,  # Catégorie 1
                "unit": "pièce",
                "availability": True,
                "sale": True,
                "discount": 5.00,
                "quantity": 20,
            },
            {
                "nom": "Filet Julienne",
                "description": "Description du produit 3",
                "prix": 39.99,
                "category": category_1,  # Catégorie 1
                "unit": "pièce",
                "availability": True,
                "sale": True,
                "discount": 5.00,
                "quantity": 20,
            },
            {
                "nom": "Huitres N°2 St Vaast",
                "description": "Description du produit 3",
                "prix": 39.99,
                "category": category_2,  # Catégorie 2
                "unit": "pièce",
                "availability": True,
                "sale": True,
                "discount": 5.00,
                "quantity": 20,
            },
            {
                "nom": "Huîtres N°2 OR St Vaast",
                "description": "Description du produit 3",
                "prix": 39.99,
                "category": category_2,  # Catégorie 2
                "unit": "pièce",
                "availability": True,
                "sale": True,
                "discount": 5.00,
                "quantity": 20,
            },
            {
                "nom": "Lieu jaune de ligne",
                "description": "Description du produit 3",
                "prix": 39.99,
                "category": category_1,  # Catégorie 1
                "unit": "pièce",
                "availability": True,
                "sale": True,
                "discount": 5.00,
                "quantity": 20,
            },
            {
                "nom": "Lieu jaune de ligne",
                "description": "Description du produit 3",
                "prix": 39.99,
                "category": category_1,  # Catégorie 1
                "unit": "pièce",
                "availability": True,
                "sale": True,
                "discount": 5.00,
                "quantity": 20,
            },
            {
                "nom": "Moules de pêchee",
                "description": "Description du produit 3",
                "prix": 39.99,
                "category": category_2,  # Catégorie 2
                "unit": "pièce",
                "availability": True,
                "sale": True,
                "discount": 5.00,
                "quantity": 20,
            },
        ]

        # Ajouter les produits dans la base de données
        for produit_data in produits:
            produit = Produit(**produit_data)
            produit.save()

        self.stdout.write(self.style.SUCCESS(f"{len(produits)} produits ajoutés avec succès!"))
