import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/crear-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';//esto es para hashear las contraseñas
import { Role } from '../roles/entity/role.entity';

@Injectable()
export class UsersService {

    constructor( @InjectRepository(User)
    private readonly usersRepository: Repository<User>, //los Repository sirven para imitar las consultas sql 
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}
    

  async createUser(createUserDto: CreateUserDto): Promise<User> {
  // Verificar si el email ya existe
  const existeUser = await this.usersRepository.findOne({ 
    where: { gmail: createUserDto.gmail } 
  });
  
  if (existeUser) {
    throw new ConflictException('El gmail ya está registrado');
  }
  
const hashearContra = await bcrypt.hash(createUserDto.password, 10);

 const defaultRole = await this.roleRepository.findOne({ where: { name: 'user' } });

  if (!defaultRole) {
    throw new NotFoundException('Rol por defecto "user" no encontrado');
  }

  const user = this.usersRepository.create({
    ...createUserDto,
    password: hashearContra,
    role: defaultRole
  });
  
  return await this.usersRepository.save(user);
}

    async getUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }
    
    

     async encontrarUsuario(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['role'] }); //esto equivale a SELECT * FROM users WHERE id = ?
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    return user;
  }

   async encontrarPorGmail(gmail: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { gmail }, relations: ['role'] }); 
    
    if (!user) {
      throw new NotFoundException(`Usuario con email ${gmail} no encontrado`);
    }
    
    return user;
  }

    async updUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
  const actUser = await this.encontrarUsuario(id);
  
  if (updateUserDto.password) {
    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
  }
  
  Object.assign(actUser, updateUserDto);
  return await this.usersRepository.save(actUser);
}

     async deleteUser(id: number): Promise<{ sms: string }> {
        const eliminarU = await this.encontrarUsuario(id);
        
        if (!eliminarU) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        await this.usersRepository.remove(eliminarU); // Elimina 1 elemento en la posicion
        return { sms: `Usuario con ID ${id} eliminado correctamente` };
    }

     async cambiarRol(userId: number, rol: string): Promise<User> {
    const user = await this.encontrarUsuario(userId);
    const newRole = await this.roleRepository.findOne({ where: { name: rol } });
    
    if (!newRole) {
      throw new NotFoundException(`Rol ${rol} no encontrado`);
    }

    user.role = newRole;
    return await this.usersRepository.save(user);
  }


async ascenderUser(gmail: string): Promise<User> {
  const user = await this.encontrarPorGmail(gmail);
  

  if (user.role.name === 'admin') {
    throw new ConflictException(`Este usuario ya es admin`);
  }

  const adminRole = await this.roleRepository.findOne({ 
    where: { name: 'admin' } 
  });
  
  if (!adminRole) {
    throw new NotFoundException('Rol "admin" no encontrado en la base de datos');
  }


  user.role = adminRole; // Esto cambia la relación real
  
  return await this.usersRepository.save(user);
}


}

