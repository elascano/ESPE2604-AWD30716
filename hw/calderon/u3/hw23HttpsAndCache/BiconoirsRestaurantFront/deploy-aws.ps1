param(
    [Parameter(Mandatory=$true)]
    [string]$BucketName,
    
    [Parameter(Mandatory=$false)]
    [string]$CloudFrontDistributionId,
    
    [Parameter(Mandatory=$false)]
    [string]$ProfileName = "default"
)

# Requisitos: AWS CLI instalado y configurado (aws configure)
Write-Host "=== Deploy Biconoir's Restaurant a AWS S3 + CloudFront ===" -ForegroundColor Cyan

# 1. Build de produccion
Write-Host "`n[1/3] Compilando frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Fallo el build" -ForegroundColor Red
    exit 1
}
Write-Host "OK - Build completado en dist/" -ForegroundColor Green

# 2. Subir a S3
Write-Host "`n[2/3] Subiendo a S3 (bucket: $BucketName)..." -ForegroundColor Yellow
aws s3 sync dist/ "s3://$BucketName/" --delete --profile $ProfileName
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Fallo la subida a S3" -ForegroundColor Red
    exit 1
}
Write-Host "OK - Archivos subidos a s3://$BucketName/" -ForegroundColor Green

# 3. Invalidar CloudFront (si se proporciono ID)
if ($CloudFrontDistributionId) {
    Write-Host "`n[3/3] Invalidando cache de CloudFront..." -ForegroundColor Yellow
    aws cloudfront create-invalidation `
        --distribution-id $CloudFrontDistributionId `
        --paths "/*" `
        --profile $ProfileName
    Write-Host "OK - Invalidation enviada" -ForegroundColor Green
}

Write-Host "`n=== Deploy completado ===" -ForegroundColor Cyan
