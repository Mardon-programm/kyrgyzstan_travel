-- Initial database setup for Kyrgyzstan Travel
-- This runs automatically on first container startup

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance (will be created by Django migrations)
-- This is just a placeholder for any raw SQL needed