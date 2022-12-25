import uuid

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

class WorkoutPlan(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=500, null=True, blank=True)
    burned_calories = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5000)])
    is_deleted = models.BooleanField(default=False)
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
    )
    exercises = models.JSONField(default=list, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.name:
            return self.name
        return str(f'ID: {self.id}')
