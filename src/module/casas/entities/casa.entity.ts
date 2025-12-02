import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Casa {
    @PrimaryGeneratedColumn('increment')
     id: string;
    @Column({nullable:false})
    nombre: string;

    @Column("simple-array",  { nullable: true })// guarda por comas las url
    imagenUrl: string[];

    @Column({nullable:false})
    precio: number;
    @Column({nullable:false})
    ubicacion: string;
    @Column({nullable:false})
    habitaciones: number;
    @Column({nullable:false})
    banos: number;
    @Column({nullable:false})
    metrosCuadrados: number;
    @Column({nullable:false})
    descripcion: string;
}
