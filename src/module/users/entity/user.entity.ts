import { Mensaje } from "src/module/mensajes/entities/mensaje.entity";
import { Role } from "src/module/roles/entity/role.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity( 


)
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({nullable:false})
  nombre: string;

   @Column({nullable:false})
  apellido : string;

   @Column({nullable:false})
  fechaNacimiento : Date;

   @Column({nullable:false})
  telefono : string;

   @Column({nullable:false})
  gmail: string;

   @Column({nullable:false})
  password: string;

  @OneToMany(type => Mensaje,mensaje => mensaje.user )
    mensajes: Mensaje[];

  @Column({ 
    name: 'refresh_token', // Para postgrest usa snake_case
    nullable: true 
  })
  refreshToken: string;

  @Column({ 
    name: 'token_updated_at',
    type: 'timestamp', 
    nullable: true 
  })
  tokenUpdatedAt: Date;


  @ManyToOne(() => Role, { eager: true }) // eager: true carga el rol automáticamente
  @JoinColumn({ name: 'role_id' })
  role: Role;

    @CreateDateColumn()
  createdAt: Date;   // Se llena automáticamente al crear el registro

  @UpdateDateColumn()
  updatedAt: Date;   // Se actualiza automáticamente al modificar el registro

  //los dos ultimos es para cuadno modifiquen o creen un usuario se guarde las fechas
}

