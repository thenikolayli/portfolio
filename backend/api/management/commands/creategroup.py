from django.contrib.auth.models import Group
from django.core.management import BaseCommand
from django.conf import settings

# command that creates a group with the VITE_KEYCLUB_GROUP_NAME name from settings
class Command(BaseCommand):
    help = "Creates a new group"

    def handle(self, *args, **options):
        group_name = settings.VITE_KEYCLUB_GROUP_NAME

        if not Group.objects.filter(name=group_name).exists():
            Group.objects.create(name=group_name)
            self.stdout.write(self.style.SUCCESS("Created new group"))
        else:
            self.stdout.write(self.style.SUCCESS("Group already exists"))