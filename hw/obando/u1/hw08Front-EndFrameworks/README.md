# SKILLS
npx skills add https://github.com/anthropics/skills --skill frontend-design
npx skills add https://github.com/supabase/agent-skills --skill supabase-postgres-best-practices

# AGENTS.md
Contexto para la IA

# tecnologias
ROL: Actúa como un gestor de proyectos con mas de 15 años de experiencia. CONTEXTO: Voy hacer un web service, en este caso de una barberia, las tecnologias que voy a utilizar es template bootstrap 5, js, html, css, php, supabase postgresql, sweetalert, react and next.js, trello, github, docker para desplegar la web en aws utilizando EC2 con una metodlogia AGIL SCRUM y teniendo encuenta clean code, arquitectura MVC y principios SOLID .
ACCIÓN: Utiliza trello, para hacer sprints correctos y poder organizarnos el grupo de 3 personas. Que se separen responsabilidades.

# Desarrollo Local (Guía para el Equipo de Trabajo)

Para que cualquier miembro del equipo pueda descargar y correr el proyecto en su propia computadora, sigan estos pasos:

### Prerrequisitos
- Tener instalado **Git**.
- Tener instalado **Docker Desktop** (Asegurarse de que esté ejecutándose).

### 1. Clonar el repositorio
Abran su terminal o Git Bash y ejecuten:
```bash
git clone https://github.com/tu-usuario/barbershopsharkhub.git
cd barbershopsharkhub
```

### 2. Levantar el servidor
Construiremos y levantaremos el contenedor Docker:
```bash
docker-compose up -d --build
```

### 3. Ver el resultado
- Abran su navegador y visiten: `http://localhost` (o `http://localhost:80`)
- Si hay algún problema de puerto ocupado, avisen al encargado para mapear un puerto distinto en local (ej. `8080:3000`).

Para detener el servidor localmente sin borrar nada, ejecuten:
```bash
docker-compose stop
```

---

# Despliegue en Producción (AWS EC2)

A continuación, se detallan los pasos para desplegar este proyecto en una máquina virtual de AWS EC2 utilizando GitHub y Docker.

## 1. Conectarse a la instancia EC2
Accede a tu instancia por SSH:
```bash
ssh -i "tu-llave.pem" ubuntu@tu-ip-publica-ec2
```

## 2. Instalar Docker y Git (Si no están instalados)
Actualiza el sistema e instala Git, Docker y Docker Compose:
```bash
sudo apt update
sudo apt install git docker.io docker-compose -y
```

## 3. Clonar el repositorio desde GitHub
Clona el proyecto en tu máquina EC2 y entra en el directorio:
```bash
git clone https://github.com/tu-usuario/barbershopsharkhub.git
cd barbershopsharkhub
```

## 4. Puerto por defecto (Puerto 80)
El archivo `docker-compose.yml` ha sido configurado para mapear el puerto interno `3000` de la aplicación Node.js al puerto `80` del host (EC2). Esto permite acceder a la web directamente ingresando la IP pública, sin necesidad de especificar un puerto en la URL (ej. `http://tu-ip-publica-ec2/`).

**Nota Importante de Seguridad:** Asegúrate de ir a la consola de AWS y agregar una regla de entrada (Inbound Rule) en el **Security Group** de tu EC2 para permitir tráfico **HTTP (Puerto 80) desde cualquier origen (`0.0.0.0/0`)**.

## 5. Levantar el servicio
Finalmente, construye y levanta el contenedor en segundo plano:
```bash
sudo docker-compose up -d --build
```
¡Tu aplicación ya estará visible desde internet!

------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------

“solo quiero una barbería”

Perfecto. Entonces haces esto:

🔧 Estrategia PRO (la que usan startups)
✔ Mantienes el modelo escalable (el que ya diseñamos)

PERO…

✔ Trabajas como si hubiera una sola barbería
🧩 5. ¿Cómo funciona con una sola barbería?
Opción simple (recomendada para MVP):
Creas UNA barbería fija en la BD
INSERT INTO barbershops (id, name)
VALUES ('BARBERSHOP_DEFAULT', 'Mi Barbería');
Luego TODO usa ese ID:
barbershop_id = 'BARBERSHOP_DEFAULT'
En el código:

Ni siquiera dejas elegir barbería.

Todo está “hardcodeado” lógicamente:

const BARBERSHOP_ID = "default-id";