#!/bin/bash

echo "--- Resetting ALCSystem Database to Clean Seed State ---"

# 1. Drop and recreate public schema (Extreme but guaranteed cleanup)
docker exec -i postgres psql -U user -d appdb -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# 2. Re-apply the canonical schema and seed data
cat ./backend/database/schema.sql | docker exec -i postgres psql -U user -d appdb

echo "--- Database Reset Completed Successfully ---"
