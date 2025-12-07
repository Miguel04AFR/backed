import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    
    if (!jwtSecret) {
      throw new UnauthorizedException('JWT_SECRET no está configurado');
    }
    
    super({
      // Leer token de cookie en lugar de header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          // Intentar obtener de cookies primero
          if (request?.cookies?.access_token) {
            return request.cookies.access_token;
          }
          
          // Fallback a header (para compatibilidad)
          return ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      gmail: payload.gmail, 
      role: { name: payload.role } 
    };
  }
}