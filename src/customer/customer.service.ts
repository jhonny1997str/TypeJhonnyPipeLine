/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';  // Agregado HttpException y HttpStatus
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}
  //crear NUEVO USUARIO
  async create(customerData: Partial<Customer>): Promise<Customer> {
    try {
      const { customerName, email } = customerData;
  
      // Validar si el customerName está vacío
      if (!customerName || customerName.trim() === '') {
        throw new HttpException('El nombre del cliente es obligatorio', HttpStatus.BAD_REQUEST);
      }
  
      // Validar que customerName solo contenga letras
      const nameRegex = /^[a-zA-Z]+$/;
      if (!nameRegex.test(customerName)) {
        throw new HttpException('El nombre del cliente solo debe contener letras', HttpStatus.BAD_REQUEST);
      }
  
      // Validar si el email está vacío
      if (!email || email.trim() === '') {
        throw new HttpException('El email es obligatorio', HttpStatus.BAD_REQUEST);
      }
  
      // Validar formato de email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        throw new HttpException('El formato del email no es válido', HttpStatus.BAD_REQUEST);
      }
  
      // Verificar si el correo electrónico ya existe
      const existingCustomer = await this.customerRepository.findOne({ where: { email } });
      if (existingCustomer) {
        throw new HttpException('Ya existe un cliente con ese correo electrónico', HttpStatus.BAD_REQUEST);
      }
  
      // Crear el cliente y guardarlo
      const customer = this.customerRepository.create(customerData);
      return await this.customerRepository.save(customer);
    } catch (error) {
      console.error('Error al crear el cliente:', error);
      // Mejor manejo del error
      if (error instanceof HttpException) {
        throw error; // Si es un HttpException, se relanza
      } else {
        throw new HttpException(
          'Hubo un error al intentar crear el cliente. Por favor, intente nuevamente.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  

  // Obtener todos los clientes con paginación y ordenación
  async findAll(
    limit: number = 2,
    offset: number = 0,
    orderField: string = 'customerName',
    orderDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Customer[]> {
    try {
      return await this.customerRepository.find({
        take: limit,
        skip: offset,
        order: {
          [orderField]: orderDirection,
        },
      });
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      throw new Error('No se pudieron obtener los clientes debido a un error en la base de datos.');
    }
  }

  // Obtener un cliente por ID con manejo de errores y validación de entrada
  async findOne(customerId: number): Promise<Customer> {  // Cambié `id` por `customerId`
    try {
      if (isNaN(customerId) || customerId <= 0) {
        throw new Error('El ID debe ser un número válido y positivo');
      }

      const customer = await this.customerRepository.findOne({
        where: { customerId },  // Cambié `id` por `customerId`
      });

      if (!customer) {
        throw new Error(`No se encontró un cliente con el ID: ${customerId}`);
      }

      return customer;
    } catch (error) {
      console.error('Error al obtener el cliente:', error.message);
      throw new Error('No se pudo obtener el cliente debido a un error en la base de datos o al ID proporcionado.');
    }
  }
// Actualizar un cliente
async update(customerId: number, updateData: Partial<Customer>): Promise<Customer> {
  // Verificar si el cliente existe
  const customer = await this.customerRepository.findOne({
    where: { customerId },  // Usamos `where` para pasar el `customerId`
  });

  if (!customer) {
    // Lanzamos una excepción HTTP con código 404 (Not Found)
    throw new HttpException(
      `Cliente con id ${customerId} no encontrado`,
      HttpStatus.NOT_FOUND,
    );
  }

  // Validación de campos (por ejemplo, customerName y email)
  if (!updateData.customerName || updateData.customerName.trim() === '') {
    // Lanzamos una excepción HTTP con código 400 (Bad Request)
    throw new HttpException(
      'El campo customerName es obligatorio',
      HttpStatus.BAD_REQUEST,
    );
  }

  if (!updateData.email || updateData.email.trim() === '') {
    // Lanzamos una excepción HTTP con código 400 (Bad Request)
    throw new HttpException(
      'El campo email es obligatorio',
      HttpStatus.BAD_REQUEST,
    );
  }

  // Si se pasa un email, verificar su formato
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (updateData.email && !emailRegex.test(updateData.email)) {
    // Lanzamos una excepción HTTP con código 400 (Bad Request)
    throw new HttpException(
      'El email proporcionado no es válido',
      HttpStatus.BAD_REQUEST,
    );
  }

  // Intentar actualizar el cliente
  try {
    await this.customerRepository.update(customerId, updateData);  // El `update` sigue funcionando con `customerId`

    // Retornar el cliente actualizado directamente desde la base de datos
    const updatedCustomer = await this.customerRepository.findOne({
      where: { customerId },  // Usamos `where` nuevamente para obtener el cliente actualizado
    });
    if (!updatedCustomer) {
      // Si el cliente no se encuentra después de la actualización, lanzamos un error 404
      throw new HttpException(
        `Cliente con id ${customerId} no encontrado después de la actualización`,
        HttpStatus.NOT_FOUND,
      );
    }
    return updatedCustomer;
  } catch (error) {
    // Lanzamos una excepción HTTP con código 400 (Bad Request) si ocurre un error al intentar actualizar
    throw new HttpException(
      'Error al actualizar el cliente: ' + error.message,
      HttpStatus.BAD_REQUEST,
    );
  }
}


  // Eliminar un cliente
  async delete(customerId: number): Promise<void> {
    // Validamos que customerId sea un número positivo
    if (customerId <= 0) {
      throw new HttpException(
        'El ID debe ser un número positivo',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Usamos `where` para pasar `customerId` correctamente
    const customer = await this.customerRepository.findOne({
      where: { customerId },  // Usamos `where` para pasar `customerId`
    });

    if (!customer) {
      throw new HttpException(
        `Cliente con id ${customerId} no encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Si el cliente existe, lo eliminamos
    await this.customerRepository.remove(customer);
  }
}