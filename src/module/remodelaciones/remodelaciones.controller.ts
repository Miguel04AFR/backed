import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpCode, HttpStatus, UseGuards, UploadedFiles, Query } from '@nestjs/common';
import { RemodelacionesService } from './remodelaciones.service';
import { CreateRemodelacionDto } from './dto/create-remodelacion.dto';
import { UpdateRemodelacionDto } from './dto/update-remodelacion.dto';
import { Remodelacion } from './entities/remodelacion.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/decorators/Roles.decorator';
import { PaginacionQueryDto } from './dto/paginacion-query.dto';

@Controller('remodelaciones')
export class RemodelacionesController {
    constructor(private readonly remodelacionesService: RemodelacionesService) {}

    
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin','superAdmin')
    @Post()
    async create(@Body() createRemodelacionDto: CreateRemodelacionDto): Promise<Remodelacion> {
        return await this.remodelacionesService.create(createRemodelacionDto);
    }


    @Get()
    async findRemodelaciones(): Promise<Remodelacion[]> {
        return await this.remodelacionesService.getRemodelaciones();
    }

     @Get('pag')
    async findRemodelacionesPag(@Query() paginacion: PaginacionQueryDto): Promise<{ remodelaciones: Remodelacion[]; total: number; totalPages: number }> {
        return await this.remodelacionesService.getRemodelacionesPag(paginacion);
    }


    @Get(':id')
    async buscarRemodelacion(@Param('id') id: number): Promise<Remodelacion> {
        return await this.remodelacionesService.buscarRemodelacion(id);
    }

    @Roles('admin','superAdmin')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Patch(':id')
    async update(
        @Param('id') id: number, 
        @Body() updateRemodelacionDto: UpdateRemodelacionDto
    ): Promise<Remodelacion> {
        return await this.remodelacionesService.update(id, updateRemodelacionDto);
    }

    @Roles('admin','superAdmin')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)  // 204(estandar para DELETE, si lo diced es que se elimino)
    async remove(@Param('id') id: number): Promise<void> {
        return await this.remodelacionesService.remove(id);
    }

    @Roles('admin','superAdmin')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('upload')
        @UseInterceptors(FilesInterceptor('imagen', 10))
        async crearProyectoConImagen(
          @UploadedFiles() imagenes: Express.Multer.File[],
          @Body() createRemodelacionDto: CreateRemodelacionDto
        ): Promise<Remodelacion> {

             const createRemodelacionDtoAct: CreateRemodelacionDto = {
    nombre: createRemodelacionDto.nombre,
    precio: Number(createRemodelacionDto.precio), // Convertir string a número
    descripcion: createRemodelacionDto.descripcion,
    descripcionDetallada: createRemodelacionDto.descripcionDetallada,
    accesorios: createRemodelacionDto.accesorios,
  };

          return await this.remodelacionesService.crearRemodelacionConImagenes(createRemodelacionDtoAct, imagenes);
        }
}