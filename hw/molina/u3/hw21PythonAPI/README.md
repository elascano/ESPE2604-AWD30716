# 🚀 Simulador de Arquitectura Desacoplada (2 Servidores)

Este proyecto simula de forma local el comportamiento descentralizado de tus dos APIs en Python (**Reglas de Negocio** y **CRUD de Base de Datos**) para la **Regla de Negocio 3**: **Generación de códigos de invitación para barberos con validación de rol de propietario (Owner)**.

---

## 🏗️ Estructura del Proyecto

1. **[serverCrud/main.py](file:///C:/Users/andre/Desktop/ESPE/SEMESTRE%205/WEB%20AVANZADO/U3/APIPython/serverCrud/main.py)**: Servidor que expone la API CRUD en el puerto **3000**. Administra una base de datos ficticia en memoria RAM para miembros e invitaciones.
2. **[serverBusinessRules/main.py](file:///C:/Users/andre/Desktop/ESPE/SEMESTRE%205/WEB%20AVANZADO/U3/APIPython/serverBusinessRules/main.py)**: Servidor que expone la API de negocio en el puerto **8000**. Verifica la autorización consultando a la API CRUD y realiza la creación de invitaciones delegando la persistencia a la API CRUD.

---

## 🛠️ Instalación y Configuración

1. **Instalar Dependencias**:
   Abre una terminal e instala las dependencias de Python (FastAPI, Uvicorn, HTTPX):
   ```bash
   pip install -r requirements.txt
   ```

2. **Levantar los Servidores**:
   Debes abrir **dos terminales independientes** para correr los dos servidores a la vez:

   * **Terminal 1 (Servidor CRUD)**:
     ```bash
     cd "C:\Users\andre\Desktop\ESPE\SEMESTRE 5\WEB AVANZADO\U3\APIPython\serverCrud"
     python main.py
     ```
     *Estará escuchando en:* http://localhost:3000

   * **Terminal 2 (Servidor Reglas de Negocio)**:
     ```bash
     cd "C:\Users\andre\Desktop\ESPE\SEMESTRE 5\WEB AVANZADO\U3\APIPython\serverBusinessRules"
     python main.py
     ```
     *Estará escuchando en:* http://localhost:8000

---

## 🧪 Pruebas de Flujo Completo (Comandos cURL)

Las peticiones se realizan al **Servidor de Reglas de Negocio (Puerto 8000)** enviando la cabecera `X-User-Id` para simular la sesión. El servidor de reglas de negocio llamará internamente al **Servidor CRUD (Puerto 3000)** para validar roles y guardar datos.

### 👥 Credenciales de Prueba
- `usr_owner_1` - Rol: **owner** (Propietario de la barbería `shop_101`) -> **Acceso Permitido**.
- `usr_barber_1` - Rol: **barber** (Barbero común en `shop_101`) -> **Acceso Denegado**.
- `usr_customer_1` - Rol: **customer** (Cliente común) -> **Acceso Denegado**.

---

### 1. Intentar Generar Código como Barbero Común (Acceso Denegado - HTTP 403)
```bash
curl -X POST "http://localhost:8000/barbershops/shop_101/invitations" \
     -H "Content-Type: application/json" \
     -H "X-User-Id: usr_barber_1" \
     -d "{\"days_valid\": 5}"
```

**Respuesta Esperada:**
```json
{
  "detail": "Acceso Denegado: Solo el Propietario (Owner) activo de la barbería puede realizar esta acción."
}
```

---

### 2. Generar Código Exitosamente como Dueño de la Barbería (HTTP 201)
El servidor de negocio valida que eres `owner`, genera un código como `SH-283-ZYA` y llama a la API CRUD en el puerto 3000 para guardarlo:

```bash
curl -X POST "http://localhost:8000/barbershops/shop_101/invitations" \
     -H "Content-Type: application/json" \
     -H "X-User-Id: usr_owner_1" \
     -d "{\"days_valid\": 7}"
```

**Respuesta Esperada:**
```json
{
  "id": "inv_a8b9c1d2",
  "barbershop_id": "shop_101",
  "code": "SH-192-AJZ",
  "expires_at": "2026-07-06T20:25:00.000000",
  "is_active": true
}
```

---

### 3. Listar Códigos Activos como Dueño de la Barbería (HTTP 200)
El servidor de negocio valida tu rol y obtiene los códigos persistidos en el servidor CRUD:

```bash
curl -X GET "http://localhost:8000/barbershops/shop_101/invitations" \
     -H "X-User-Id: usr_owner_1"
```
