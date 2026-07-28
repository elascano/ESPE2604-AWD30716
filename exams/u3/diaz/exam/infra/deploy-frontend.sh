#!/usr/bin/env bash
# Uploads frontend/ to the S3 bucket created by Terraform and invalidates CloudFront.
# Usage: bash infra/deploy-frontend.sh <bucket-name> <cloudfront-distribution-id>
set -euo pipefail

BUCKET="${1:?Usage: deploy-frontend.sh <bucket-name> <cloudfront-distribution-id>}"
DIST_ID="${2:?Usage: deploy-frontend.sh <bucket-name> <cloudfront-distribution-id>}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

aws s3 sync "$ROOT_DIR/frontend" "s3://$BUCKET" --delete

aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*"

echo "Frontend deployed to bucket $BUCKET"
