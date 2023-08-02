from django.db import models

# Create your models here.
class Product(models.Model):
    title = models.CharField(max_length=120)
    #blank=True null=True means that it is not needed to be added to json response for it to still show up when as a key in the json post
    content = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits = 15, decimal_places=2, default=99.99)

    @property
    def sale_price(self):
        return "%.2f" %(float(self.price) * 0.8)
    
    def get_discount(self):
        return "122"