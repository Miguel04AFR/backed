import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUrl } from "class-validator";

export class CreateCasaDto {

      @IsString()
      @IsNotEmpty()
    nombre: string;


    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))//por si me llegan como string
    @IsPositive()
    precio: number;
    
        @IsString()
      @IsNotEmpty()
    ubicacion: string;

    @Transform(({ value }) => parseInt(value))
    @IsNotEmpty()
    @IsNumber()
    habitaciones: number;

    @Transform(({ value }) => parseInt(value))
    @IsNotEmpty()
    @IsNumber()
    banos: number;

    @Transform(({ value }) => parseInt(value))
    @IsNotEmpty()
    @IsNumber()
    metrosCuadrados: number;

    @IsString()
    @IsNotEmpty()
    descripcion: string;
}


