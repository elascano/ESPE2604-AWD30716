output "api_url" {
  description = "Base URL of the deployed API (use as API_BASE in the frontend)"
  value       = "${aws_apigatewayv2_api.http_api.api_endpoint}/api/products"
}

output "lambda_function_name" {
  value = aws_lambda_function.api.function_name
}

output "deployer_iam_user" {
  value = aws_iam_user.deployer.name
}

output "operator_iam_user" {
  value = aws_iam_user.operator.name
}

output "frontend_url" {
  description = "Public HTTPS URL for the frontend (CloudFront)"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "frontend_bucket_name" {
  value = aws_s3_bucket.frontend.bucket
}
