import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/crear-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Proyecto } from './entity/proyecto.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/decorators/Roles.decorator';

@Controller('proyectos')
export class ProyectosController {
    constructor(private readonly proyectosService: ProyectosService) {}

    @Roles('admin','superAdmin')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post()
    async create(@Body() createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
        return await this.proyectosService.create(createProyectoDto);
    }


    @Get()
    async findProyectos(): Promise<Proyecto[]> {
        return await this.proyectosService.getProyectos();
    }

    @Get(':id')
    async buscarProyecto(@Param('id') id: number): Promise<Proyecto> {
        return await this.proyectosService.buscarProyecto(id);
    }
    
    @Roles('admin','superAdmin')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Patch(':id')
    async update(
        @Param('id') id: number, 
        @Body() updateProyectoDto: UpdateProyectoDto
    ): Promise<Proyecto> {
        return await this.proyectosService.update(id, updateProyectoDto);
    }

    @Roles('admin','superAdmin')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)  // 204(estandar para DELETE, si lo diced es que se elimino)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.proyectosService.remove(id);
    }

    @Roles('admin','superAdmin')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('upload')
  @UseInterceptors(FileInterceptor('imagen'))
  async crearProyectoConImagen(
    @UploadedFile() imagen: Express.Multer.File,
    @Body() createProyectoDto: CreateProyectoDto
  ): Promise<Proyecto> {
    return await this.proyectosService.crearProyectoConImagen(createProyectoDto, imagen);
  }
        
}