import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class PaginacionQueryDto {

    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit?: number;//cantidad de elementos que se va a obtener

    @IsNumber()
    @IsPositive()
    @IsOptional()
    offset?: number;//cuantos elementos se vaan a saltar

}