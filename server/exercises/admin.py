from django.contrib import admin
from .models import Exercise

class ExerciseAdmin(admin.ModelAdmin):
    model = Exercise
    
    list_display = [x.name for x in Exercise._meta.local_fields]

admin.site.register(Exercise, ExerciseAdmin)