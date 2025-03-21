from django.urls import path
from MyBdd import views

urlpatterns = [
    path('products/', views.ProduitList.as_view()),
]
