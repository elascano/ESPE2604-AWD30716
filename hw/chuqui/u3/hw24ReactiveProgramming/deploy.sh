#!/bin/bash

# --- VARIABLE CONFIGURATION ---
ZIP_NAME="hw24ReactiveProgramming.zip"
FOLDER_NAME="hw24ReactiveProgramming"
PROCESS_NAME="fabuladental-reactive-frontend"

echo "=== 1. PREPARING THE SYSTEM AND INSTALLING TOOLS ==="
sudo apt-get update
sudo apt-get install -y curl unzip

echo "=== 2. INSTALLING NODE.JS 24 ==="
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "=== 3. DECOMPRESSING THE PROJECT ==="
if [ -f "$ZIP_NAME" ]; then
    unzip -o "$ZIP_NAME"
else
    echo "ERROR: File $ZIP_NAME not found"
    exit 1
fi

echo "=== 4. CLEAN INSTALLING DEPENDENCIES AND BUILDING ==="
cd "$FOLDER_NAME" || exit 1
rm -rf node_modules
npm install
npm run build

echo "=== 5. STARTING / RESTARTING THE APP WITH PM2 ==="
sudo npm install -g pm2 serve
pm2 delete "$PROCESS_NAME" 2>/dev/null || true
pm2 start "serve -s dist -l 80" --name "$PROCESS_NAME"

echo "=== 6. CONFIGURING VM REBOOT PERSISTENCE ==="
# Automatically configures PM2 inside the systemd boot system
PM2_STARTUP_CMD=$(pm2 startup systemd | grep "sudo env PATH")
if [ ! -z "$PM2_STARTUP_CMD" ]; then
    eval $PM2_STARTUP_CMD
fi

# Saves the current process list to freeze it on disk
pm2 save --force

echo "=== DEPLOYMENT COMPLETED SUCCESSFULLY! ==="