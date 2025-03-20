from django.db import models

class Category(models.Model):
    nom = models.CharField(max_length=255)

    def __str__(self):
        return self.nom

class Produit(models.Model):
    nom = models.CharField(max_length=255)
    description = models.TextField()
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    unit = models.CharField(max_length=50)
    availability = models.BooleanField(default=True)
    sale = models.BooleanField(default=False)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return self.nom
