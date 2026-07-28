# Deploying ShopCart to AWS (Lambda + API Gateway + IAM)

This project deploys as **serverless**: one Lambda function running the whole
Express API, exposed through an HTTP API Gateway, with two IAM users for
access control, and MongoDB Atlas as the database cluster.

You need your own AWS account and AWS CLI/Terraform installed locally — none
of this can be applied from here, since I don't have access to your AWS
credentials.

## 0. Prerequisites

- Node.js 20+
- Terraform >= 1.5
- AWS CLI configured with an account that can create IAM/Lambda/API Gateway resources
- A MongoDB Atlas account (free/shared tier is enough for this exam)

## 1. Create the MongoDB cluster (Atlas)

1. Create a free cluster at https://cloud.mongodb.com.
2. Create a database user with a strong password.
3. Under **Network Access**, allow `0.0.0.0/0` (fine for an exam/demo — for
   production, restrict to a NAT Gateway IP or use AWS PrivateLink).
4. Copy the connection string, it looks like:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/shopcart?retryWrites=true&w=majority`

## 2. Install dependencies

```bash
cd exam
npm install
```

## 3. Package the Lambda

```bash
npm run package:lambda
# produces infra/lambda.zip
```

## 4. Deploy the infrastructure

```bash
cd infra/terraform
terraform init

terraform apply \
  -var="mongodb_uri=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/shopcart" \
  -var="aws_region=us-east-1"
```

Terraform creates:

| Resource | Purpose |
|---|---|
| `aws_lambda_function.api` | Runs the Express app (`backend/lambda.js`) |
| `aws_apigatewayv2_api.http_api` | Public HTTPS endpoint, proxies everything to Lambda |
| `aws_iam_role.lambda_exec` | Execution role the function assumes at runtime |
| `aws_iam_user.deployer` | Can push new code to the Lambda (CI/CD) |
| `aws_iam_user.operator` | Read-only: logs + API Gateway, for troubleshooting |
| `aws_cloudwatch_log_group.lambda` | Lambda logs, 14-day retention |
| `aws_s3_bucket.frontend` | Private bucket holding the static frontend files |
| `aws_cloudfront_distribution.frontend` | Public HTTPS URL in front of the S3 bucket |

When it finishes, copy the `api_url` and `frontend_url` outputs.

## 5. Give the IAM users credentials

Terraform intentionally does **not** generate access keys (leaking them into
state is bad practice). Create them from the console or CLI instead:

```bash
aws iam create-access-key --user-name shopcart-deployer
aws iam create-access-key --user-name shopcart-operator
```

Store the output somewhere safe (e.g. a secrets manager) — it's shown only once.

## 6. Point the frontend at the deployed API

In `frontend/index.html`, before the `app.js` script tag, add:

```html
<script>
  window.SHOPCART_API_BASE = "https://<api_url from terraform output>";
</script>
```

## 7. Deploy the frontend (S3 + CloudFront)

Terraform already created a private S3 bucket and a CloudFront distribution
in front of it (see `frontend.tf`). Upload the static files and invalidate
the cache with:

```bash
cd exam
bash infra/deploy-frontend.sh <frontend_bucket_name> <cloudfront_distribution_id>
```

Both values come from `terraform output` (`frontend_bucket_name`, and the
distribution id via `terraform state show aws_cloudfront_distribution.frontend`
or the AWS console). Then open the `frontend_url` output — that's your live
site.

## 8. Local development (unchanged)

```bash
cp backend/.env.example backend/.env
# fill in MONGODB_URI in .env
npm run dev
# frontend: open frontend/index.html with Live Server, still points at
# http://localhost:3006 by default
```

## Tearing down

```bash
cd infra/terraform
terraform destroy
```

Para correrlo en local necesitas el backend (Node + MongoDB) y luego abrir el frontend. Pasos:

1. Backend
bash
cd exam
npm install

Copia el archivo de ejemplo de variables de entorno:

bash
cp backend/.env.example backend/.env

Edita backend/.env y pon tu cadena de conexión de MongoDB:

MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/shopcart?retryWrites=true&w=majority
PORT=3006

¿No tienes un cluster de MongoDB todavía? Opciones rápidas:

MongoDB Atlas (gratis, en la nube): crea una cuenta en https://cloud.mongodb.com, un cluster free tier, un usuario de base de datos, habilita acceso desde 0.0.0.0/0 (para dev), y copia el connection string.
MongoDB local con Docker (si no quieres depender de internet):
bash
  docker run -d --name mongo-local -p 27017:27017 mongo:7

y en .env pon MONGODB_URI=mongodb://localhost:27017/shopcart

Arranca el servidor:

bash
npm run dev

Deberías ver:

MongoDB connected
Server running on port 3006
2. Frontend

El frontend es HTML/CSS/JS puro, no necesita build. Dos formas de abrirlo:

VS Code + Live Server: clic derecho en frontend/index.html → "Open with Live Server" (se abre en http://localhost:5500)
Sin extensiones, con un server estático simple:
bash
  cd frontend
  npx serve .

Por defecto frontend/js/app.js apunta a http://localhost:3006/api/products, así que no necesitas configurar nada más mientras el backend corra en el puerto 3006.

3. Probar

Abre el frontend en el navegador, llena algunos productos en la pestaña "Product Catalog", dale a Save products, y luego revisa las pestañas "VAT Calculator" y "Expiration Tracker" — ambas hacen fetch al backend real.

Si algo falla (CORS, conexión rechazada, etc.), pásame el error exacto de la consola del navegador o de la terminal y lo resolvemos.