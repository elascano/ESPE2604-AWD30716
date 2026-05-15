# 🏥 Sistema de Gestión de Citas Médicas - SER SALUD

Sistema web completo para la gestión de citas médicas con tres tipos de usuarios: Pacientes, Médicos y Administradores.

## 📋 Características Principales

- ✅ **Registro y autenticación** de usuarios con roles
- ✅ **Reserva de citas** con flujo de 5 pasos (Terapia → Médico → Calendario → Formulario → Confirmación)
- ✅ **Gestión de terapias** por administradores
- ✅ **Gestión de usuarios** por administradores
- ✅ **Visualización de citas** para médicos
- ✅ **Historial de citas** para pacientes
- ✅ **Validación de reglas de negocio** (anticipación >24h, sin doble reserva)
- ✅ **Selección de médico** por especialidad de terapia
- ✅ **Tipos de seguro** (IESS, Ejército, Policía, ISSFA, ISSPOL, Privado)
- ✅ **Diseño responsive** adaptado a móviles y desktop

## 🚀 Tecnologías

### Frontend
- **React 18** + TypeScript
- **Material-UI (MUI) v7** - Componentes UI
- **Redux Toolkit** + RTK Query - Estado global y cache
- **React Router v6** - Navegación
- **React Hook Form** + Zod - Formularios y validación
- **SweetAlert2** - Alertas
- **Vite** - Build tool

### Backend (Pendiente)
- **Node.js** + Express
- **PostgreSQL** / MySQL
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas

## 🎯 Flujo de Reserva de Citas

```
1. Selección de Terapia (/terapias)
   ↓
2. Selección de Médico (/seleccion-medico)
   - Filtrado por especialidad de la terapia
   ↓
3. Selección de Fecha y Hora (/calendario)
   - Validación: >24 horas de anticipación
   ↓
4. Formulario de Información Médica (/formulario-cita)
   - Síntomas, exámenes
   ↓
5. Confirmación y Creación de Cita (/confirmacion)
```

## 📝 Reglas de Negocio

### Reserva de Citas
- ✅ **Anticipación mínima:** MÁS de 24 horas (no exactamente 24)
- ✅ **Sin doble reserva:** Un paciente no puede tener dos citas en la misma fecha/hora
- ✅ **Médico por especialidad:** Solo médicos que pueden realizar la terapia seleccionada

### Cancelación de Citas
- ✅ **Anticipación mínima:** MÁS de 24 horas
- ✅ **Motivo obligatorio:** Se debe proporcionar razón de cancelación

## 🔐 Credenciales de Prueba

### Paciente
- **Cédula:** `1234567890`
- **Contraseña:** `password123`

### Médicos
- **Dr. Carlos Mendoza (Fisioterapia):** `1111111111` / `medico123`
- **Dra. María González (Terapia Ocupacional):** `0987654321` / `medico123`
- **Dr. Roberto Silva (Psicología):** `1122334455` / `medico123`

### Administrador
- **Cédula:** `admin`
- **Contraseña:** `admin123`

## 🛠️ Instalación y Ejecución

### Requisitos Previos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar repositorio
git clone <url-repositorio>
cd flova_front

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

### Ejecución en Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador: http://localhost:5173
```

### Compilación para Producción

```bash
# Compilar
npm run build

# Vista previa
npm run preview
```

### Deploy en Vercel

Ver **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)** para instrucciones completas de deploy.

**Resumen rápido:**
1. Configura Root Directory como `Flova_front` en Vercel
2. Agrega variable de entorno `VITE_API_BASE_URL` con la URL de tu backend
3. Deploy automático desde GitHub o usando Vercel CLI

## 📚 Documentación

### Documentos Principales

1. **[GUIA_COMPLETA_SISTEMA.md](./GUIA_COMPLETA_SISTEMA.md)**
   - Guía completa del sistema
   - Flujos de usuario detallados
   - Roles y permisos
   - Reglas de negocio
   - Estructura del frontend
   - Credenciales de prueba

2. **[BACKEND_TECHNICAL_SPECIFICATION.md](./BACKEND_TECHNICAL_SPECIFICATION.md)**
   - Especificaciones técnicas para el backend
   - Modelos de base de datos (SQL + Prisma)
   - Endpoints de la API REST
   - Validaciones y reglas de negocio
   - Ejemplos de requests/responses
   - Guía de implementación con Express

3. **[CREDENCIALES_PRUEBA.md](./CREDENCIALES_PRUEBA.md)**
   - Credenciales de todos los usuarios de prueba
   - Datos de ejemplo de terapias

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Configuración global
│   ├── router.tsx         # Rutas de la aplicación
│   ├── store.ts           # Store de Redux
│   └── theme/             # Tema de MUI
├── components/            # Componentes reutilizables
│   ├── auth/              # Protección de rutas
│   └── layout/            # Layout principal
├── contexts/              # React Context
├── pages/                 # Páginas de la aplicación
│   ├── auth/              # Login y registro
│   ├── appointments/      # Flujo de reserva de citas
│   ├── admin/             # Gestión (admin)
│   ├── medico/            # Citas (médico)
│   └── citas/             # Mis citas (paciente)
├── services/              # APIs y mocks
│   ├── authService.ts
│   ├── citasApi.ts
│   ├── medicosApi.ts
│   ├── terapiasApi.ts
│   └── mocks/             # Datos de prueba
├── types/                 # Tipos TypeScript
└── utils/                 # Utilidades y validaciones
```

## 🎨 Roles y Permisos

### Paciente
- Reservar citas
- Ver y cancelar sus citas
- Editar su perfil

### Médico
- Ver sus citas asignadas
- Ver detalles de pacientes
- Marcar citas como completadas

### Administrador
- Gestionar usuarios (crear, editar, eliminar, cambiar roles)
- Gestionar terapias (crear, editar, activar/desactivar)
- Ver todas las citas del sistema

## ⚠️ Limitaciones Actuales (Mocks)

- Los datos se generan con mocks y no persisten
- La validación de >24 horas funciona en lógica pero puede tener problemas de caché en UI
- Los horarios disponibles se generan aleatoriamente
- Las imágenes son placeholders

## 🚧 Pendiente para Backend

1. ✅ Implementar API REST con Express
2. ✅ Crear base de datos (PostgreSQL/MySQL)
3. ✅ Implementar autenticación JWT
4. ✅ Implementar validaciones en servidor
5. ✅ Implementar subida de archivos
6. ✅ Implementar notificaciones por email/SMS

Ver **[BACKEND_TECHNICAL_SPECIFICATION.md](./BACKEND_TECHNICAL_SPECIFICATION.md)** para especificaciones completas.

## 📝 Notas Importantes

### Estado Actual
- **Frontend:** ✅ Completo y funcional con datos mock
- **Backend:** ⏳ Pendiente de implementación

### Implementaciones Clave
1. **Flujo de reserva completo:** Terapia → Médico → Calendario → Formulario → Confirmación
2. **Selección de médico por especialidad:** Los médicos se filtran según la especialidad de la terapia
3. **Validación de >24 horas:** Implementada en frontend, pendiente optimización en backend
4. **Sistema de roles:** Paciente, Médico y Administrador con permisos diferenciados

### Para Producción
- Conectar con backend según especificaciones en `BACKEND_TECHNICAL_SPECIFICATION.md`
- Reemplazar imágenes placeholder con imágenes propias
- Implementar todas las validaciones en el servidor
- Configurar variables de entorno de producción

---

**Versión:** 2.0  
**Última actualización:** Mayo 2026  
**Estado:** Frontend completo, Backend pendiente
 
 

**Desarrollado con ❤️ siguiendo arquitectura profesional y mejores prácticas**
