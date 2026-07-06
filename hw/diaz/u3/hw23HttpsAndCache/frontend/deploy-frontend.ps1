# =============================================================================
# deploy-frontend.ps1
# Build de Vite + deploy a S3 + invalidación de CloudFront.
#
# Variables de entorno requeridas (o pásalas como parámetros):
#   VITE_BUSINESS_LOGIC_URL  — URL del Business Logic API Gateway
#   AWS_PROFILE              — perfil AWS a usar (default: fabuladental-frontend)
#   BUCKET_NAME              — nombre del S3 bucket (default: fabuladental-frontend)
#   STACK_NAME               — nombre del stack CF (default: fabuladental-frontend)
#   REGION                   — región AWS (default: us-east-2)
#
# Uso:
#   $env:VITE_BUSINESS_LOGIC_URL="https://xxx.execute-api.us-east-2.amazonaws.com/prod"
#   .\deploy-frontend.ps1
# =============================================================================

param(
    [string]$BusinessLogicUrl = $env:VITE_BUSINESS_LOGIC_URL,
    [string]$Profile          = if ($env:AWS_PROFILE) { $env:AWS_PROFILE } else { "fabuladental-frontend" },
    [string]$BucketName       = if ($env:BUCKET_NAME) { $env:BUCKET_NAME } else { "fabuladental-frontend" },
    [string]$StackName        = if ($env:STACK_NAME) { $env:STACK_NAME } else { "fabuladental-frontend" },
    [string]$Region           = if ($env:REGION) { $env:REGION } else { "us-east-2" }
)

$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Validaciones
# ---------------------------------------------------------------------------
if (-not $BusinessLogicUrl) {
    Write-Error "ERROR: VITE_BUSINESS_LOGIC_URL es requerido."
    Write-Host  "  Ejemplo: `$env:VITE_BUSINESS_LOGIC_URL='https://xxx.execute-api.us-east-2.amazonaws.com/prod'"
    exit 1
}

if (-not ($BusinessLogicUrl -match "^https://")) {
    Write-Error "ERROR: VITE_BUSINESS_LOGIC_URL debe comenzar con https://"
    exit 1
}

Write-Host "`n=== Fábula Dental — Deploy Frontend ===" -ForegroundColor Cyan
Write-Host "  Business Logic URL : $BusinessLogicUrl"
Write-Host "  AWS Profile        : $Profile"
Write-Host "  S3 Bucket          : $BucketName"
Write-Host "  CF Stack           : $StackName"
Write-Host "  Region             : $Region"

# ---------------------------------------------------------------------------
# 1. Escribir .env.production con la URL correcta
# ---------------------------------------------------------------------------
Write-Host "`n[1/5] Generando .env.production..." -ForegroundColor Yellow
$envContent = @"
VITE_BUSINESS_LOGIC_URL=$BusinessLogicUrl
"@
$envContent | Out-File -FilePath ".env.production" -Encoding utf8 -NoNewline
Write-Host "  .env.production escrito."

# ---------------------------------------------------------------------------
# 2. Deploy del stack CloudFormation (S3 + CloudFront)
# ---------------------------------------------------------------------------
Write-Host "`n[2/5] Desplegando stack CloudFormation ($StackName)..." -ForegroundColor Yellow

$cfExists = aws cloudformation describe-stacks --stack-name $StackName --region $Region --profile $Profile 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Stack ya existe, actualizando..."
} else {
    Write-Host "  Creando stack por primera vez..."
}

aws cloudformation deploy `
    --template-file template.yaml `
    --stack-name $StackName `
    --parameter-overrides "BucketName=$BucketName" "BusinessLogicUrl=$BusinessLogicUrl" `
    --capabilities CAPABILITY_IAM `
    --region $Region `
    --profile $Profile

if ($LASTEXITCODE -ne 0) { Write-Error "ERROR: cloudformation deploy falló."; exit 1 }
Write-Host "  Stack desplegado."

# ---------------------------------------------------------------------------
# 3. Build de Vite con bun
# ---------------------------------------------------------------------------
Write-Host "`n[3/5] Construyendo el frontend con bun..." -ForegroundColor Yellow
bun run build
if ($LASTEXITCODE -ne 0) { Write-Error "ERROR: bun run build falló."; exit 1 }
Write-Host "  Build completado en ./dist/"

# ---------------------------------------------------------------------------
# 4. Sync del dist/ al S3 bucket
# ---------------------------------------------------------------------------
Write-Host "`n[4/5] Sincronizando dist/ a s3://$BucketName ..." -ForegroundColor Yellow
aws s3 sync dist/ "s3://$BucketName/" `
    --delete `
    --region $Region `
    --profile $Profile `
    --cache-control "public,max-age=31536000,immutable" `
    --exclude "*.html"

# index.html con no-cache para que siempre se sirva la última versión
aws s3 cp dist/index.html "s3://$BucketName/index.html" `
    --region $Region `
    --profile $Profile `
    --cache-control "no-cache,no-store,must-revalidate" `
    --content-type "text/html"

if ($LASTEXITCODE -ne 0) { Write-Error "ERROR: aws s3 sync falló."; exit 1 }
Write-Host "  Archivos sincronizados."

# ---------------------------------------------------------------------------
# 5. Invalidación de CloudFront
# ---------------------------------------------------------------------------
Write-Host "`n[5/5] Invalidando caché de CloudFront..." -ForegroundColor Yellow
$distId = aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --profile $Profile `
    --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" `
    --output text

if (-not $distId) {
    Write-Warning "No se pudo obtener el DistributionId. Invalida manualmente."
} else {
    aws cloudfront create-invalidation `
        --distribution-id $distId `
        --paths "/*" `
        --profile $Profile | Out-Null
    Write-Host "  Invalidación creada para distribución $distId."
}

# ---------------------------------------------------------------------------
# Resultado final
# ---------------------------------------------------------------------------
$frontendUrl = aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --profile $Profile `
    --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomain'].OutputValue" `
    --output text

Write-Host @"

=============================================================
  Deploy completado.
  Frontend disponible en: https://$frontendUrl
  (La invalidación puede tardar 1-2 minutos en propagarse)
=============================================================
"@ -ForegroundColor Green
