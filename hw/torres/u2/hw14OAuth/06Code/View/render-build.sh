#!/usr/bin/env sh
set -eu

api_base_url="${API_BASE_URL:-https://projectwebalcpractice-api.onrender.com}"
google_client_id="${GOOGLE_CLIENT_ID:-}"

escape_js() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

cat > 06Code/View/script/config.js <<EOF
window.API_BASE_URL = "$(escape_js "$api_base_url")";
window.GOOGLE_CLIENT_ID = "$(escape_js "$google_client_id")";
EOF
