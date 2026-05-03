param(
    [Parameter(Mandatory = $true)]
    [string] $SiteUrl,

    [Parameter(Mandatory = $true)]
    [string] $Email,

    [Parameter(Mandatory = $true)]
    [string] $ApiToken,

    [string] $ProjectKey = "SCRUM",

    [string] $CsvPath = ".\jira-import.csv",

    [switch] $DryRun
)

$ErrorActionPreference = "Stop"

function Invoke-JiraRequest {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Method,

        [Parameter(Mandatory = $true)]
        [string] $Path,

        [object] $Body = $null
    )

    $baseUrl = $SiteUrl.TrimEnd("/")
    $authBytes = [Text.Encoding]::ASCII.GetBytes("${Email}:${ApiToken}")
    $authHeader = [Convert]::ToBase64String($authBytes)
    $headers = @{
        Authorization = "Basic $authHeader"
        Accept = "application/json"
        "Content-Type" = "application/json"
    }

    $jsonBody = $null
    if ($null -ne $Body) {
        $jsonBody = $Body | ConvertTo-Json -Depth 20
    }

    Invoke-RestMethod -Method $Method -Uri "$baseUrl$Path" -Headers $headers -Body $jsonBody
}

function Find-IssueType {
    param(
        [array] $IssueTypes,
        [array] $PreferredNames
    )

    foreach ($name in $PreferredNames) {
        $match = $IssueTypes | Where-Object { $_.name -eq $name } | Select-Object -First 1
        if ($match) {
            return $match
        }
    }

    return $null
}

if (!(Test-Path -LiteralPath $CsvPath)) {
    throw "CSV file not found: $CsvPath"
}

$rows = Import-Csv -LiteralPath $CsvPath
$project = Invoke-JiraRequest -Method "GET" -Path "/rest/api/3/project/$ProjectKey"
$issueTypes = Invoke-JiraRequest -Method "GET" -Path "/rest/api/3/issuetype/project?projectId=$($project.id)"

$featureType = Find-IssueType -IssueTypes $issueTypes -PreferredNames @("Epic", "Épica", "Feature", "Historia", "Story", "Tarea", "Task")
$taskType = Find-IssueType -IssueTypes $issueTypes -PreferredNames @("Task", "Tarea", "Story", "Historia")

if (!$featureType) {
    throw "No valid feature issue type was found in project $ProjectKey."
}

if (!$taskType) {
    throw "No valid task issue type was found in project $ProjectKey."
}

$createdFeatures = @{}
$featureRows = $rows | Where-Object { $_."Issue Type" -eq "Epic" }
$taskRows = $rows | Where-Object { $_."Issue Type" -ne "Epic" }

Write-Host "Project: $($project.key) - $($project.name)"
Write-Host "Feature issue type: $($featureType.name)"
Write-Host "Task issue type: $($taskType.name)"

foreach ($row in $featureRows) {
    $payload = @{
        fields = @{
            project = @{ key = $ProjectKey }
            issuetype = @{ id = $featureType.id }
            summary = $row.Summary
            description = @{
                type = "doc"
                version = 1
                content = @(
                    @{
                        type = "paragraph"
                        content = @(
                            @{
                                type = "text"
                                text = $row.Description
                            }
                        )
                    }
                )
            }
            labels = @($row.Labels)
        }
    }

    if ($DryRun) {
        Write-Host "[DRY RUN] Would create feature: $($row.Summary)"
        $createdFeatures[$row.Summary] = "DRY-$($createdFeatures.Count + 1)"
        continue
    }

    $created = Invoke-JiraRequest -Method "POST" -Path "/rest/api/3/issue" -Body $payload
    $createdFeatures[$row.Summary] = $created.key
    Write-Host "Created feature $($created.key): $($row.Summary)"
}

foreach ($row in $taskRows) {
    $parentKey = $createdFeatures[$row.Parent]
    $description = "$($row.Description)`n`nImplemented frontend: https://creative-pothos-6c7a4c.netlify.app"

    $fields = @{
        project = @{ key = $ProjectKey }
        issuetype = @{ id = $taskType.id }
        summary = $row.Summary
        description = @{
            type = "doc"
            version = 1
            content = @(
                @{
                    type = "paragraph"
                    content = @(
                        @{
                            type = "text"
                            text = $description
                        }
                    )
                }
            )
        }
        labels = @($row.Labels)
    }

    if ($parentKey -and !$parentKey.StartsWith("DRY-")) {
        $fields.parent = @{ key = $parentKey }
    }

    $payload = @{ fields = $fields }

    if ($DryRun) {
        Write-Host "[DRY RUN] Would create task under $($parentKey): $($row.Summary)"
        continue
    }

    try {
        $created = Invoke-JiraRequest -Method "POST" -Path "/rest/api/3/issue" -Body $payload
        Write-Host "Created task $($created.key): $($row.Summary)"
    } catch {
        $fields.Remove("parent")
        $payload = @{ fields = $fields }
        $created = Invoke-JiraRequest -Method "POST" -Path "/rest/api/3/issue" -Body $payload
        Write-Host "Created task without parent $($created.key): $($row.Summary)"
    }
}

Write-Host "Done."
