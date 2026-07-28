#!/bin/bash

ZIP_NAME="hw20pythonAPI.zip"
FOLDER_NAME="hw20pythonAPI"
PROCESS_NAME="hw20pythonAPI"

echo "=== 1. VERIFYING AND UNZIPPING NEW FILES ==="
if [ -f "$ZIP_NAME" ]; then
unzip -o "$ZIP_NAME"
else
echo "ERROR: File $ZIP_NAME not found."
exit 1
fi

echo "=== 2. COPYING ENVIRONMENT FILE ==="
if [ -f "../prod.env" ]; then
cp "../prod.env" "./$FOLDER_NAME/.env"
elif [ -f "./prod.env" ]; then
cp "./prod.env" "./$FOLDER_NAME/.env"
fi

echo "=== 3. UPDATING DEPENDENCIES ==="
cd "$FOLDER_NAME" || exit 1

if [ ! -d ".venv" ]; then
python3 -m venv .venv
fi

source .venv/bin/activate

if [ -f "requirements.txt" ]; then
pip install -r requirements.txt --break-system-packages
else
pip install fastapi uvicorn sqlmodel python-dotenv psycopg2-binary --break-system-packages
fi

echo "=== 4. RESTARTING IN PM2 ==="
if pm2 describe "$PROCESS_NAME" > /dev/null 2>&1; then
pm2 reload "$PROCESS_NAME"
else
pm2 start ".venv/bin/uvicorn" --name "$PROCESS_NAME" --interpreter none -- main:app --host 0.0.0.0 --port 3000
pm2 save --force
fi

echo "=== DEPLOYMENT COMPLETED! ==="