import uuid

from django.db import models
from django.contrib.auth import get_user_model
from products.models import Product
from decimal import Decimal
from django.core.validators import MinValueValidator, MaxValueValidator

class Consumed(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    when = models.DateField()
    how_many = models.DecimalField(max_digits=3, decimal_places=1, default=1, validators=[MinValueValidator(Decimal('0.1'))])
    meal = models.IntegerField(default=1, validators=[MinValueValidator(0), MaxValueValidator(9)])
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user} - {self.when} - {self.meal}'