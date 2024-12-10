/* eslint-disable prettier/prettier */
// Desactiva las reglas de formato de Prettier para este archivo

import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '../../src/customer/customer.controller';
import { CustomerService } from '../../src/customer/customer.service';
import { Customer } from '../../src/customer/customer.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('CustomerController', () => {
  let customerController: CustomerController;

  const mockCustomerService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  let customer: Customer;

  beforeEach(() => {
    customer = { customerId: 1, customerName: 'Juan Pérez', email: 'juan.perez@example.com' };

    mockCustomerService.create.mockResolvedValue(customer);
    mockCustomerService.findAll.mockResolvedValue([customer]);
    mockCustomerService.findOne.mockResolvedValue(customer);
    mockCustomerService.update.mockResolvedValue(customer);
    mockCustomerService.delete.mockResolvedValue(undefined);
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    customerController = module.get<CustomerController>(CustomerController);
  });

  it('debería estar definido', () => {
    expect(customerController).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un cliente correctamente', async () => {
      const customerData: Partial<Customer> = { customerName: 'Juan Pérez', email: 'juan.perez@example.com' };
      expect(await customerController.create(customerData)).toEqual(customer);
      expect(mockCustomerService.create).toHaveBeenCalledWith(customerData);
    });

    it('debería lanzar un error cuando falte el nombre del cliente', async () => {
      const customerData: Partial<Customer> = { email: 'juan.perez@example.com' };

      mockCustomerService.create.mockRejectedValue(
        new HttpException('El nombre del cliente es obligatorio', HttpStatus.BAD_REQUEST)
      );

      await expect(customerController.create(customerData)).rejects.toThrowError(
        new HttpException('El nombre del cliente es obligatorio', HttpStatus.BAD_REQUEST)
      );
    });
  });

  describe('findAll', () => {
    it('debería devolver un array de clientes', async () => {
      expect(await customerController.findAll()).toEqual([customer]);
    });

    it('debería lanzar un error si findAll falla', async () => {
      mockCustomerService.findAll.mockRejectedValue(
        new HttpException('Error al obtener los clientes.', HttpStatus.INTERNAL_SERVER_ERROR)
      );

      await expect(customerController.findAll()).rejects.toThrowError(
        new HttpException('Error al obtener los clientes.', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });

  describe('findOne', () => {
    it('debería devolver un cliente por ID', async () => {
      expect(await customerController.findOne(1)).toEqual(customer);
    });

    it('debería lanzar un error si no se encuentra el cliente', async () => {
      mockCustomerService.findOne.mockResolvedValue(null);

      await expect(customerController.findOne(1)).rejects.toThrowError(
        new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('update', () => {
    it('debería actualizar un cliente correctamente', async () => {
      const updatedData: Partial<Customer> = { customerName: 'Juan Pérez Actualizado' };
      const updatedCustomer = { ...customer, ...updatedData };

      mockCustomerService.update.mockResolvedValue(updatedCustomer);

      expect(await customerController.update('1', updatedData)).toEqual(updatedCustomer);
      expect(mockCustomerService.update).toHaveBeenCalledWith(1, updatedData);
    });

    it('debería lanzar un error si la actualización falla', async () => {
      const updatedData: Partial<Customer> = { customerName: 'Juan Pérez Actualizado' };
      mockCustomerService.update.mockRejectedValue(
        new HttpException('Error al actualizar el cliente.', HttpStatus.INTERNAL_SERVER_ERROR)
      );

      await expect(customerController.update('1', updatedData)).rejects.toThrowError(
        new HttpException('Error al actualizar el cliente.', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });

  describe('delete', () => {
    it('debería eliminar un cliente correctamente', async () => {
      mockCustomerService.delete.mockResolvedValue(undefined);

      await expect(customerController.delete(1)).resolves.toBeUndefined();
      expect(mockCustomerService.delete).toHaveBeenCalledWith(1);
    });

    it('debería lanzar un error si la eliminación falla', async () => {
      mockCustomerService.delete.mockRejectedValue(
        new HttpException('Error al eliminar el cliente.', HttpStatus.INTERNAL_SERVER_ERROR)
      );

      await expect(customerController.delete(1)).rejects.toThrowError(
        new HttpException('Error al eliminar el cliente.', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });
});
