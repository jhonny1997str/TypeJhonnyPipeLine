/* eslint-disable prettier/prettier */


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { Customer } from './customer/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'proyect_nest',
      entities: [Customer],
      synchronize: true,
    }),
    CustomerModule,
  ],
})
export class AppModule {}

