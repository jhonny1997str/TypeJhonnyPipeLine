/* eslint-disable prettier/prettier */
// Desactiva las reglas de formateo de Prettier para este archivo en particular.

import { Module } from '@nestjs/common'; // Importa el decorador Module de NestJS para definir un módulo.
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa el módulo TypeOrm para configurar TypeORM en la aplicación.
import { CustomerModule } from './customer/customer.module'; // Importa el módulo CustomerModule que maneja la entidad Customer.
import { Customer } from './customer/customer.entity'; // Importa la entidad Customer que define la estructura de la tabla en la base de datos.

@Module({
  imports: [
    // Configura la conexión a la base de datos usando TypeORM.
    TypeOrmModule.forRoot({
      type: 'postgres', // Especifica el tipo de base de datos que se está utilizando. En este caso, PostgreSQL.
      host: 'localhost', // Usamos directamente el valor del host proporcionado.
      port: 5432, // Usamos el puerto proporcionado.
      username: 'postgres', // Usamos el nombre de usuario proporcionado.
      password: 'solocali123#', // Usamos la contraseña proporcionada.
      database: 'proyect_nest', // Usamos el nombre de la base de datos proporcionada.
      entities: [Customer], // Define las entidades que TypeORM debe usar para crear las tablas en la base de datos. En este caso, la entidad Customer.
      synchronize: true, // Sincroniza las entidades con la base de datos (No recomendado en producción)
      logging: true, // Habilita el registro de SQL (útil en desarrollo)
    }),

    // Importa el módulo CustomerModule, que encapsula toda la lógica relacionada con la entidad Customer.
    CustomerModule,
  ],
})
export class AppModule {}
