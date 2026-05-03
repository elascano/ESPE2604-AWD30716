# Jira Automation

This folder includes `create-jira-issues.ps1`, a PowerShell script that creates the 3 selected features and their 9 tasks in Jira from `jira-import.csv`.

## What We Need

- Atlassian site URL, for example:

```text
https://damalx.atlassian.net
```

- Atlassian account email.
- Atlassian API token.
- Jira project key. In the current Jira board, the existing issues are `SCRUM-1` and `SCRUM-2`, so the project key appears to be:

```text
SCRUM
```

## Create an API Token

1. Open:

```text
https://id.atlassian.com/manage-profile/security/api-tokens
```

2. Click **Create API token**.
3. Name it `American Latin Class Jira Import`.
4. Copy the generated token.

## Dry Run

```powershell
.\create-jira-issues.ps1 `
  -SiteUrl "https://damalx.atlassian.net" `
  -Email "damalx70@gmail.com" `
  -ApiToken "PASTE_API_TOKEN_HERE" `
  -ProjectKey "SCRUM" `
  -DryRun
```

## Real Import

```powershell
.\create-jira-issues.ps1 `
  -SiteUrl "https://damalx.atlassian.net" `
  -Email "damalx70@gmail.com" `
  -ApiToken "PASTE_API_TOKEN_HERE" `
  -ProjectKey "SCRUM"
```

After running the script, the Jira board should contain:

- 3 feature-level issues.
- 9 implementation tasks.

