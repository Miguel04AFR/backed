//Jonny sino te funciona instalar dependencias :
//npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
//npm install @types/passport-jwt @types/bcrypt --save-dev

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../module/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Validar usuario al hacer login
    async validateUser(gmail: string, password: string): Promise<any> {
    const user = await this.usersService.encontrarPorGmail(gmail);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Genera un JWT 
    async login(user: any) {
    const payload = { gmail: user.gmail, sub: user.id, role: user.role.name };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nombre: user.nombre,
        gmail: user.gmail,
        role: user.role.name
      }
    };
  }

  // Hashear contraseñas al crear usuario
  async hashPassword(password: string): Promise<string> {//hashear es que hace que la contraseña sea irreconocible
    return await bcrypt.hash(password, 10);
  }
}