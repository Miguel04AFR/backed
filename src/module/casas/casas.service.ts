import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCasaDto } from './dto/create-casa.dto';
import { UpdateCasaDto } from './dto/update-casa.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Casa } from './entities/casa.entity';
import { PaginacionQueryDto } from './dto/paginacion-query.dto';
import { take } from 'rxjs';

@Injectable()
export class CasasService {

  constructor(@InjectRepository(Casa) 
  private casaRepository: Repository<Casa>,){}

  async create(createCasaDto: CreateCasaDto): Promise<Casa> {
    const casa = this.casaRepository.create(createCasaDto);
    return await this.casaRepository.save(casa);

  }

  async getCasas(): Promise<Casa[]> {
    return await this.casaRepository.find();
  }

  async getCasasPag({limit , offset}: PaginacionQueryDto): Promise<Casa[]> {
    return await this.casaRepository.find({ skip: offset, take: limit });
  }

  async buscarCasa(id: string): Promise<Casa> {
    const casa = await this.casaRepository.findOne({ where: { id } });

      if (!casa) {
          throw new NotFoundException(`Casa con ID ${id} no encontrado`);
        }
        
        return casa;
      }
  

  async update(id: string, updateCasaDto: UpdateCasaDto): Promise<Casa> {
 const casa = await this.casaRepository.findOne({ where: { id } });

      if (!casa) {
          throw new NotFoundException(`Casa con ID ${id} no encontrado`);
        }

        await this.casaRepository.update(id, updateCasaDto);
        return await this.buscarCasa(id);
  }

 async  remove(id: string): Promise<void> {
    const casa = await this.casaRepository.findOne({ where: { id } });

      if (!casa) {
          throw new NotFoundException(`Casa con ID ${id} no encontrado`);
        }
        
          if ( casa.imagenUrl.length > 0) {
    await this.eliminarImagenesFisicas(casa.imagenUrl);
  }       
      await  this.casaRepository.delete(id)

  }

  async crearCasaConImagenes(
  createCasaDto: CreateCasaDto,
  imagenes: Express.Multer.File[],
): Promise<Casa> {
  
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
    const nombreArchivo = `casa-${timestamp}-${random}.${extension}`;
    
    const rutaImagen = `/uploads/casas/${nombreArchivo}`;

    // Guardar cada imagen
    const fs = require('fs');
    const path = require('path');
    
    const uploadsDir = path.join(process.cwd(), 'uploads', 'casas');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(uploadsDir, nombreArchivo), imagen.buffer);
    
    rutasImagenes.push(rutaImagen);
  }

  const casa = this.casaRepository.create({
    ...createCasaDto,
    imagenUrl: rutasImagenes, // Array con todas las rutas
  });

  return await this.casaRepository.save(casa);
}


private async eliminarImagenesFisicas(imagenesUrl: string[]): Promise<void> {
  try {
    const fs = require('fs');
    const path = require('path');
    

    for (const imagenUrl of imagenesUrl) {
      const nombreArchivo = imagenUrl.split('/').pop();
      
      if (nombreArchivo) {
        const rutaImagen = path.join(process.cwd(), 'uploads', 'casas', nombreArchivo);
        
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
