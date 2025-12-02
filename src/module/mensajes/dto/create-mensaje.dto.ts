import { IsNotEmpty, IsObject, IsString } from "class-validator"
import { User } from "src/module/users/entity/user.entity"

export class CreateMensajeDto {
    
    @IsString()
    @IsNotEmpty()
    tipo: string;
     @IsString()
    @IsNotEmpty()
    telefono: string;
    @IsString()
    @IsNotEmpty()
    gmail: string;
    @IsString()
    @IsNotEmpty()
    motivo: string;


}
