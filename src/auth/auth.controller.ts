import { 
  Controller, 
  Post, 
  Body, 
  UnauthorizedException, 
  Req, 
  Res, 
  UseGuards,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import express from 'express';
import { JwtAuthGuard } from './auth.guard';

// Interfaz personalizada para Request con cookies
interface RequestWithCookies extends express.Request {
  cookies: {
    [key: string]: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: express.Response
  ) {
    const user = await this.authService.validateUser(
      loginDto.gmail, 
      loginDto.password
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    
    return this.authService.login(user, response);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() request: RequestWithCookies,
    @Res({ passthrough: true }) response: express.Response
  ) {
    //chaining para evitar errores
    const refreshToken = request.cookies?.['refresh_token'];
    
    if (!refreshToken) {
      throw new UnauthorizedException('Token de refresco no encontrado');
    }
    
    return this.authService.refreshAccessToken(refreshToken, response);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: any,
    @Res({ passthrough: true }) response: express.Response
  ) {
    // Verifica que el usuario esté autenticado
    if (!request.user?.userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    
    const userId: number = request.user.userId;
    return this.authService.logout(userId, response);
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async validateSession(@Req() request: any) {
    return {
      success: true,
      user: request.user
    };
  }
}