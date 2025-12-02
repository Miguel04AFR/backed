import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUrl, IsOptional, IsArray } from "class-validator";

export class CreateRemodelacionDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    precio: number;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsString()
    @IsOptional()
    descripcionDetallada?: string;

    @IsArray()
    @IsString({ each: true }) // Cada elemento del array debe ser string
    @IsOptional()
    accesorios?: string[];

}