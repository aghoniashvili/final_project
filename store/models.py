from django.db import models
from django.contrib.auth.models import User

# 1. კატეგორია (მაგ: "Smartphones", "Laptops")
class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories" # რომ ადმინში სწორად ეწეროს

# 2. პროდუქტი
class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2) # მაგ: 99.99
    image = models.ImageField(upload_to='products/', blank=True, null=True) # სურათი
    stock = models.PositiveIntegerField(default=0) # რამდენი გვაქვს მარაგში
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# 3. კალათის ნივთი (რა აქვს იუზერს კალათაში)
class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1) # რაოდენობა

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"

# 4. შეკვეთა (როცა იყიდის)
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"