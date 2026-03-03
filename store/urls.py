from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import ProductViewSet, CategoryViewSet , RegisterView, CartView ,CreateOrderView , OrderListView

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', obtain_auth_token, name='login'),
    path('cart/', CartView.as_view(), name='cart'),
    path('orders/', CreateOrderView.as_view(), name='create-order'),
    path('orders/list/', OrderListView.as_view(), name='order-list'),
]