from django.contrib import admin
from consumed.models import Consumed

class ConsumedAdmin(admin.ModelAdmin):
    model = Consumed
    
    list_display = [x.name for x in Consumed._meta.local_fields]

admin.site.register(Consumed, ConsumedAdmin)