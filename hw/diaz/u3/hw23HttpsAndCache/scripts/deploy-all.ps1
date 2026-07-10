# =============================================================================
# deploy-all.ps1
# Orquesta el deploy completo de Fábula Dental en orden:
#   1. CRUD           (Lambda + API Gateway)
#   2. Business Logic (Lambda + API Gateway)
#   3. Frontend       (S3 + CloudFront)
#
# Prerrequisitos:
#   - aws cli instalado y configurado con los tres perfiles:
#       fabuladental-crud, fabuladental-business, fabuladental-frontend
#     (ejecuta .\scripts\setup-iam.ps1 primero si aún no están creados)
#   - sam cli instalado   (https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
#   - bun instalado       (https://bun.sh)
#   - Variables de entorno definidas (ver sección CONFIGURACIÓN abajo)
#
# Uso rápido:
#   .\scripts\deploy-all.ps1
#
# Para desplegar sólo un servicio:
#   .\scripts\deploy-all.ps1 -Only crud
#   .\scripts\deploy-all.ps1 -Only business
#   .\scripts\deploy-all.ps1 -Only frontend
# =============================================================================

param(
    [ValidateSet("all", "crud", "business", "frontend")]
    [string]$Only = "all"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot   # directorio raíz del proyecto

# =============================================================================
# CONFIGURACIÓN — edita estos valores o expórtalos como variables de entorno
# antes de ejecutar el script.
# =============================================================================

# --- CRUD ---
$CRUD_DATABASE_URL = if ($env:DATABASE_URL)  { $env:DATABASE_URL }  else { "" }
$CRUD_API_KEY      = if ($env:CRUD_API_KEY)  { $env:CRUD_API_KEY }  else { "" }

# --- Business Logic ---
# CRUD_API_URL se obtiene automáticamente del output del stack CRUD.
# Puedes sobreescribirlo si ya tienes la URL:
$CRUD_API_URL_OVERRIDE = if ($env:CRUD_API_URL) { $env:CRUD_API_URL } else { "" }
$JWT_SECRET            = if ($env:JWT_SECRET)   { $env:JWT_SECRET }   else { "" }

# --- Frontend ---
# BUSINESS_API_URL se obtiene automáticamente del output del stack Business Logic.
$BUSINESS_API_URL_OVERRIDE = if ($env:VITE_BUSINESS_LOGIC_URL) { $env:VITE_BUSINESS_LOGIC_URL } else { "" }

# Región y nombres de stacks (deben coincidir con los samconfig.toml)
$Region        = "us-east-2"
$CrudStack     = "fabuladental-crud"
$BusinessStack = "fabuladental-business"
$FrontendStack = "fabuladental-frontend"

# =============================================================================

function Assert-NotEmpty {
    param([string]$Value, [string]$VarName)
    if (-not $Value) {
        Write-Error "ERROR: La variable '$VarName' está vacía. Defínela antes de ejecutar el script."
        exit 1
    }
}

function Get-StackOutput {
    param([string]$StackName, [string]$OutputKey, [string]$Profile)
    $value = aws cloudformation describe-stacks `
        --stack-name $StackName `
        --region $Region `
        --profile $Profile `
        --query "Stacks[0].Outputs[?OutputKey=='$OutputKey'].OutputValue" `
        --output text 2>$null
    return $value
}

function Write-Step {
    param([string]$Msg)
    Write-Host "`n$Msg" -ForegroundColor Cyan
    Write-Host ("─" * 60) -ForegroundColor DarkGray
}

# =============================================================================
# PASO 1 — CRUD
# =============================================================================
if ($Only -eq "all" -or $Only -eq "crud") {
    Write-Step "[1/3] Desplegando CRUD Service..."

    Assert-NotEmpty $CRUD_DATABASE_URL "DATABASE_URL"
    Assert-NotEmpty $CRUD_API_KEY      "CRUD_API_KEY"

    Push-Location "$Root\crud"
    try {
        Write-Host "  → bun install"
        bun install --frozen-lockfile
        if ($LASTEXITCODE -ne 0) { throw "bun install falló" }

        Write-Host "  → tsc build"
        bun run build
        if ($LASTEXITCODE -ne 0) { throw "tsc build falló" }

        Write-Host "  → sam build"
        sam build --profile fabuladental-crud
        if ($LASTEXITCODE -ne 0) { throw "sam build falló" }

        Write-Host "  → sam deploy"
        sam deploy `
            --profile fabuladental-crud `
            --parameter-overrides `
                "DatabaseUrl=$CRUD_DATABASE_URL" `
                "CrudApiKey=$CRUD_API_KEY"
        if ($LASTEXITCODE -ne 0) { throw "sam deploy falló" }
    } finally {
        Pop-Location
    }

    $script:CrudApiUrl = Get-StackOutput -StackName $CrudStack -OutputKey "CrudApiUrl" -Profile "fabuladental-crud"
    Write-Host "`n  CRUD API URL: $($script:CrudApiUrl)" -ForegroundColor Green
}

# =============================================================================
# PASO 2 — Business Logic
# =============================================================================
if ($Only -eq "all" -or $Only -eq "business") {
    Write-Step "[2/3] Desplegando Business Logic Service..."

    # Determinar la URL del CRUD
    $crudUrl = if ($CRUD_API_URL_OVERRIDE) {
        $CRUD_API_URL_OVERRIDE
    } elseif ($script:CrudApiUrl) {
        $script:CrudApiUrl
    } else {
        Get-StackOutput -StackName $CrudStack -OutputKey "CrudApiUrl" -Profile "fabuladental-crud"
    }

    Assert-NotEmpty $crudUrl    "CRUD_API_URL (output del stack CRUD o variable de entorno)"
    Assert-NotEmpty $CRUD_API_KEY "CRUD_API_KEY"
    Assert-NotEmpty $JWT_SECRET   "JWT_SECRET"

    Push-Location "$Root\business-logic"
    try {
        Write-Host "  → bun install"
        bun install --frozen-lockfile
        if ($LASTEXITCODE -ne 0) { throw "bun install falló" }

        Write-Host "  → tsc build"
        bun run build
        if ($LASTEXITCODE -ne 0) { throw "tsc build falló" }

        Write-Host "  → sam build"
        sam build --profile fabuladental-business
        if ($LASTEXITCODE -ne 0) { throw "sam build falló" }

        Write-Host "  → sam deploy"
        sam deploy `
            --profile fabuladental-business `
            --parameter-overrides `
                "CrudApiUrl=$crudUrl" `
                "CrudApiKey=$CRUD_API_KEY" `
                "JwtSecret=$JWT_SECRET"
        if ($LASTEXITCODE -ne 0) { throw "sam deploy falló" }
    } finally {
        Pop-Location
    }

    $script:BusinessApiUrl = Get-StackOutput -StackName $BusinessStack -OutputKey "BusinessApiUrl" -Profile "fabuladental-business"
    Write-Host "`n  Business Logic API URL: $($script:BusinessApiUrl)" -ForegroundColor Green
}

# =============================================================================
# PASO 3 — Frontend
# =============================================================================
if ($Only -eq "all" -or $Only -eq "frontend") {
    Write-Step "[3/3] Desplegando Frontend..."

    # Determinar la URL del Business Logic
    $businessUrl = if ($BUSINESS_API_URL_OVERRIDE) {
        $BUSINESS_API_URL_OVERRIDE
    } elseif ($script:BusinessApiUrl) {
        $script:BusinessApiUrl
    } else {
        Get-StackOutput -StackName $BusinessStack -OutputKey "BusinessApiUrl" -Profile "fabuladental-business"
    }

    Assert-NotEmpty $businessUrl "VITE_BUSINESS_LOGIC_URL (output del stack Business Logic o variable de entorno)"

    Push-Location "$Root\frontend"
    try {
        $env:VITE_BUSINESS_LOGIC_URL = $businessUrl

        Write-Host "  → bun install"
        bun install --frozen-lockfile
        if ($LASTEXITCODE -ne 0) { throw "bun install falló" }

        powershell -ExecutionPolicy Bypass -File deploy-frontend.ps1 `
            -BusinessLogicUrl $businessUrl `
            -Profile "fabuladental-frontend" `
            -BucketName "fabuladental-frontend" `
            -StackName $FrontendStack `
            -Region $Region
        if ($LASTEXITCODE -ne 0) { throw "deploy-frontend.ps1 falló" }
    } finally {
        Pop-Location
    }

    $frontendDomain = Get-StackOutput -StackName $FrontendStack -OutputKey "CloudFrontDomain" -Profile "fabuladental-frontend"
    Write-Host "`n  Frontend URL: https://$frontendDomain" -ForegroundColor Green
}

# =============================================================================
# Resumen final
# =============================================================================
Write-Host @"

=============================================================
  Deploy completo de Fábula Dental finalizado.

  Servicios desplegados:
    CRUD API    : $(if ($script:CrudApiUrl) { $script:CrudApiUrl } else { "(no desplegado en esta ejecución)" })
    Business API: $(if ($script:BusinessApiUrl) { $script:BusinessApiUrl } else { "(no desplegado en esta ejecución)" })
    Frontend    : $(if ($frontendDomain) { "https://$frontendDomain" } else { "(no desplegado en esta ejecución)" })

  Recuerda actualizar el .env de desarrollo local si cambiaron las URLs.
=============================================================
"@ -ForegroundColor Green
