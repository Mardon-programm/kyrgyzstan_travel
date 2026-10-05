#!/bin/bash
# Vercel Post-Deploy Migration Script
# Run this after deployment: vercel exec -- bash scripts/migrate.sh

set -e

echo "Running Django migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "Done!"