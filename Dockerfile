# Usa la imagen base de Node.js
FROM node:18

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código fuente
COPY . .

# Ejecuta la compilación para crear los archivos en el directorio dist/
RUN npm run build

# Expone el puerto que la aplicación usará
EXPOSE 3000

# Comando para iniciar la aplicación en producción
CMD ["npm", "run", "start:prod"]
