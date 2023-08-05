from django.conf import settings
from django.db import models
from django.db.models import Q

User = settings.AUTH_USER_MODEL #auth.User
# Create your models here.

class ProductQuerySet(models.QuerySet):
    def is_public(self):
        return self.filter(public=True)
    
    def search(self, query, user=None):
        lookup = Q(title__icontains=query) | Q(content__icontains=query)
        qs = self.is_public().filter(lookup)
        if user is not None:
            qs2 = self.filter(user=user).filter(lookup)
            qs = (qs | qs2).distinct()
        return qs
    

class ProductManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return ProductQuerySet(self.model, using=self._db)
    def search(self, query, user=None):
        return self.get_queryset.search(query=query, user=user)
    
class Product(models.Model):
    #owner = models.ForeignKey(User)
    user = models.ForeignKey(User, default=1, null=True, on_delete=models.SET_NULL)
    title = models.CharField(max_length=120)
    #blank=True null=True means that it is not needed to be added to json response for it to still show up when as a key in the json post
    content = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits = 15, decimal_places=2, default=99.99)
    public = models.BooleanField(default=True)
    objects = ProductManager()
    @property
    def sale_price(self):
        return "%.2f" %(float(self.price) * 0.8)
    
    def get_discount(self):
        return "122"