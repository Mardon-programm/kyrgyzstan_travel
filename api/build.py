#!/usr/bin/env python
import os
import sys
import subprocess
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings_vercel')

import django
django.setup()

from django.core.management import execute_from_command_line

# Run migrations
print("Running migrations...")
try:
    execute_from_command_line(['manage.py', 'migrate', '--noinput'])
    print("Migrations completed successfully")
except Exception as e:
    print(f"Migration error: {e}")
    sys.exit(1)

# Collect static files
print("Collecting static files...")
try:
    execute_from_command_line(['manage.py', 'collectstatic', '--noinput'])
    print("Static files collected successfully")
except Exception as e:
    print(f"Static files error: {e}")

print("Build completed")