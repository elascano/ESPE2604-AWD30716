<#
.SYNOPSIS
    Deploy Computer Store to Azure — 2 VMs
    Backend API on port 3017, Frontend UI on port 8017
#>

param(
    [string]$ResourceGroup = "computerstore-rg-17",
    [string]$Location = "westus",
    [string]$AdminUser = "azureuser",
    [string]$AdminPass = "AzureVMs2024!",
    [string]$BackendImage = "evelynvs/computerstore-api:latest",
    [string]$FrontendImage = "evelynvs/computerstore-ui:latest",
    [string]$VmSize = "Standard_D2s_v3"
)

$BackendVm = "vm-computerstore-api-17"
$FrontendVm = "vm-computerstore-ui-17"

Write-Host "=== Step 1: Login ==="
az login --use-device-code

Write-Host "=== Step 2: Create Resource Group ==="
az group create --name $ResourceGroup --location $Location

Write-Host "=== Step 3: Create Backend VM (API, port 3017) ==="
az vm create `
    --resource-group $ResourceGroup `
    --name $BackendVm `
    --image Ubuntu2204 `
    --admin-username $AdminUser `
    --admin-password $AdminPass `
    --public-ip-sku Standard `
    --nsg-rule SSH `
    --size $VmSize

az vm open-port --resource-group $ResourceGroup --name $BackendVm --port 3017 --priority 1010

$BackendIp = az vm show --resource-group $ResourceGroup --name $BackendVm --show-details --query "publicIps" -o tsv
Write-Host "Backend VM IP: $BackendIp"

Write-Host "=== Step 4: Install Docker and run Backend container ==="
az vm run-command invoke `
    --resource-group $ResourceGroup `
    --name $BackendVm `
    --command-id RunShellScript `
    --scripts @"
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
sudo docker run -d --restart unless-stopped -p 3017:3017 --name computerstore-api \
    -e PORT=3017 \
    -e MONGODB_URI="mongodb+srv://oop:oop@cluster0.9knxc.mongodb.net/oop?appName=Cluster0" \
    $BackendImage
echo "Backend container started on port 3017"
"@

Write-Host "=== Step 5: Create Frontend VM (UI, port 8017) ==="
az vm create `
    --resource-group $ResourceGroup `
    --name $FrontendVm `
    --image Ubuntu2204 `
    --admin-username $AdminUser `
    --admin-password $AdminPass `
    --public-ip-sku Standard `
    --nsg-rule SSH `
    --size $VmSize

az vm open-port --resource-group $ResourceGroup --name $FrontendVm --port 8017 --priority 1010

$FrontendIp = az vm show --resource-group $ResourceGroup --name $FrontendVm --show-details --query "publicIps" -o tsv
Write-Host "Frontend VM IP: $FrontendIp"

Write-Host "=== Step 6: Install Docker and run Frontend container ==="
az vm run-command invoke `
    --resource-group $ResourceGroup `
    --name $FrontendVm `
    --command-id RunShellScript `
    --scripts @"
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
sudo docker run -d --restart unless-stopped -p 8017:8017 --name computerstore-frontend \
    -e PORT=8017 \
    -e API_TARGET="http://$BackendIp:3017" \
    $FrontendImage
echo "Frontend container started on port 8017"
"@

Write-Host ""
Write-Host "=========================================="
Write-Host "           DEPLOYMENT COMPLETE"
Write-Host "=========================================="
Write-Host "Backend API:  http://$BackendIp:3017/computerstore/customers"
Write-Host "Frontend UI:  http://$FrontendIp:8017"
Write-Host ""
Write-Host "SSH Backend:  ssh $AdminUser@$BackendIp"
Write-Host "SSH Frontend: ssh $AdminUser@$FrontendIp"
Write-Host "=========================================="
