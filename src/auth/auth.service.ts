import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../module/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService, // Agregar ConfigService
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

  // Generar tokens y configurar cookies
  async login(user: any, response: any) {
    const payload = { 
      gmail: user.gmail, 
      sub: user.id, 
      role: user.role.name 
    };
    
    // Generar tokens
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' } // Refresh token válido por 7 días
    );
    
    // Guardar refresh token en la base de datos
    await this.usersService.guardarRefreshToken(user.id, refreshToken);
    
    // Configurar cookies HTTP-Only
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    
    // Access Token (15 minutos)
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 25 * 60 * 60 * 1000,//25 horas
      path: '/',
    });
    
    // Refresh Token (7 días)
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      path: '/', 
    });
    
    // Retornar información del usuario (sin tokens)
    return {
      success: true,
      access_token: accessToken, 
    refresh_token: refreshToken,
      user: {
        id: user.id,
        nombre: user.nombre,
        gmail: user.gmail,
        role: user.role.name
      }
    };
  }

  // Hashear contrasenas 
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  // Refrescar access token
  async refreshAccessToken(refreshToken: string, response: any) {
    try {
      // Verificar refresh token
      const decoded = this.jwtService.verify(refreshToken);
      
      // Verificar que exista en la base de datos
      const user = await this.usersService.encontrarPorRefreshToken(refreshToken);
      
      if (!user) {
        throw new UnauthorizedException('Token de refresco inválido');
      }
      
      // Generar nuevo access token
      const newAccessToken = this.jwtService.sign({
        gmail: user.gmail, 
        sub: user.id, 
        role: user.role.name 
      });
      
      // Configurar nueva cookie de access token
      const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
      
      response.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 25 * 60 * 60 * 1000,
        path: '/',
      });
      
      return {
        success: true,
        access_token: newAccessToken,
        user: {
          id: user.id,
          nombre: user.nombre,
          gmail: user.gmail,
          role: user.role.name
        }
      };
      
    } catch (error) {
      throw new UnauthorizedException('Token de refresco expirado o inválido');
    }
  }

  // Logout
  async logout(userId: number, response: any) {
    // Eliminar refresh token de la base de datos
    await this.usersService.eliminarRefreshToken(userId);
    
    // Limpiar cookies
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    
    return { success: true };
  }
}