### ---------------------------------------------------------------------
### Lambda execution role (used BY the function itself at runtime)
### ---------------------------------------------------------------------

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda_exec" {
  name               = "${var.project_name}-lambda-exec-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "lambda_basic_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

### ---------------------------------------------------------------------
### IAM Users (human/CI access, as requested for the exam)
### ---------------------------------------------------------------------

# 1) Deploy user: can update the Lambda function code/config and read logs.
resource "aws_iam_user" "deployer" {
  name = var.deploy_iam_user_name
  path = "/shopcart/"
  tags = {
    Project = var.project_name
    Role    = "deployer"
  }
}

data "aws_iam_policy_document" "deployer_policy" {
  statement {
    sid = "UpdateLambda"
    actions = [
      "lambda:UpdateFunctionCode",
      "lambda:UpdateFunctionConfiguration",
      "lambda:GetFunction",
      "lambda:PublishVersion",
    ]
    resources = [aws_lambda_function.api.arn]
  }

  statement {
    sid = "ReadLogs"
    actions = [
      "logs:GetLogEvents",
      "logs:FilterLogEvents",
      "logs:DescribeLogStreams",
    ]
    resources = ["${aws_cloudwatch_log_group.lambda.arn}:*"]
  }
}

resource "aws_iam_policy" "deployer_policy" {
  name   = "${var.project_name}-deployer-policy-${var.environment}"
  policy = data.aws_iam_policy_document.deployer_policy.json
}

resource "aws_iam_user_policy_attachment" "deployer_attach" {
  user       = aws_iam_user.deployer.name
  policy_arn = aws_iam_policy.deployer_policy.arn
}

# 2) Operator user: read-only access to logs and API Gateway for troubleshooting.
resource "aws_iam_user" "operator" {
  name = var.readonly_iam_user_name
  path = "/shopcart/"
  tags = {
    Project = var.project_name
    Role    = "operator"
  }
}

data "aws_iam_policy_document" "operator_policy" {
  statement {
    sid = "ReadOnlyObservability"
    actions = [
      "lambda:GetFunction",
      "lambda:GetFunctionConfiguration",
      "logs:GetLogEvents",
      "logs:FilterLogEvents",
      "logs:DescribeLogStreams",
      "apigateway:GET",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "operator_policy" {
  name   = "${var.project_name}-operator-policy-${var.environment}"
  policy = data.aws_iam_policy_document.operator_policy.json
}

resource "aws_iam_user_policy_attachment" "operator_attach" {
  user       = aws_iam_user.operator.name
  policy_arn = aws_iam_policy.operator_policy.arn
}
