#!/usr/bin/env bash
# Builds the deployment zip for the Lambda function.
# Run this from the project root: bash infra/build-lambda.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$ROOT_DIR/infra/build"
ZIP_PATH="$ROOT_DIR/infra/lambda.zip"

rm -rf "$BUILD_DIR" "$ZIP_PATH"
mkdir -p "$BUILD_DIR"

cp -r "$ROOT_DIR/backend" "$BUILD_DIR/backend"
cp "$ROOT_DIR/package.json" "$BUILD_DIR/package.json"

cd "$BUILD_DIR"
npm install --omit=dev --no-audit --no-fund

cd "$BUILD_DIR"
zip -r "$ZIP_PATH" . -x "*.git*" > /dev/null

echo "Lambda package created at $ZIP_PATH"
