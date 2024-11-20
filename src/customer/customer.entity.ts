/* eslint-disable prettier/prettier */
// src/customer/customer.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  customerId: number;

  @Column()
  customerName: string;

  @Column()
  email: string;
}
