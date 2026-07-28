#!/bin/bash

ZIP_NAME="hw22php.zip"
FOLDER_NAME="hw22php"
TARGET_DIR="/var/www/html"

sudo apt-get update
sudo apt-get install -y unzip

sudo apt-get install -y apache2 php libapache2-mod-php php-curl

if [ -f "$ZIP_NAME" ]; then
    unzip -o "$ZIP_NAME"
else
    echo "ERROR: File $ZIP_NAME not found"
    exit 1
fi

sudo rm -f "$TARGET_DIR/index.html"

sudo cp -r ./"$FOLDER_NAME"/* "$TARGET_DIR/"

sudo chown -R www-data:www-data "$TARGET_DIR"

sudo systemctl enable apache2
sudo systemctl restart apache2

echo "=== DEPLOYMENT COMPLETED SUCCESSFULLY! ==="