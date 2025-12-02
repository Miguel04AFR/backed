import { IsDate, IsEmail, isNotEmpty, IsNotEmpty, IsNumber, IsString, IsUrl, Length, MaxLength, MinLength } from 'class-validator';

export class CreateProyectoDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    titulo: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    descripcion: string;




}