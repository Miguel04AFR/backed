import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRemodelacionDto } from './dto/create-remodelacion.dto';
import { UpdateRemodelacionDto } from './dto/update-remodelacion.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Remodelacion } from './entities/remodelacion.entity';

@Injectable()
export class RemodelacionesService {
    constructor(
        @InjectRepository(Remodelacion) 
        private remodelacionRepository: Repository<Remodelacion>,
    ) {}

    async create(createRemodelacionDto: CreateRemodelacionDto): Promise<Remodelacion> {
        const remodelacion = this.remodelacionRepository.create(createRemodelacionDto);
        return await this.remodelacionRepository.save(remodelacion);
    }

    async getRemodelaciones(): Promise<Remodelacion[]> {
        return await this.remodelacionRepository.find();
    }

    async buscarRemodelacion(id: number): Promise<Remodelacion> {
        const remodelacion = await this.remodelacionRepository.findOne({ where: { id } });
        if (!remodelacion) {
            throw new NotFoundException(`Remodelación con ID ${id} no encontrada`);
        }
        return remodelacion;
    }

    async update(id: number, updateRemodelacionDto: UpdateRemodelacionDto): Promise<Remodelacion> {
        const remodelacion = await this.buscarRemodelacion(id);

         if (!remodelacion) {
            throw new NotFoundException(`Remodelación con ID ${id} no encontrada`);
        }

        await this.remodelacionRepository.update(id, updateRemodelacionDto);
        return await this.buscarRemodelacion(id);
    }

    async remove(id: number): Promise<void> {
        const remodelacion = await this.buscarRemodelacion(id);

       if (!remodelacion) {
            throw new NotFoundException(`Remodelación con ID ${id} no encontrada`);
        }
        this.eliminarImagenesFisicas(remodelacion.imagenUrl);
        await this.remodelacionRepository.delete(id);
    }


    async crearRemodelacionConImagenes(
      createRemodelacionDto: CreateRemodelacionDto,
      imagenes: Express.Multer.File[],
    ): Promise<Remodelacion> {
      
      if (!imagenes || imagenes.length === 0) {
        throw new BadRequestException('Al menos una imagen es requerida');
      }
    
      const rutasImagenes: string[] = [];
    
      for (const imagen of imagenes) {
        if (!imagen.mimetype.startsWith('image/')) {
          throw new BadRequestException('Solo se permiten archivos de imagen');
        }
    
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8); // Para evitar colisiones
        const extension = imagen.originalname.split('.').pop();
        const nombreArchivo = `remodelacion-${timestamp}-${random}.${extension}`;
        
        const rutaImagen = `/uploads/remodelaciones/${nombreArchivo}`;
    
  
        const fs = require('fs');
        const path = require('path');
        
        const uploadsDir = path.join(process.cwd(), 'uploads', 'remodelaciones');
        
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        fs.writeFileSync(path.join(uploadsDir, nombreArchivo), imagen.buffer);
        
        rutasImagenes.push(rutaImagen);
      }
    
      const remodelacion = this.remodelacionRepository.create({
        ...createRemodelacionDto,
        imagenUrl: rutasImagenes,
      });
    
      return await this.remodelacionRepository.save(remodelacion);
    }
    
    
    private async eliminarImagenesFisicas(imagenesUrl: string[]): Promise<void> {
      try {
        const fs = require('fs');
        const path = require('path');
        
    
        for (const imagenUrl of imagenesUrl) {
          const nombreArchivo = imagenUrl.split('/').pop();
          
          if (nombreArchivo) {
            const rutaImagen = path.join(process.cwd(), 'uploads', 'remodelaciones', nombreArchivo);
            
            if (fs.existsSync(rutaImagen)) {
              fs.unlinkSync(rutaImagen);
            } else {
              console.warn('Imagen no encontrada:', rutaImagen);
            }
          }
        }
      } catch (error) {
        console.error('Error eliminando imágenes físicas:', error);
      }
    }
}