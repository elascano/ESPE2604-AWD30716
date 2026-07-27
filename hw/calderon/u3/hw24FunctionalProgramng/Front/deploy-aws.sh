#!/bin/bash
# Deploy Biconoir's Restaurant a AWS S3 + CloudFront
# Uso: ./deploy-aws.sh <bucket-name> [cloudfront-distribution-id]

set -e

BUCKET_NAME=$1
CLOUDFRONT_ID=$2

if [ -z "$BUCKET_NAME" ]; then
  echo "ERROR: Debes proporcionar el nombre del bucket S3"
  echo "Uso: ./deploy-aws.sh <bucket-name> [cloudfront-distribution-id]"
  exit 1
fi

echo "=== Deploy Biconoir's Restaurant a AWS ==="

# 1. Build
echo "[1/3] Compilando frontend..."
npm run build
echo "OK - Build completado"

# 2. Sync a S3
echo "[2/3] Subiendo a S3://$BUCKET_NAME ..."
aws s3 sync dist/ "s3://$BUCKET_NAME/" --delete
echo "OK - Subida completada"

# 3. Invalidar CloudFront
if [ -n "$CLOUDFRONT_ID" ]; then
  echo "[3/3] Invalidando CloudFront..."
  aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_ID" --paths "/*"
  echo "OK - Invalidation enviada"
fi

echo "=== Deploy completado ==="
