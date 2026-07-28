variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Prefix used for naming every resource"
  type        = string
  default     = "shopcart"
}

variable "environment" {
  description = "Deployment environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "mongodb_uri" {
  description = "MongoDB Atlas connection string, injected as a Lambda environment variable"
  type        = string
  sensitive   = true
}

variable "lambda_zip_path" {
  description = "Path to the packaged Lambda deployment zip (built by infra/build-lambda.sh)"
  type        = string
  default     = "./lambda.zip"
}

# Names for the two IAM users this exam asks for:
# - one CI/CD / deploy user (pushes new Lambda code)
# - one read-only / operations user (can view logs and invoke for debugging)
variable "deploy_iam_user_name" {
  type    = string
  default = "shopcart-deployer"
}

variable "readonly_iam_user_name" {
  type    = string
  default = "shopcart-operator"
}
