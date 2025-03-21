from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Produit
from .serializers import ProduitSerializer
# Create your views here.

class ProduitList(APIView):
    def get(self, request):
        produits = Produit.objects.all()
        serializer = ProduitSerializer(produits, many=True)
        return Response(serializer.data)