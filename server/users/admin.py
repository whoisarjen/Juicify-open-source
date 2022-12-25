from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from django.utils.translation import gettext_lazy as _

class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = [x.name for x in CustomUser._meta.local_fields]

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (
            _("Personal info"),
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "email",
                    "height",
                    "sex",
                    "activity_level",
                    "is_coach_analyze",
                    "is_water_adder",
                    "is_workout_watch",
                    "is_sport_active",
                    "twitter",
                    "facebook",
                    "instagram",
                    "website",
                    "description",
                    "birth",
                    "goal",
                    "next_coach",
                    "number_of_meals",
                    "kind_of_diet",
                    "fiber",
                    "carbs_percent_as_sugar",
                    "proteins_day_0",
                    "carbs_day_0",
                    "fats_day_0",
                    "proteins_day_1",
                    "carbs_day_1",
                    "fats_day_1",
                    "proteins_day_2",
                    "carbs_day_2",
                    "fats_day_2",
                    "proteins_day_3",
                    "carbs_day_3",
                    "fats_day_3",
                    "proteins_day_4",
                    "carbs_day_4",
                    "fats_day_4",
                    "proteins_day_5",
                    "carbs_day_5",
                    "fats_day_5",
                    "proteins_day_6",
                    "carbs_day_6",
                    "fats_day_6",
                )
            }
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_public",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "password1", "password2", 'birth', 'height'),
            },
        ),
    )

admin.site.register(CustomUser, CustomUserAdmin)