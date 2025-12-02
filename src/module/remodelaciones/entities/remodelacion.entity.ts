import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Remodelacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    nombre: string;

    @Column({nullable: false })
    precio: number;

    @Column({nullable: false })
    descripcion: string;

    @Column({nullable: true })
    descripcionDetallada: string;

     @Column("simple-array",  { nullable: true })// guarda por comas las url
    imagenUrl: string[];

  @Column('simple-array', { nullable: true })
  accesorios: string[];
}