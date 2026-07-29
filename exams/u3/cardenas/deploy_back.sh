#!/bin/bash

export DEBIAN_FRONTEND=noninteractive

sudo apt-get update -y
sudo apt-get install -y curl gnupg

if ! command -v node &> /dev/null
then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null
then
    sudo npm install -g pm2
fi

SCRIPT_DIRECTORY="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CRUD_APPLICATION_PATH="${SCRIPT_DIRECTORY}/crud"
BUSINESS_LOGIC_APPLICATION_PATH="${SCRIPT_DIRECTORY}/businessLogic"

cd "${CRUD_APPLICATION_PATH}"
npm install

cd "${BUSINESS_LOGIC_APPLICATION_PATH}"
npm install

pm2 delete all 2>/dev/null || true

cd "${CRUD_APPLICATION_PATH}"
pm2 start index.js --name "crud-service"

cd "${BUSINESS_LOGIC_APPLICATION_PATH}"
pm2 start index.js --name "business-logic-service"

pm2 save
pm2 startup
