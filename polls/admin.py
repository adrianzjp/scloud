'''
Created on 2012-10-25

@author: Adrian
'''
from polls.models import Poll
from django.contrib import admin

from polls.models import Choice

#admin.site.register(Choice)

#class PollAdmin(admin.ModelAdmin):
#    fields = ['pub_date', 'question']
#
#admin.site.register(Poll, PollAdmin)

#class PollAdmin(admin.ModelAdmin):
#    fieldsets = [
#        (None,               {'fields': ['question']}),
#        ('Date information', {'fields': ['pub_date']}),
#    ]
#
#admin.site.register(Poll, PollAdmin)

#class PollAdmin(admin.ModelAdmin):
#    fieldsets = [
#        (None,               {'fields': ['question']}),
#        ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
#    ]
#admin.site.register(Poll, PollAdmin)


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 3

class PollAdmin(admin.ModelAdmin):
    list_display = ('question', 'pub_date')
    fieldsets = [
        (None,               {'fields': ['question']}),
        ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    ]
    inlines = [ChoiceInline]
    list_filter = ['pub_date']
    search_fields = ['question']
    date_hierarchy = 'pub_date'
#    list_display = ('question', 'pub_date', 'was_published_recently')

admin.site.register(Poll, PollAdmin)












