#!/bin/bash

ZIP_NAME="hw20pythonAPI.zip"
FOLDER_NAME="hw20pythonAPI"
PROCESS_NAME="hw20pythonAPI"

echo "=== 1. PREPARING SYSTEM AND INSTALLING TOOLS ==="
sudo apt-get update
sudo apt-get install -y curl unzip python3 python3-pip python3-venv nodejs npm
sudo npm install -g pm2

echo "=== 2. UNZIPPING PROJECT ==="
if [ -f "$ZIP_NAME" ]; then
unzip -o "$ZIP_NAME"
else
echo "ERROR: File $ZIP_NAME not found"
exit 1
fi

echo "=== 3. COPYING ENVIRONMENT FILE ==="
if [ -f "../prod.env" ]; then
cp "../prod.env" "./$FOLDER_NAME/.env"
elif [ -f "./prod.env" ]; then
cp "./prod.env" "./$FOLDER_NAME/.env"
fi

echo "=== 4. CONFIGURING VIRTUAL ENVIRONMENT AND INSTALLING DEPENDENCIES ==="
cd "$FOLDER_NAME" || exit 1
python3 -m venv .venv
source .venv/bin/activate

if [ -f "requirements.txt" ]; then
pip install -r requirements.txt --break-system-packages
else
pip install fastapi uvicorn sqlmodel python-dotenv psycopg2-binary --break-system-packages
fi

echo "=== 5. STARTING APP WITH PM2 ==="
pm2 delete "$PROCESS_NAME" 2>/dev/null || true
pm2 start ".venv/bin/uvicorn" --name "$PROCESS_NAME" --interpreter none -- main:app --host 0.0.0.0 --port 3000

echo "=== 6. CONFIGURING PERSISTENCE ON REBOOT ==="
PM2_STARTUP_CMD=$(pm2 startup systemd | grep "sudo env PATH")
if [ ! -z "$PM2_STARTUP_CMD" ]; then
eval $PM2_STARTUP_CMD
fi
pm2 save --force

echo "=== FIRST DEPLOYMENT COMPLETED! ==="