import uuid

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

from workout_plans.models import WorkoutPlan

class WorkoutResult(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    name = models.CharField(max_length=100)
    note = models.CharField(max_length=500, null=True, blank=True)
    burned_calories = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5000)])
    when = models.DateField()
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
    )
    workout_plan = models.ForeignKey(
        WorkoutPlan,
        on_delete=models.SET_NULL,
        null=True,
    )
    exercises = models.JSONField(default=list, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.name:
            return self.name
        return str(f'ID: {self.id}')