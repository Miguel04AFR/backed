import { PartialType } from '@nestjs/mapped-types';
import { CreateCasaDto } from './create-casa.dto';

export class UpdateCasaDto extends PartialType(CreateCasaDto) {
    nombre?: string;
    precio?: number;
    ubicacion?: string;
    habitaciones?: number;
    banos?: number;
    metrosCuadrados?: number;
    descripcion?: string;

}
