from django.contrib import admin

from apps.mentorship.models import ContentProgress, MentorshipContent, MentorshipModule, MentorshipProgram

admin.site.register(MentorshipProgram)
admin.site.register(MentorshipModule)
admin.site.register(MentorshipContent)
admin.site.register(ContentProgress)

