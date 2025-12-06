import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginacionQueryDto {

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    limit?: number;//cantidad de elementos que se va a obtener

    @IsNumber()
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    offset?: number;//cuantos elementos se vaan a saltar

}