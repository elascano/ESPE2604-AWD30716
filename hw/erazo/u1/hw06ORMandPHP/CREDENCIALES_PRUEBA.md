# 🔑 CREDENCIALES DE PRUEBA - SISTEMA DE GESTIÓN MÉDICA

## USUARIOS DISPONIBLES

### 👤 PACIENTE
- **Usuario (Cédula):** `1234567890`
- **Contraseña:** `password123`
- **Nombre:** Juan Pérez García
- **Rol:** Paciente
- **Permisos:**
  - Reservar citas
  - Ver sus citas
  - Cancelar citas (con 24h de anticipación)
  - Actualizar perfil

---

### 🩺 MÉDICOS

#### Dr. Carlos Mendoza (Fisioterapia)
- **Usuario (Cédula):** `1111111111`
- **Contraseña:** `medico123`
- **Especialidad:** Fisioterapia
- **Licencia:** MED-2024-001
- **Permisos:**
  - Ver citas asignadas
  - Confirmar citas
  - Completar citas
  - Agregar notas a consultas

#### Dra. María González (Terapia Ocupacional)
- **Usuario (Cédula):** `0987654321`
- **Contraseña:** `medico123`
- **Especialidad:** Terapia Ocupacional
- **Licencia:** MED-2024-002
- **Permisos:**
  - Ver citas asignadas
  - Confirmar citas
  - Completar citas
  - Agregar notas a consultas

#### Dr. Roberto Silva (Psicología)
- **Usuario (Cédula):** `1122334455`
- **Contraseña:** `medico123`
- **Especialidad:** Psicología
- **Licencia:** MED-2024-003
- **Permisos:**
  - Ver citas asignadas
  - Confirmar citas
  - Completar citas
  - Agregar notas a consultas

---

### 🔧 ADMINISTRADOR
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Nombre:** Administrador del Sistema
- **Permisos:**
  - Gestión completa de usuarios
  - Gestión completa de terapias
  - Ver todas las citas del sistema
  - Acceso a todas las funcionalidades

---

## 🚀 CÓMO PROBAR

### 1. Probar como Paciente
```
1. Ir a http://localhost:3000/login
2. Usuario: 1234567890
3. Contraseña: password123
4. Explorar: Dashboard, Terapias, Mis Citas, Perfil
```

### 2. Probar como Médico
```
1. Cerrar sesión si está logueado
2. Ir a http://localhost:3000/login
3. Usuario: 1111111111 (o cualquier otro médico)
4. Contraseña: medico123
5. Explorar: Dashboard, Mis Citas (médico), Perfil
```

### 3. Probar como Admin
```
1. Cerrar sesión si está logueado
2. Ir a http://localhost:3000/login
3. Usuario: admin
4. Contraseña: admin123
5. Explorar: Dashboard, Gestión de Usuarios, Gestión de Terapias, Perfil
```

---

## 📋 FUNCIONALIDADES POR ROL

### PACIENTE
- ✅ Ver dashboard con estadísticas
- ✅ Seleccionar terapias
- ✅ Reservar citas (con validación de 12h anticipación)
- ✅ Ver calendario de disponibilidad
- ✅ Ver mis citas (próximas, completadas, canceladas)
- ✅ Cancelar citas (con validación de 24h anticipación)
- ✅ Ver y editar perfil

### MÉDICO
- ✅ Ver dashboard con estadísticas
- ✅ Ver citas del día
- ✅ Ver próximas citas
- ✅ Ver citas completadas
- ✅ Confirmar citas pendientes
- ✅ Completar citas
- ✅ Agregar notas a las consultas
- ✅ Ver información de pacientes
- ✅ Ver y editar perfil

### ADMIN
- ✅ Ver dashboard con estadísticas
- ✅ Gestionar usuarios (ver, buscar, filtrar)
- ✅ Gestionar terapias (crear, editar, activar/desactivar, eliminar)
- ✅ Ver estadísticas de usuarios y terapias
- ✅ Ver y editar perfil

---

## ⚠️ REGLAS DE NEGOCIO IMPLEMENTADAS

### Reserva de Citas
1. **Anticipación mínima:** 24 horas desde el momento actual
2. **Sin doble reserva:** No se puede tener dos citas en la misma fecha y hora
3. **Fecha futura:** No se pueden reservar citas en el pasado

### Cancelación de Citas
1. **Anticipación mínima:** 24 horas antes de la cita
2. **Solo citas activas:** Solo se pueden cancelar citas pendientes o confirmadas
3. **Motivo obligatorio:** Se debe proporcionar un motivo de cancelación

---

## 🧪 CASOS DE PRUEBA SUGERIDOS

### Caso 1: Flujo completo de paciente
1. Login como paciente
2. Ir a Terapias
3. Seleccionar una terapia
4. Elegir fecha y hora (mínimo 12h adelante)
5. Completar formulario con síntomas
6. Confirmar cita
7. Ir a "Mis Citas" y verificar que aparece
8. Intentar cancelar (si es más de 24h adelante)

### Caso 2: Validación de anticipación
1. Login como paciente
2. Intentar reservar una cita para dentro de 6 horas
3. Verificar que muestra error de anticipación mínima

### Caso 3: Flujo de médico
1. Login como médico (1111111111 / medico123)
2. Ir a "Mis Citas"
3. Ver citas del día
4. Confirmar una cita pendiente
5. Completar una cita confirmada
6. Agregar notas a la consulta

### Caso 4: Flujo de admin
1. Login como admin
2. Ir a "Gestión de Usuarios"
3. Buscar usuarios
4. Filtrar por rol
5. Ir a "Gestión de Terapias"
6. Crear nueva terapia
7. Editar terapia existente
8. Desactivar/activar terapia

---

## 📝 NOTAS IMPORTANTES

1. **Datos Mock:** Todos los datos son simulados y se reinician al recargar la página
2. **Persistencia:** Los cambios no se guardan en base de datos
3. **Validaciones:** Todas las validaciones están implementadas en frontend
4. **Backend:** Para producción, conectar con backend según `BACKEND_TECHNICAL_SPECIFICATION.md`

---

**¡Disfruta probando el sistema!** 🎉
