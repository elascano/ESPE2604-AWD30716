# AGENT.md

## 🧠 Contexto del Proyecto

Aplicación web tipo plataforma inspirada en Google Classroom, adaptada a barberías.

* Los **barberos** crean una “clase” (barbershop)
* Los **clientes** se unen mediante código
* Los clientes pueden **reservar citas** según servicios definidos
* Los barberos pueden mostrar **productos como catálogo (no e-commerce)**

---

## 🎯 Objetivo del Agente

El agente debe:

* Mantener consistencia en la base de datos
* Evitar abuso de roles
* Validar integridad de relaciones
* Aplicar reglas de negocio correctamente
* Prevenir accesos no autorizados

---

## 👤 Roles del Sistema

```txt
CLIENT
BARBER
```

### Reglas:

* Todos los usuarios se crean como `CLIENT`
* Un usuario se convierte en `BARBER` SOLO cuando crea una barbershop
* No existe selección manual de rol confiable en backend

---

## 🧱 Estructura de Base de Datos

### users

* id (uuid)
* name
* email (unique)
* password
* role (default: CLIENT)
* created_at

---

### barbershops

* id
* name
* location
* description
* schedule
* join_code (unique)
* owner_id (FK → users.id)
* created_at

---

### clients_barbershops

* id
* user_id (FK → users.id)
* barbershop_id (FK → barbershops.id)
* joined_at

Restricción:

* unique(user_id, barbershop_id)

---

### services

* id
* name
* description
* price
* duration_minutes
* barbershop_id (FK)
* created_at

---

### appointments

* id
* client_id (FK → users.id)
* barbershop_id (FK)
* service_id (FK → services.id)
* appointment_time
* status (PENDING | CONFIRMED | CANCELLED)
* created_at

---

### products (catálogo, no ventas)

* id
* name
* description
* price (opcional)
* image_url
* barbershop_id (FK)
* created_at

---

## 🔐 Reglas de Negocio

### 👤 Usuarios

* No pueden asignarse rol manualmente
* El rol se actualiza automáticamente en backend

---

### ✂️ Barberos

* Solo pueden existir si:

  * Han creado una barbershop
* Solo pueden:

  * Editar SU barbershop
  * Crear servicios en SU barbershop
  * Crear productos en SU barbershop

---

### 💇 Clientes

* Solo pueden:

  * Unirse a barbershops mediante `join_code`
  * Reservar citas en barbershops donde están registrados

---

### 🔗 Relación Cliente-Barbería

* Un cliente debe estar en `clients_barbershops` para:

  * ver servicios
  * agendar citas

---

### 📅 Citas (appointments)

* Deben cumplir:

  * service_id pertenece a la barbershop
  * client pertenece a la barbershop
* No se permite:

  * reservar en barberías no vinculadas

---

### ✂️ Servicios

* Definen:

  * precio
  * duración
* No se define precio directamente en la cita

---

### 🛍️ Productos

* Solo son informativos
* No hay compras, pagos ni órdenes
* No implementar lógica de e-commerce

---

## 🛡️ Validaciones Obligatorias (Backend)

### Ownership

```js
if (barbershop.owner_id !== user.id) return 403;
```

---

### Cliente pertenece a barbería

```js
if (!exists in clients_barbershops) return 403;
```

---

### Servicio válido

```js
if (service.barbershop_id !== barbershop.id) return 403;
```

---

## 🚫 Restricciones Importantes

* ❌ No crear múltiples barberías por usuario (fase inicial)
* ❌ No permitir acciones solo por rol sin validar ownership
* ❌ No confiar en el frontend para seguridad
* ❌ No implementar ventas (products es solo catálogo)

---

## ⚙️ Automatizaciones Recomendadas

### Crear barbershop:

* generar `join_code`
* actualizar rol a `BARBER`

---

### Unirse a barbershop:

* validar código
* insertar en `clients_barbershops`

---

## 📈 Escalabilidad Futura

Preparar para:

* múltiples barberos por barbería
* sistema de pagos
* ratings / reviews
* sistema de permisos (RBAC)
* panel ADMIN

---

## 🧠 Filosofía del Sistema

* El **rol no define todo**, las relaciones sí
* Seguridad basada en backend
* Modelo simple pero escalable
* Inspirado en lógica de Google Classroom

---

## ✅ Estado esperado del sistema

El sistema debe:

* prevenir abuso de roles
* mantener integridad de datos
* permitir reservas seguras
* permitir gestión clara de barberías
* ser extensible sin romper estructura

---
