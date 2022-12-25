from django.contrib import admin
from .models import Coach

class CoachAdmin(admin.ModelAdmin):
    model = Coach
    
    list_display = [x.name for x in Coach._meta.local_fields]

admin.site.register(Coach, CoachAdmin)