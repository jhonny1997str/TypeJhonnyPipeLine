/* eslint-disable prettier/prettier */
// Desactiva las reglas de formateo de Prettier para este archivo en particular.
// Esto puede ser útil para evitar conflictos en el estilo de código cuando estás trabajando en un archivo de configuración.

import { Module } from '@nestjs/common'; // Importa el decorador Module de NestJS para definir un módulo.
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa el módulo TypeOrm para configurar TypeORM en la aplicación.
import { CustomerModule } from './customer/customer.module'; // Importa el módulo CustomerModule que maneja la entidad Customer.
import { Customer } from './customer/customer.entity'; // Importa la entidad Customer que define la estructura de la tabla en la base de datos.
import * as dotenv from 'dotenv'; // Importa dotenv para cargar las variables de entorno.

dotenv.config(); // Carga las variables de entorno desde el archivo .env. Esto permite acceder a valores como la configuración de la base de datos.

@Module({
  imports: [
    // Aquí se definen los módulos que la aplicación necesita importar para funcionar correctamente.

    // Configura la conexión a la base de datos usando TypeORM.
    TypeOrmModule.forRoot({
      type: 'postgres', // Especifica el tipo de base de datos que se está utilizando. En este caso, PostgreSQL.
      host: process.env.DB_HOST, // Lee el host de la base de datos desde las variables de entorno.
      port: parseInt(process.env.DB_PORT, 10), // Lee el puerto de la base de datos desde las variables de entorno y lo convierte a entero.
      username: process.env.DB_USERNAME, // Lee el nombre de usuario de la base de datos desde las variables de entorno.
      password: process.env.DB_PASSWORD, // Lee la contraseña de la base de datos desde las variables de entorno.
      database: process.env.DB_DATABASE, // Lee el nombre de la base de datos desde las variables de entorno.
      entities: [Customer], // Define las entidades que TypeORM debe usar para crear las tablas en la base de datos. En este caso, la entidad Customer.
      synchronize: true,
      logging: true,  // Sincroniza automáticamente la base de datos con las entidades. Útil en desarrollo, pero no recomendado en producción.
    }),

    // Importa el módulo CustomerModule, que encapsula toda la lógica relacionada con la entidad Customer.
    CustomerModule,
  ],
})
export class AppModule {}

