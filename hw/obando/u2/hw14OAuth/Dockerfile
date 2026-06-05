# Usamos la misma imagen ligera de Node
FROM node:20-alpine

# Definimos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias (esto ocurre DENTRO del contenedor)
RUN npm install

# Copiamos todo el código fuente
COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Comando para ejecutar la app
CMD ["npm", "run", "dev", "--", "--host"]