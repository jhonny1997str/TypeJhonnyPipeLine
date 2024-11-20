/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';
import { ParseIntPipe } from '@nestjs/common';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // Crear un nuevo cliente
  @Post()
  async create(@Body() customerData: Partial<Customer>): Promise<Customer> {
    try {
      return await this.customerService.create(customerData);
    } catch (error) {
      const errorMessage = error?.message || 'Error al crear el cliente. Por favor, intente nuevamente.';
      const statusCode = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      console.error('Error al crear el cliente:', error);
      throw new HttpException(errorMessage, statusCode);
    }
  }

  // Obtener todos los clientes con opciones de consulta y manejo de errores
  @Get()
  async findAll(
    @Query('limit') limit: number = 2, // Valor predeterminado
    @Query('offset') offset: number = 0, // Valor predeterminado
    @Query('orderField') orderField: string = 'customerName', // Valor predeterminado
    @Query('orderDirection') orderDirection: 'ASC' | 'DESC' = 'ASC', // Valor predeterminado
  ): Promise<Customer[]> {
    try {
      const customers = await this.customerService.findAll(limit, offset, orderField, orderDirection);
      return customers;
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
      throw new HttpException('Error al obtener los clientes.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Obtener un cliente por ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
    try {
      if (id <= 0) {
        throw new HttpException('El ID debe ser mayor que 0', HttpStatus.BAD_REQUEST);
      }

      const customer = await this.customerService.findOne(id);
      if (!customer) {
        throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
      }

      return customer;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Actualizar un cliente
  @Put(':id')  // Ruta PUT que recibe el parámetro `id` en la URL
  async update(
    @Param('id') id: string,  // Recibimos el id del cliente como parámetro en formato string
    @Body() updateData: Partial<Customer>,  // Recibimos los datos a actualizar en el cuerpo de la solicitud
  ): Promise<Customer> {
    // Verificar si el id es un número positivo y solo contiene números
    const idRegex = /^[0-9]+$/; // Expresión regular que permite solo números enteros positivos

    if (!idRegex.test(id)) {
      throw new HttpException(
        'El ID debe ser un número positivo sin letras ni caracteres especiales',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Convertir el id a número
    const customerId = Number(id);

    try {
      // Llamamos al servicio para actualizar el cliente
      return await this.customerService.update(customerId, updateData);
    } catch (error) {
      // Si ocurre algún error en el servicio, lanzamos una excepción HTTP con el mensaje de error
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  // Eliminar un cliente
  @Delete(':id') // Ruta DELETE que recibe el parámetro `id` en la URL
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      // Llamamos al servicio para eliminar al cliente
      return await this.customerService.delete(id);
    } catch (error) {
      // Si ocurre algún error, lanzamos una excepción HTTP con un mensaje
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}