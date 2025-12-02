import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Mensaje } from '../mensajes/entities/mensaje.entity';
import { Role } from '../roles/entity/role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Mensaje, Role])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
