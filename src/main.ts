/* eslint-disable prettier/prettier */
// Esta línea desactiva las reglas de ESlint y Prettier para todo el archivo.
// Es útil si deseas desactivar temporalmente estas reglas de formato y estilo.

/* Importación de módulos */
import { NestFactory } from '@nestjs/core'; // Importa la fábrica para crear una aplicación NestJS.
import { AppModule } from './app.module'; // Importa el módulo principal de la aplicación.
import * as dotenv from 'dotenv'; // Importa dotenv para gestionar variables de entorno.
import * as morgan from 'morgan'; // Importa morgan para el registro de solicitudes HTTP.

/* Función principal para inicializar la aplicación */
async function bootstrap() {
  dotenv.config(); // Carga las variables de entorno desde el archivo .env (por ejemplo, PORT, configuraciones de base de datos, etc.)

  const app = await NestFactory.create(AppModule); // Crea la aplicación NestJS usando el módulo raíz (AppModule).

  app.use(morgan('dev')); // Configura morgan en modo 'dev' para registrar las solicitudes HTTP en la consola (útil para desarrollo).

  const port = process.env.PORT ?? 3000; // Asigna el puerto de escucha, usando la variable de entorno PORT o el puerto 3000 por defecto.
  await app.listen(port); // Inicia el servidor en el puerto especificado.
  console.log(`Server running in http://localhost:${port}`); // Muestra un mensaje en la consola indicando la URL del servidor.
}

/* Llama a la función bootstrap para arrancar la aplicación */
bootstrap();
