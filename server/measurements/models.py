import uuid

from django.db import models
from django.contrib.auth import get_user_model
from decimal import Decimal
from django.core.validators import MinValueValidator, MaxValueValidator

class Measurement(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    when = models.DateField()
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
    )
    weight = models.DecimalField(max_digits=4, decimal_places=1, default=0, validators=[MinValueValidator(Decimal('0')), MaxValueValidator(Decimal('1000'))])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['when', 'user']
