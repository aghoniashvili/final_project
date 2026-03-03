from rest_framework import serializers
from .models import Product, Category, Cart, CartItem, Order, OrderItem
from django.contrib.auth.models import User

# 1. კატეგორიის სერიალიზატორი
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

# 2. პროდუქტის სერიალიზატორი
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'stock', 'image', 'category']

# 3. იუზერის სერიალიზატორი
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# 4. კალათაში არსებული ნივთის სერიალიზატორი
class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']

# 5. მთავარი კალათის სერიალიზატორი
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'created_at']

# --- ახალი ნაწილი შეკვეთებისთვის ---

# 6. შეკვეთილი ნივთის სერიალიზატორი
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    # ვამატებთ პროდუქტის სურათის URL-ს
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'price']

    def get_product_image(self, obj):
        # ვამოწმებთ, აქვს თუ არა პროდუქტს სურათი და ვაბრუნებთ სრულ URL-ს
        if obj.product.image:
            return obj.product.image.url
        return None

# 7. მთავარი შეკვეთის სერიალიზატორი
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'total_price', 'items', 'created_at']