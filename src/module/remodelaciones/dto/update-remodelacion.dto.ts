import { PartialType } from '@nestjs/mapped-types';
import { CreateRemodelacionDto } from './create-remodelacion.dto';

export class UpdateRemodelacionDto extends PartialType(CreateRemodelacionDto) {
    nombre?: string;
    precio?: number;
    descripcion?: string;
    descripcionDetallada?: string;
    accesorios?: string[];


}
