import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseUUIDPipe, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { MensajesService } from './mensajes.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { RoleGuard } from '../../auth/role.guard';
import { User } from '../users/entity/user.entity';
import { UsersService } from '../users/users.service';
import { GetUser } from 'src/decorators/getUser.decorator';
import { Mensaje } from './entities/mensaje.entity';
import { Roles } from 'src/decorators/Roles.decorator';

@Controller('mensajes')
export class MensajesController {
  constructor(private readonly mensajesService: MensajesService) {}


   
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createMensaje(
    @Body() createMensajeDto: CreateMensajeDto,
    @GetUser() token: any
  ) {
    return await this.mensajesService.createMensaje(createMensajeDto, token);
  }

  @Roles('admin','superAdmin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  async getMensajes() {
    return await this.mensajesService.getMensajes();
  }

  @Roles('admin','superAdmin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  async getMensajeById(
    @Param('id', ParseIntPipe) id: number): Promise<Mensaje> {
    return await this.mensajesService.buscarMensjae(id);
  }

  @Roles('admin','superAdmin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMensaje(
    @Param('id', ParseIntPipe) id: number
  ) {
    await this.mensajesService.remove(id);
  }
}