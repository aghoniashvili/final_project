from rest_framework import viewsets
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer, UserSerializer

# ეს View მოემსახურება პროდუქტებს
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# ეს View მოემსახურება კატეგორიებს
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # ნებისმიერს შეუძლია დარეგისტრირება
    serializer_class = UserSerializer