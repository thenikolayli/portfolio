from django.contrib.auth.models import Group
from django.core.management import BaseCommand

# command that takes in a str argument: group name, and creates a new group if it doesn't exist already
class Command(BaseCommand):
    help = "Creates a new group"

    def add_arguments(self, parser):
        parser.add_argument("group_name", nargs='+', type=str)

    def handle(self, *args, **options):
        group_name = options['group_name'][0]

        if not Group.objects.filter(name=group_name).exists():
            Group.objects.create(name=group_name)
            self.stdout.write(self.style.SUCCESS("Created new group"))
        else:
            self.stdout.write(self.style.SUCCESS("Group already exists"))