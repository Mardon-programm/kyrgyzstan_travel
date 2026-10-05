import os
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings_vercel')

import django
from django.core.wsgi import get_wsgi_application

# Initialize Django
django.setup()

# Get the WSGI application
application = get_wsgi_application()