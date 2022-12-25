import uuid
import datetime

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _

class CustomUser(AbstractUser):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )

    sex = models.BooleanField(
        default=True,
        help_text=_("Designates the sex of user."),
    )

    number_of_meals = models.IntegerField(
        default=5,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(10)
        ],
        help_text=_("Designates how many meals user wants to have in profile."),
    )

    is_public = models.BooleanField(
        default=True,
        help_text=_("Designates whether the user's profile can be show to other people."),
    )

    height = models.IntegerField(
        default=190,
        validators=[
            MinValueValidator(120),
            MaxValueValidator(300)
        ],
        help_text=_("Designates how tall is user."),
    )

    twitter = models.CharField(
        null=True,
        blank=True,
        max_length=255,
    )

    website = models.CharField(
        null=True,
        blank=True,
        max_length=255,
    )

    facebook = models.CharField(
        null=True,
        blank=True,
        max_length=255,
    )

    instagram = models.CharField(
        null=True,
        blank=True,
        max_length=255,
    )

    website = models.CharField(
        null=True,
        blank=True,
        max_length=255,
    )

    description = models.CharField(
        null=True,
        blank=True,
        max_length=255,
    )

    birth = models.DateField(
        default=datetime.date.today
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

    next_coach = models.DateField(
        default=datetime.date.today,
    )

    is_coach_analyze = models.BooleanField(default=False)

    is_water_adder = models.BooleanField(default=True)

    is_workout_watch = models.BooleanField(default=True)

    is_sport_active = models.BooleanField(default=True)

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

    fiber = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(1000)
        ],
        help_text=_("Designates how many grams of fiber user wants to consume per day."),
    )

    carbs_percent_as_sugar = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100)
        ],
        help_text=_("Designates how many percent of carbs should come from sugar."),
    )

    proteins_day_0 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of proteins user wants to consume per day."),
    )

    carbs_day_0 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of carbs user wants to consume per day."),
    )

    fats_day_0 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of fat user wants to consume per day."),
    )

    proteins_day_1 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of proteins user wants to consume per day."),
    )

    carbs_day_1 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of carbs user wants to consume per day."),
    )

    fats_day_1 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of fat user wants to consume per day."),
    )

    proteins_day_2 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of proteins user wants to consume per day."),
    )

    carbs_day_2 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of carbs user wants to consume per day."),
    )

    fats_day_2 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of fat user wants to consume per day."),
    )

    proteins_day_3 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of proteins user wants to consume per day."),
    )

    carbs_day_3 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of carbs user wants to consume per day."),
    )

    fats_day_3 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of fat user wants to consume per day."),
    )

    proteins_day_4 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of proteins user wants to consume per day."),
    )

    carbs_day_4 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of carbs user wants to consume per day."),
    )

    fats_day_4 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of fat user wants to consume per day."),
    )

    proteins_day_5 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of proteins user wants to consume per day."),
    )

    carbs_day_5 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of carbs user wants to consume per day."),
    )

    fats_day_5 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of fat user wants to consume per day."),
    )

    proteins_day_6 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of proteins user wants to consume per day."),
    )

    carbs_day_6 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of carbs user wants to consume per day."),
    )

    fats_day_6 = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10000)
        ],
        help_text=_("Designates how many grams of fat user wants to consume per day.")
    )

    confirm_email_hash = models.CharField(
        max_length=36,
        default=uuid.uuid4,
        editable=False,
        help_text=_("Hash used to confirm email"),
    )

    is_confirm_email_hash_expired = models.BooleanField(
        default=False
    )
