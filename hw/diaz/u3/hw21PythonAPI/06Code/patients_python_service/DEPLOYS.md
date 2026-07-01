# Guía de Despliegue en AWS Lambda y Acceso a Base de Datos

Este documento detalla paso a paso cómo desplegar el servicio de Pacientes de FastAPI en **AWS Lambda** y cómo asegurar la conectividad con la base de datos de Supabase.

---

## 1. Crear un Usuario IAM en AWS con Permisos

Para desplegar recursos en AWS de forma segura, se recomienda crear un usuario IAM con accesos limitados en lugar de usar la cuenta raíz.

1. Inicia sesión en la **Consola de AWS**.
2. Ve al servicio **IAM** (Identity and Access Management).
3. Haz clic en **Users** y luego en **Create user**.
4. Nombra al usuario (por ejemplo: `fabula-dental-deployer`).
5. En la sección de tipo de acceso, selecciona **Attach policies directly** y asocia los siguientes permisos necesarios para despliegues serverless (AWS SAM / CloudFormation):
   - `AWSCloudFormationFullAccess`
   - `AWSLambda_FullAccess`
   - `IAMFullAccess` (para crear roles de ejecución de Lambda)
   - `AmazonAPIGatewayAdministrator`
6. Finaliza la creación.
7. Ve a la pestaña **Security credentials** del nuevo usuario y haz clic en **Create access key** (selecciona el caso de uso *Command Line Interface (CLI)*).
8. Copia de forma segura tu **Access Key ID** y **Secret Access Key**.

---

## 2. Configurar el CLI de AWS en tu Máquina

1. Abre tu terminal de CMD o PowerShell.
2. Si no tienes instalado el CLI de AWS, descárgalo e instálalo desde [AWS CLI Official Page](https://aws.amazon.com/cli/).
3. Ejecuta el comando de configuración:
   ```cmd
   aws configure
   ```
4. Ingresa las credenciales obtenidas en el paso anterior:
   - **AWS Access Key ID**: `TU_ACCESS_KEY_ID`
   - **AWS Secret Access Key**: `TU_SECRET_ACCESS_KEY`
   - **Default region name**: `us-east-2` (o la región que prefieras)
   - **Default output format**: `json`

---

## 3. Despliegue usando AWS SAM (Serverless Application Model)

AWS SAM automatiza la creación del empaquetado de la aplicación, el rol de ejecución de la Lambda, el API Gateway, y la subida de los archivos.

1. Instala **AWS SAM CLI** desde [AWS SAM Installation Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
2. Asegúrate de estar en el directorio del servicio de Python:
   ```cmd
   cd "c:\Users\USER\Desktop\QUINTO SEMESTRE\WEB AVANZADA\AWD-30716-CodeXplorers\06Code\patients_python_service"
   ```
3. Construye la aplicación localmente (esto descarga y compila las dependencias en un contenedor temporal):
   ```cmd
   sam build
   ```
4. Despliega la aplicación ejecutando:
   ```cmd
   sam deploy --guided
   ```
5. Sigue las instrucciones interactivas en pantalla:
   - **Stack Name**: `fabula-dental-patients`
   - **AWS Region**: `us-east-2`
   - **Confirm changes before deploy**: `y`
   - **Allow SAM CLI IAM role creation**: `y` (esto creará el rol de la Lambda automáticamente)
   - **Disable rollback**: `n`
   - **PatientsApiFunction may not have authorization defined, Is this okay?**: `y`
   - **Save arguments to configuration file (samconfig.toml)**: `y`

Al finalizar el despliegue exitoso, la consola te mostrará un URL de API Gateway (`PatientsApiUrl`). Esa será la dirección pública desde la cual podrás acceder a la API (por ejemplo, `https://abcdefg.execute-api.us-east-2.amazonaws.com/Prod/docs`).

---

## 4. Acceso y Conectividad con la Base de Datos de Supabase

### ¿Por qué fallaba la conexión local?
La base de datos de Supabase utiliza el puerto estándar `5432` y `6543`. Muchas redes domésticas o proveedores de internet (ISPs) bloquean el tráfico saliente por estos puertos por razones de seguridad, lo cual causa el error de *Timeout* que vimos localmente.

### ¿Por qué sí funcionará en AWS Lambda?
Las funciones de AWS Lambda están alojadas en los centros de datos de AWS y tienen salida a internet directa sin restricciones de puertos. Por lo tanto, podrán conectarse a `aws-1-us-east-2.pooler.supabase.com:5432` sin ningún problema de firewall.

### Configuración en Producción
Las credenciales de base de datos se configuran de forma segura a través del archivo de configuración `template.yml` en la sección de Variables de Entorno de la Lambda:
```yaml
Environment:
  Variables:
    DIRECT_URL: "postgresql://postgres.hoskmelosabzuxjvbjyk:fabuladental30716@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
    DATABASE_URL: "postgresql://postgres.hoskmelosabzuxjvbjyk:fabuladental30716@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
```
No necesitas realizar configuraciones adicionales en la base de datos de Supabase, ya que por defecto permite conexiones seguras directas desde cualquier IP siempre que lleven el usuario y contraseña correctos.
