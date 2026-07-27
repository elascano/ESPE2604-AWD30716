#!/bin/bash
# Setup Biconoir's Restaurant en EC2 (Ubuntu 22.04+)
# USO (estando dentro del repo clonado en la EC2):
#   chmod +x deploy/setup-ec2.sh
#   sudo ./deploy/setup-ec2.sh [tudominio.com]

set -e

DOMAIN="${1:-tudominio.com}"
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Instalando dependencias del sistema ==="
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx nodejs npm

echo "=== Instalando dependencias del proyecto ==="
cd "$APP_DIR"
npm install

echo "=== Compilando frontend ==="
npm run build:prod

echo "=== Configurando Nginx ==="
sudo mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
sudo cp deploy/nginx.conf /etc/nginx/sites-available/biconoirs
sudo sed -i "s/tudominio.com/$DOMAIN/g" /etc/nginx/sites-available/biconoirs
sudo sed -i "s|/var/www/biconoirs/dist|$APP_DIR/dist|g" /etc/nginx/sites-available/biconoirs
sudo ln -sf /etc/nginx/sites-available/biconoirs /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo "=== SSL con Let's Encrypt ==="
sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m admin@"$DOMAIN"

echo ""
echo "=== LISTO ==="
echo "Frontend: https://$DOMAIN"
echo "API proxy: https://$DOMAIN/ops/"
echo ""
echo "Si tu API corre en otro puerto, edita el proxy_pass en deploy/nginx.conf"
