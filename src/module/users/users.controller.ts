import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/crear-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard} from 'src/auth/role.guard';
import { Roles } from 'src/decorators/Roles.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Roles('admin','superAdmin')//el requisito
    @UseGuards(JwtAuthGuard, RoleGuard)//verifica requisito
    @Get()
    async getUsers(): Promise<User[]> {
        return this.usersService.getUsers();
    }


    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.encontrarUsuario(id);
    }


    @Post()
    @HttpCode(HttpStatus.CREATED)  // ← Devuelve 201 en lugar de 200
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.createUser(createUserDto);
    }

    
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.usersService.updUser(id, updateUserDto);
    }

    @Roles('admin')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)  // 204(estandar para DELETE, si lo diced es que se elimino)
    async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.usersService.deleteUser(id);
        // No devuelve contenido, solo status 204
    }

    
    @UseGuards(JwtAuthGuard)
    @Get('gmail/:gmail')
    async getUserByEmail(@Param('gmail') gmail: string): Promise<User> {
    return this.usersService.encontrarPorGmail(gmail);
    }

@Patch('ascender/:gmail')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('superAdmin')
async ascenderUsuario(
  @Param('gmail') gmail: string,) : Promise<User>{
  return this.usersService.ascenderUser(gmail);
}
}