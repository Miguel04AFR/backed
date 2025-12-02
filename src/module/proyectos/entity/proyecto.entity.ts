import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity(
    
)
export class Proyecto {

@PrimaryGeneratedColumn()
 id: number;


 @Column()
imagenUrl: string;  
 @Column()
titulo: string;
 @Column('text') // Para descripciones largas
 descripcion: string;




}