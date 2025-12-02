import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()//wuapo te preguntaras para que es esto ,si ya thay decorador de rols para saber si es admin ,pero si ponemos otro rol ,esto sirve
export class RoleGuard implements CanActivate {//para verificar si los metadatos son iguales y si queremos poner mas roles 
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    return user?.role && requiredRoles.includes(user.role.name);
  }
}

