from rest_framework import viewsets, generics , filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.models import User
from .models import Cart, CartItem, Product, Category, Order, OrderItem
from .serializers import (
    ProductSerializer, CategorySerializer, UserSerializer, 
    CartSerializer, OrderSerializer
)

# პროდუქტების ViewSet
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# კატეგორიების ViewSet
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# რეგისტრაციის View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

# კალათის View (GET, POST, PUT, DELETE)
class CartView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        cart_item, item_created = CartItem.objects.get_or_create(cart=cart, product=product)
        
        if not item_created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
            
        cart_item.save()
        return Response(CartSerializer(cart).data)

    def put(self, request):
        cart = Cart.objects.get(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity'))

        try:
            product = Product.objects.get(id=product_id)
            cart_item = CartItem.objects.get(cart=cart, product=product)
            if quantity > 0:
                cart_item.quantity = quantity
                cart_item.save()
            else:
                cart_item.delete()
            return Response(CartSerializer(cart).data)
        except (Product.DoesNotExist, CartItem.DoesNotExist):
            return Response({"error": "Item not found"}, status=404)

    def delete(self, request):
        cart = Cart.objects.get(user=request.user)
        product_id = request.data.get('product_id')
        try:
            product = Product.objects.get(id=product_id)
            CartItem.objects.get(cart=cart, product=product).delete()
            return Response(CartSerializer(cart).data)
        except (Product.DoesNotExist, CartItem.DoesNotExist):
            return Response({"error": "Item not found"}, status=404)

# შეკვეთის შექმნის View
class CreateOrderView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        try:
            cart = Cart.objects.get(user=user)
            cart_items = cart.items.all()
            
            if not cart_items:
                return Response({"error": "Cart is empty"}, status=400)

            total_price = sum(item.product.price * item.quantity for item in cart_items)
            order = Order.objects.create(user=user, total_price=total_price)

            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price
                )

            cart_items.delete() # კალათის გასუფთავება შეკვეთის შემდეგ
            return Response(OrderSerializer(order).data, status=201)

        except Cart.DoesNotExist:
            return Response({"error": "Cart not found"}, status=404)

# შეკვეთების ისტორიის View
class OrderListView(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        # მომხმარებელმა უნდა ნახოს მხოლოდ თავისი შეკვეთები
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # ვამატებთ ძებნის ფილტრს
    filter_backends = [filters.SearchFilter]
    # მიუთითებთ, რა ველებში ეძებოს (სახელი და აღწერა)
    search_fields = ['name', 'description']