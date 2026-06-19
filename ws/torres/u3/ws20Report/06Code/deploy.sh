#!/bin/bash

APP_DIR="/home/academiabaile/AcademiaBaile/AWD-30716-Code-Coffee/06Code"

if [ ! -d "$APP_DIR" ]; then
    echo "Error: Directory $APP_DIR does not exist. Please upload your files via SFTP first."
    exit 1
fi

cd "$APP_DIR"

echo "Building and deploying via Docker Compose..."
sudo docker-compose up -d --build

echo "Waiting 10 seconds for Postgres to initialize..."
sleep 10

if [ -f "./cleanup_db.sh" ]; then
    echo "Executing cleanup_db.sh..."
    chmod +x ./cleanup_db.sh
    ./cleanup_db.sh
else
    echo "Warning: cleanup_db.sh not found in $APP_DIR. Skipping database reset."
fi

echo "Deployment successful. Your app is running on port 8080."
