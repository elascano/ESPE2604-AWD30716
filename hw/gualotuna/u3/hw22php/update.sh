#!/bin/bash

FOLDER_NAME="hw22php"
TARGET_DIR="/var/www/html"

if [ -d "$FOLDER_NAME" ]; then
    echo "Found directory: $FOLDER_NAME"
else
    echo "ERROR: Directory $FOLDER_NAME not found."
    exit 1
fi

sudo cp -ru ./"$FOLDER_NAME"/* "$TARGET_DIR/"

sudo chown -R www-data:www-data "$TARGET_DIR"

sudo systemctl restart apache2

echo "=== UPDATE COMPLETED SUCCESSFULLY! ==="