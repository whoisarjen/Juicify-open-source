from django.contrib import admin
from .models import Measurement

class MeasurementAdmin(admin.ModelAdmin):
    model = Measurement
    
    list_display = [x.name for x in Measurement._meta.local_fields]

admin.site.register(Measurement, MeasurementAdmin)