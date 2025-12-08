import { User } from "src/module/users/entity/user.entity"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { TipoMensaje } from "../enums/enums"

@Entity()
export class Mensaje {
    @Column({nullable:false})
    tipo: TipoMensaje

    @PrimaryGeneratedColumn('increment')
    id: number
    
     @Column({nullable:false})
    telefono: string

    @Column({nullable:false})
    gmail: string
    
     @Column({nullable:false})
    motivo: string

     @ManyToOne(type => User, user => user.mensajes, {
    onDelete: 'CASCADE'  // Solo esto es suficiente
  })
    @JoinColumn({ name: 'user_id' })
    user: User

    

}
