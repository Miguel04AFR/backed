import { ConflictException, Injectable } from '@nestjs/common';
import { Role } from './entity/role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(name: string, description?: string): Promise<Role> {
    // Verificar si el rol ya existe
    const existeRol = await this.roleRepository.findOne({ where: { name } });
    if (existeRol) {
      throw new ConflictException(`El rol '${name}' ya existe`);
    }

    const role = this.roleRepository.create({
      name,
      description: description || `Rol de ${name}`,
    });

    return await this.roleRepository.save(role);
  }
}