from rest_framework import serializers
from .models import Product, Category
from django.contrib.auth.models import User

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

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user