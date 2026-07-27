FROM node:18-alpine
WORKDIR /app
# Copiamos todo el repositorio (backend y frontend)
COPY . .
# Entramos a la carpeta del backend e instalamos dependencias
WORKDIR /app/backend
RUN npm install
# Google Cloud Run usa el puerto 8080 por defecto
ENV PORT=8080
EXPOSE 8080
# Encendemos el servidor
CMD ["node", "index.js"]
