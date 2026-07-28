resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${var.project_name}-api-${var.environment}"
  retention_in_days = 14
}

resource "aws_lambda_function" "api" {
  function_name = "${var.project_name}-api-${var.environment}"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "backend/lambda.handler"
  runtime       = "nodejs20.x"
  timeout       = 15
  memory_size   = 256

  filename         = var.lambda_zip_path
  source_code_hash = filebase64sha256(var.lambda_zip_path)

  environment {
    variables = {
      MONGODB_URI = var.mongodb_uri
      NODE_ENV    = var.environment
    }
  }

  depends_on = [aws_cloudwatch_log_group.lambda]
}
