import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProyectoDto } from './dto/crear-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Proyecto } from './entity/proyecto.entity';

@Injectable()
export class ProyectosService {
    constructor(
        @InjectRepository(Proyecto) 
        private proyectoRepository: Repository<Proyecto>,
    ) {}

    async create(createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
        const proyecto = this.proyectoRepository.create(createProyectoDto);
        return await this.proyectoRepository.save(proyecto);
    }

    async getProyectos(): Promise<Proyecto[]> {
        return await this.proyectoRepository.find();
    }

    async buscarProyecto(id: number): Promise<Proyecto> {
        const proyecto = await this.proyectoRepository.findOne({ where: { id } });
        if (!proyecto) {
            throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
        }
        return proyecto;
    }

    async update(id: number, updateProyectoDto: UpdateProyectoDto): Promise<Proyecto> {
        const proyecto = await this.buscarProyecto(id);

          if (!proyecto) {
            throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
        }
        await this.proyectoRepository.update(id, updateProyectoDto);
        return await this.buscarProyecto(id);
    }

    async remove(id: number): Promise<void> {
        const proyecto = await this.buscarProyecto(id);

          if (!proyecto) {
            throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
        }

        this.eliminarImagenFisica(proyecto.imagenUrl);
        await this.proyectoRepository.delete(id);
        
    }



     async crearProyectoConImagen(
    createProyectoDto: CreateProyectoDto,
    imagen: Express.Multer.File,//multer es para subir archivos es un middleware
  ): Promise<Proyecto> {
    
    if (!imagen) {
      throw new BadRequestException('La imagen es requerida');
    }

    if (!imagen.mimetype.startsWith('image/')) {
      throw new BadRequestException('Solo se permiten archivos de imagen');
    }

    // Genera un nombre unico para la imagen
    const timestamp = Date.now();
    const extension = imagen.originalname.split('.').pop();
    const nombreArchivo = `proyecto-${timestamp}.${extension}`;
    

    const rutaImagen = `/uploads/proyectos/${nombreArchivo}`;

    // Guardar la imagen fisicamente
    const fs = require('fs');
    const path = require('path');
    
    const uploadsDir = path.join(process.cwd(), 'uploads', 'proyectos');
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadsDir)) {//esto ni lo toquen que existe XD
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Guarda el archivo
    fs.writeFileSync(path.join(uploadsDir, nombreArchivo), imagen.buffer);

    const proyecto = this.proyectoRepository.create({
      ...createProyectoDto,
      imagenUrl: rutaImagen,
    });

    return await this.proyectoRepository.save(proyecto);
  }

  private async eliminarImagenFisica(imagenUrl: string): Promise<void> {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Extraer nombre del archivo de la URL
    const nombreArchivo = imagenUrl.split('/').pop();
    
    if (nombreArchivo) {
      const rutaImagen = path.join(process.cwd(), 'uploads', 'proyectos', nombreArchivo);
      
      // Verificar si el archivo existe antes de eliminar
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen);
      } else {
        console.warn('Imagen no encontrada:', rutaImagen);//aqui cagamos XD
      }
    }
  } catch (error) {
    console.error('Error eliminando imagen física:', error);
    // No lanzamos error para no impedir la eliminación del proyecto
    }
}
}