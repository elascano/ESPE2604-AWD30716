#!/bin/bash

# --- VARIABLE CONFIGURATION ---
GITHUB_REPO_URL="https://github.com/your-username/your-backend-repository.git"
FOLDER_NAME="your-backend-repository"
PROCESS_NAME="hw18backend"

echo "=== 1. PREPARING THE SYSTEM AND INSTALLING TOOLS ==="
sudo apt-get update
sudo apt-get install -y curl git

echo "=== 2. INSTALLING NODE.JS 24 ==="
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "=== 3. DOWNLOADING UPDATED CODE FROM GITHUB ==="
rm -rf "$FOLDER_NAME"
git clone "$GITHUB_REPO_URL"

echo "=== 4. CLEAN INSTALLING DEPENDENCIES ==="
cd "$FOLDER_NAME" || exit 1
npm install

echo "=== 5. STARTING / RESTARTING THE APP WITH PM2 ==="
sudo npm install -g pm2
pm2 delete "$PROCESS_NAME" 2>/dev/null || true
pm2 start index.js --name "$PROCESS_NAME"

echo "=== 6. CONFIGURING VM REBOOT PERSISTENCE ==="
PM2_STARTUP_CMD=$(pm2 startup systemd | grep "sudo env PATH")
if [ ! -z "$PM2_STARTUP_CMD" ]; then
    eval $PM2_STARTUP_CMD
fi

pm2 save --force

echo "=== DEPLOYMENT COMPLETED SUCCESSFULLY FROM GITHUB! ==="