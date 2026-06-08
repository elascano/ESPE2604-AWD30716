<#
.SYNOPSIS
    Build and push Docker images to Docker Hub
    Update image names to your Docker Hub username before running
#>

$BackendImage = "evelynvs/computerstore-api:latest"   # CHANGE THIS
$FrontendImage = "evelynvs/computerstore-ui:latest"    # CHANGE THIS

Write-Host "=== Building Backend ==="
Set-Location -Path "$PSScriptRoot\..\backend"
docker build -t $BackendImage .
docker push $BackendImage

Write-Host "=== Building Frontend ==="
Set-Location -Path "$PSScriptRoot\..\frontend"
docker build -t $FrontendImage .
docker push $FrontendImage

Set-Location -Path "$PSScriptRoot\.."
Write-Host "=== Done ==="
