import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {//el data es la direccion o el dato que le pasas al decorador,cuando buscas la direccion en el postman
    const request = ctx.switchToHttp().getRequest();
    return request.user; // Esto viene del JwtStrategy
  },
);