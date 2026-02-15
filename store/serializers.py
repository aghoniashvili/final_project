from rest_framework import serializers
from .models import Product, Category

# 1. კატეგორიის თარჯიმანი
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

# 2. პროდუქტის თარჯიმანი
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        # აქ ვუთითებთ, რომელი ველები გვინდა გამოჩნდეს API-ში
        fields = ['id', 'name', 'price', 'description', 'stock', 'image', 'category']