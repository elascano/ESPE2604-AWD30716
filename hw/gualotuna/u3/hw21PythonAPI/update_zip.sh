#!/bin/bash

FOLDER_NAME="hw20pythonAPI"
PROCESS_NAME="hw20pythonAPI"

echo "=== 1. UPDATING ENVIRONMENT FILE ==="
if [ -f "prod.env" ]; then
    cp "prod.env" "./$FOLDER_NAME/.env"
elif [ -f "../prod.env" ]; then
    cp "../prod.env" "./$FOLDER_NAME/.env"
fi

echo "=== 2. RELOADING PROCESS IN PM2 ==="
if pm2 describe "$PROCESS_NAME" 2>/dev/null | grep -q "online"; then
    echo "The process is online. Applying fast reload..."
    pm2 reload "$PROCESS_NAME"
else
    echo "The process is not active or has a corrupt configuration."
    echo "Forcing clean recreation of the Python process..."
    
    pm2 delete "$PROCESS_NAME" 2>/dev/null || true
    
    cd "$FOLDER_NAME" || exit 1
    pm2 start ".venv/bin/uvicorn" --name "$PROCESS_NAME" --interpreter none -- main:app --host 0.0.0.0 --port 3000
    pm2 save --force
fi

echo "=== UPDATE COMPLETED SUCCESSFULLY! ==="