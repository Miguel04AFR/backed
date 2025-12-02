import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './module/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProjectosModule } from './module/proyectos/proyectos.module';
import { CasasModule } from './module/casas/casas.module';
import { RemodelacionesModule } from './module/remodelaciones/remodelaciones.module';
import { MensajesModule } from './module/mensajes/mensajes.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { RolesController } from './module/roles/roles.controller';
import { RolesService } from './module/roles/roles.service';
import { RolesModule } from './module/roles/roles.module';
import { HealthController } from './health/health/health.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.local',}),//con esto las variable de enterno funciona en todos lados  
    AuthModule,UsersModule, ProjectosModule, CasasModule,DatabaseModule,
     ProjectosModule, RemodelacionesModule, MensajesModule, DatabaseModule, RolesModule, 
  ],
  controllers: [AppController, RolesController, HealthController],
  providers: [AppService, RolesService],//para esto jonny tieenes que descargar las dependencias del typeorm
})
export class AppModule {
  static port: number;
  constructor(private readonly configService: ConfigService){
    AppModule.port = +this.configService.get('PORT');
//con ese + castea para que se number por si acaso
  }
}
