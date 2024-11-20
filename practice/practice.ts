/* eslint-disable prettier/prettier */
/* slint-siable prettier/prettier */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerModule } from "src/customer/customer.module";
import { Customer } from "src/customer/customer.entity";
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres', // Especifica el tipo de base de datos que se está utilizando. En este caso, PostgreSQL.
            host: process.env.DB_HOST, // Lee el host de la base de datos desde las variables de entorno.
            port: parseInt(process.env.DB_PORT, 10), // Lee el puerto de la base de datos desde las variables de entorno y lo convierte a entero.
            username: process.env.DB_USERNAME, // Lee el nombre de usuario de la base de datos desde las variables de entorno.
            password: process.env.DB_PASSWORD, // Lee la contraseña de la base de datos desde las variables de entorno.
            database: process.env.DB_DATABASE, // Lee el nombre de la base de datos desde las variables de entorno.
            entities: [Customer], // Define las entidades que TypeORM debe usar para crear las tablas en la base de datos. En este caso, la entidad Customer.
            synchronize: true, 

        }),
        CustomerModule,
    ],

})
export class AppModule {}