# Usa la imagen base de Node.js
FROM node:18

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install


COPY . .


RUN npm run build


EXPOSE 3000


CMD ["npm", "run", "start:prod"]
