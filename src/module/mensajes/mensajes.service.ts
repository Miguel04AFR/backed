import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { UpdateMensajeDto } from './dto/update-mensaje.dto';
import { Repository } from 'typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';

@Injectable()
export class MensajesService {

  constructor(@InjectRepository(Mensaje) 
  private readonly mensajeRepository: Repository<Mensaje>,
  @InjectRepository(User)
  private readonly usersRepository: Repository<User>
) {}

  async createMensaje(createMensajeDto: CreateMensajeDto,token: any): Promise<Mensaje> {
    const user = await this.usersRepository.findOne({ 
        where: [
            { id: token.id },
            { id: token.userId },
            { id: token.sub }
        ]
    });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado con token: ' + JSON.stringify(token));
    }

    const nuevoMensaje = this.mensajeRepository.create({
      ...createMensajeDto, //lo pongo asi porque necesita al usaurio ,jonny recuerda que el ... es para destructural un objeto
      user: user
    } as Mensaje); //el as me lo pide sino no sabe el tipo de dato que es
    return await this.mensajeRepository.save(nuevoMensaje);
  }

   async getMensajes(): Promise<Mensaje[]> {
    return await this.mensajeRepository.find({ relations: ['user']});
  }

    async buscarMensjae(id: number): Promise<Mensaje> {
    const enc = await  this.mensajeRepository.findOne({ where: { id },  relations: ['user']});

    if (!enc) {
                throw new NotFoundException(`Mensaje con ID ${id} no encontrado`);
            }
            return enc;

  }

  /*update(id: number, updateMensajeDto: UpdateMensajeDto) {
    return `This action updates a #${id} mensaje`;
  }*/

  async remove(id: number): Promise<void>  {
     const enc = await  this.mensajeRepository.findOne({ where: { id }});

    if (!enc) {
                throw new NotFoundException(`Mensaje con ID ${id} no encontrado`);
            }
      this.mensajeRepository.delete(id);
    
  }
}
