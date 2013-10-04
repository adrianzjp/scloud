from urllib import unquote
from django import template
register = template.Library()

from django.template.defaultfilters import stringfilter

@stringfilter
def unquote_new(value):
    return unquote(value)

register.filter('unquote_new', unquote_new)