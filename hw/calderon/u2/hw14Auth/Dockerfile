# Usa una imagen base ligera de Node
FROM node:22-bookworm-slim

WORKDIR /app

# Instalar dependencias necesarias para Prisma y SSL
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de configuración globales
COPY package*.json ./

# --- CONFIGURAR FRONTEND ---
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- CONFIGURAR BACKEND ---
WORKDIR /app/backend
COPY backend/package*.json ./
COPY backend/prisma ./prisma
RUN npm install
# Generar el cliente de Prisma
RUN npx prisma generate
COPY backend/ ./
RUN npm run build

# --- CONFIGURACIÓN FINAL ---
WORKDIR /app/backend
ENV NODE_ENV=production
EXPOSE 3000

# Iniciar el servidor backend (que también servirá el frontend)
CMD ["npm", "start"]