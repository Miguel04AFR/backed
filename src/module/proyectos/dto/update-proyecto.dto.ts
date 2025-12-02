import { PartialType } from '@nestjs/mapped-types';
import { CreateProyectoDto  } from './crear-proyecto.dto';

export class UpdateProyectoDto extends PartialType(CreateProyectoDto) {
titulo?: string;
descripcion?: string;

}