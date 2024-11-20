/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;

  let createdCustomerId: number; // Variable para almacenar el ID del usuario creado

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    // Crear un usuario antes de cada prueba
    const response = await request(app.getHttpServer())
      .post('/customers')
      .send({
        customerName: 'Carlos',
        email: 'carlos@gmail.com',
      })
      .expect(201);

    // Almacenar el ID del usuario creado
    createdCustomerId = response.body.customerId;
  });

  afterEach(async () => {
    // Eliminar el usuario después de cada prueba
    await request(app.getHttpServer())
      .delete(`/customers/${createdCustomerId}`)
      .expect(200);
  });

  afterAll(async () => {
    // Cerrar la aplicación al final de todas las pruebas
    await app.close();
  });

  it('/customers (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/customers')
      .expect(200);

    // Verificar que el usuario creado esté en la lista
    expect(response.body).toContainEqual({
      customerId: createdCustomerId,
      customerName: 'Carlos',
      email: 'carlos@gmail.com',
    });
  });
  

});
