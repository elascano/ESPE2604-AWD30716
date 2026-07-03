# AWS deployment with IAM user, Lambda and API Gateway using Bun

## 1) Create IAM user for deployment

Create an IAM user with Programmatic access and attach permissions required by Serverless Framework deployment.

Minimum practical option for class/lab environments:
- AWSCloudFormationFullAccess
- AWSLambda_FullAccess
- AmazonAPIGatewayAdministrator
- IAMFullAccess
- CloudWatchLogsFullAccess

After creating the user, save:
- Access key ID
- Secret access key

## 2) Configure local credentials

Run:
- aws configure

Use:
- AWS Access Key ID: your IAM access key
- AWS Secret Access Key: your IAM secret
- Default region: us-east-1
- Default output format: json

## 3) Install dependencies with Bun

Run:
- bun install

## 4) Deploy with Bun

Run:
- bun run deploy

## 5) Get API endpoint

Run:
- bun run info

Look for the HTTP API endpoint and use:
- GET /universities
- GET /universities?country=Ecuador
- GET /universities?country=Canada

## 6) Remove resources

Run:
- bun run remove
