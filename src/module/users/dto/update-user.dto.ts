import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './crear-user.dto';
import { Role } from 'src/module/roles/entity/role.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {//el Partial sirve para no tener que actualizar todo 
nombre?: string; 
apellido?: string;
telefono?: string;
gmail?: string; 
password?: string; 
role: Role;


}