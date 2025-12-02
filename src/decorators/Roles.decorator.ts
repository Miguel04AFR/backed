import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
//el metaData sirve para que cuando se active el guard sepa que rol se necesita para acceder a esa ruta