import { Body, Controller, Post } from '@nestjs/common';
import { CreateRolesDto } from './dto/create-roles-dto';
import { Role } from './entity/role.entity';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

 @Post()
  async create(@Body() createRoleDto: CreateRolesDto): Promise<Role> {
    return await this.rolesService.create(createRoleDto.name, createRoleDto.description);
  }


}
