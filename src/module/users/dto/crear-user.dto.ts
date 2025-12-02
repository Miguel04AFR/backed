/* dto significa data tranfer object*/

import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  gmail: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  apellido: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  telefono: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date) //transforma string a Date(epico)
  fechaNacimiento: Date;


}
