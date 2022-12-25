import uuid

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal

class Coach(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )

    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    goal = models.DecimalField(
        default=0,
        choices=[
            (-1.5, -1.5),
            (-1.25, -1.25),
            (-1, -1),
            (-0.75, -0.75),
            (-0.5, -0.5),
            (0, 0),
            (0.5, 0.5),
            (0.75, 0.75),
            (1, 1),
            (1.25, 1.25),
            (1.5, 1.5),
        ],
        decimal_places=2,
        max_digits=3
    )

    kind_of_diet = models.IntegerField(
        default=0,
        choices=[
            (0, 'REGULAR'),
            (1, 'KETOGENIC'),
        ],
    )

    activity_level = models.IntegerField(
        default=0,
        choices=[
            (0, 0),
            (1, 1),
            (2, 2),
            (3, 3),
            (4, 4),
        ],
    )

    weight = models.DecimalField(max_digits=4, decimal_places=1, default=0, validators=[MinValueValidator(Decimal('0')), MaxValueValidator(Decimal('1000'))])

    data = models.JSONField(default=list, null=True, blank=True)

    is_sport_active = models.BooleanField(default=True)
    is_coach_analyze = models.BooleanField(default=False)

    counted_proteins = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(1000)],
    )
    counted_carbs = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(1000)],
    )
    counted_fats = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(1000)],
    )

    bmr = models.PositiveIntegerField(default=0)
    calories = models.PositiveIntegerField(default=0)
    data_coverage_percentage = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])

    created_at = models.DateTimeField(auto_now_add=True)
