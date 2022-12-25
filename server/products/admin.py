from django.contrib import admin
from .models import Product, Category

class ProductAdmin(admin.ModelAdmin):
    model = Product
    
    list_display = [x.name for x in Product._meta.local_fields]

admin.site.register(Product, ProductAdmin)
admin.site.register(Category)