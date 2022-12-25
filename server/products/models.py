import uuid

from django.db import models
from django.contrib.auth import get_user_model
from decimal import Decimal
from django.core.validators import MinValueValidator

class Category(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    name = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

class Product(models.Model):
    
    list_display = (
        'name',
        'proteins',
        'carbs',
        'sugar',
        'fats',
        'fiber',
        'sodium',
        'ethanol',
        'barcode',
        'is_verified',
        'is_deleted',
        'is_expecting_check',
        'user',
        'created_at',
        'updated_at',
    )

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    name = models.CharField(max_length=500)
    proteins = models.DecimalField(max_digits=5, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0'))])
    carbs = models.DecimalField(max_digits=5, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0'))])
    sugar = models.DecimalField(max_digits=5, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0'))])
    fats = models.DecimalField(max_digits=5, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0'))])
    fiber = models.DecimalField(max_digits=5, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0'))])
    sodium = models.DecimalField(max_digits=5, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0'))])
    ethanol = models.DecimalField(max_digits=5, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0'))])
    barcode = models.BigIntegerField(default=0, validators=[MinValueValidator(0)])
    is_verified = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    is_expecting_check = models.BooleanField(default=False)
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
