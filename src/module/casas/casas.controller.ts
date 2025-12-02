import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, HttpCode, HttpStatus, UploadedFiles } from '@nestjs/common';
import { CasasService } from './casas.service';
import { CreateCasaDto } from './dto/create-casa.dto';
import { UpdateCasaDto } from './dto/update-casa.dto';
import { Casa } from './entities/casa.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/decorators/Roles.decorator';


@Controller('casas')
export class CasasController {
  constructor(private readonly casasService: CasasService) {}

  
  @Get()
  async findCasas(): Promise<Casa[]> {
    return await this.casasService.getCasas();
  }

  @Get(':id')
  async buscarCasa(@Param('id') id: string):Promise<Casa> {
    return await this.casasService.buscarCasa(id);
  }

  @Roles('admin','superAdmin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  async create(@Body() createCasaDto: CreateCasaDto) {
    return this.casasService.create(createCasaDto);
  }

  @Roles('admin','superAdmin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCasaDto: UpdateCasaDto): Promise<Casa> {
    return this.casasService.update(id,updateCasaDto);
  }

  @Roles('admin','superAdmin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)  // 204(estandar para DELETE, si lo diced es que se elimino)
  remove(@Param('id') id: string): Promise<void> {
    return this.casasService.remove(id);
  }

  @Roles('admin','superAdmin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('upload')
    @UseInterceptors(FilesInterceptor('imagen', 10))
    async crearProyectoConImagen(
      @UploadedFiles() imagenes: Express.Multer.File[],
      @Body() createProyectoDto: CreateCasaDto
    ): Promise<Casa> {
      return await this.casasService.crearCasaConImagenes(createProyectoDto, imagenes);
    }
}
