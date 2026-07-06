# =============================================================================
# setup-iam.ps1
# Crea los IAM users y políticas para los tres servicios de Fábula Dental.
# Requiere: aws cli configurado con un usuario con permisos de administrador.
#
# Uso (desde la raíz del proyecto):
#   .\scripts\setup-iam.ps1
# =============================================================================

param(
    [string]$Region    = "us-east-2",
    [string]$AccountId = ""
)

$ErrorActionPreference = "Stop"

# Detectar Account ID
if (-not $AccountId) {
    $AccountId = (aws sts get-caller-identity --query Account --output text)
    Write-Host "Account ID detectado: $AccountId"
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
function Create-User {
    param([string]$Username)
    try {
        $null = aws iam get-user --user-name $Username 2>&1
        Write-Host "  Usuario '$Username' ya existe, omitiendo creacion."
    } catch {
        aws iam create-user --user-name $Username | Out-Null
        Write-Host "  Usuario '$Username' creado."
    }
}

function Attach-PolicyFromFile {
    param([string]$Username, [string]$PolicyName, [string]$PolicyFile)
    # Convertir a ruta absoluta con forward slashes para el prefijo file://
    $absPath = (Resolve-Path $PolicyFile).Path.Replace('\', '/')
    aws iam put-user-policy `
        --user-name       $Username `
        --policy-name     $PolicyName `
        --policy-document "file://$absPath"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "  ERROR adjuntando politica '$PolicyName' a '$Username'."
        exit 1
    }
    Write-Host "  Politica '$PolicyName' adjuntada a '$Username'."
}

function Create-AccessKey {
    param([string]$Username, [string]$OutFile)
    $keys = aws iam list-access-keys `
        --user-name $Username `
        --query "AccessKeyMetadata[*].AccessKeyId" `
        --output text
    if ($keys -and $keys.Trim() -ne "") {
        Write-Host "  '$Username' ya tiene access keys: $keys"
        Write-Host "  Si necesitas nuevas claves, eliminalas manualmente primero."
        return
    }
    $key = aws iam create-access-key --user-name $Username | ConvertFrom-Json
    @"
# Credenciales AWS para $Username
# GUARDA ESTE ARCHIVO EN LUGAR SEGURO — NO LO SUBAS A GIT
AWS_ACCESS_KEY_ID=$($key.AccessKey.AccessKeyId)
AWS_SECRET_ACCESS_KEY=$($key.AccessKey.SecretAccessKey)
AWS_DEFAULT_REGION=$Region
"@ | Out-File -FilePath $OutFile -Encoding utf8
    Write-Host "  Credenciales guardadas en: $OutFile"
}

# ---------------------------------------------------------------------------
# Escribir archivos de política JSON temporales
# (evita problemas de interpolación de PowerShell con here-strings)
# ---------------------------------------------------------------------------
$tmpDir = Join-Path $env:TEMP "fabuladental-iam"
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

# Política SAM (CRUD y Business Logic)
$samPolicyFile = Join-Path $tmpDir "sam-policy.json"
[System.IO.File]::WriteAllText($samPolicyFile, @'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SAMDeploy",
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:PutBucketPolicy",
        "s3:GetBucketPolicy",
        "s3:DeleteBucketPolicy",
        "s3:PutEncryptionConfiguration",
        "s3:PutBucketVersioning",
        "s3:GetEncryptionConfiguration",
        "lambda:CreateFunction",
        "lambda:UpdateFunctionCode",
        "lambda:UpdateFunctionConfiguration",
        "lambda:GetFunction",
        "lambda:DeleteFunction",
        "lambda:AddPermission",
        "lambda:RemovePermission",
        "lambda:GetPolicy",
        "lambda:ListFunctions",
        "apigateway:*",
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:GetRole",
        "iam:PassRole",
        "iam:PutRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:GetRolePolicy",
        "iam:TagRole",
        "iam:UntagRole",
        "iam:ListRolePolicies",
        "iam:ListAttachedRolePolicies"
      ],
      "Resource": "*"
    }
  ]
}
'@)

# Política Frontend (S3 + CloudFront)
$fePolicyFile = Join-Path $tmpDir "frontend-policy.json"
[System.IO.File]::WriteAllText($fePolicyFile, @'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3Frontend",
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:PutBucketPolicy",
        "s3:GetBucketPolicy",
        "s3:DeleteBucketPolicy",
        "s3:PutBucketWebsite",
        "s3:GetBucketWebsite",
        "s3:PutPublicAccessBlock",
        "s3:GetPublicAccessBlock",
        "s3:PutBucketCORS",
        "s3:GetBucketCORS"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudFront",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateDistribution",
        "cloudfront:UpdateDistribution",
        "cloudfront:GetDistribution",
        "cloudfront:DeleteDistribution",
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:CreateOriginAccessControl",
        "cloudfront:GetOriginAccessControl",
        "cloudfront:DeleteOriginAccessControl",
        "cloudfront:ListDistributions"
      ],
      "Resource": "*"
    }
  ]
}
'@)

Write-Host "Archivos de politica escritos en: $tmpDir"

# ---------------------------------------------------------------------------
# 1. fabuladental-crud-deployer
# ---------------------------------------------------------------------------
Write-Host "`n[1/3] Configurando usuario para CRUD..."
$crudUser = "fabuladental-crud-deployer"
Create-User              -Username $crudUser
Attach-PolicyFromFile    -Username $crudUser -PolicyName "FabulaDentalCrudDeploy"     -PolicyFile $samPolicyFile
Create-AccessKey         -Username $crudUser -OutFile ".\scripts\credentials-crud.env"

# ---------------------------------------------------------------------------
# 2. fabuladental-business-deployer
# ---------------------------------------------------------------------------
Write-Host "`n[2/3] Configurando usuario para Business Logic..."
$bizUser = "fabuladental-business-deployer"
Create-User              -Username $bizUser
Attach-PolicyFromFile    -Username $bizUser -PolicyName "FabulaDentalBusinessDeploy"  -PolicyFile $samPolicyFile
Create-AccessKey         -Username $bizUser -OutFile ".\scripts\credentials-business.env"

# ---------------------------------------------------------------------------
# 3. fabuladental-frontend-deployer
# ---------------------------------------------------------------------------
Write-Host "`n[3/3] Configurando usuario para Frontend..."
$feUser = "fabuladental-frontend-deployer"
Create-User              -Username $feUser
Attach-PolicyFromFile    -Username $feUser  -PolicyName "FabulaDentalFrontendDeploy"  -PolicyFile $fePolicyFile
Create-AccessKey         -Username $feUser  -OutFile ".\scripts\credentials-frontend.env"

# Limpiar temporales
Remove-Item -Recurse -Force $tmpDir

# ---------------------------------------------------------------------------
Write-Host @"

=============================================================
  IAM setup completado.

  Archivos de credenciales en .\scripts\:
    credentials-crud.env
    credentials-business.env
    credentials-frontend.env

  IMPORTANTE: no subas estos archivos a git.

  Proximo paso — configura los tres perfiles AWS.
  Para cada uno, abre el archivo .env correspondiente,
  copia los valores y ejecuta:

    aws configure --profile fabuladental-crud
    aws configure --profile fabuladental-business
    aws configure --profile fabuladental-frontend

  Region: us-east-2   |   Output format: json
=============================================================
"@
