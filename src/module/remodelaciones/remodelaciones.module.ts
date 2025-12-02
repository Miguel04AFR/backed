import { Module } from '@nestjs/common';
import { RemodelacionesService } from './remodelaciones.service';
import { RemodelacionesController } from './remodelaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Remodelacion } from './entities/remodelacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Remodelacion])],
  controllers: [RemodelacionesController],
  providers: [RemodelacionesService],
})
export class RemodelacionesModule {}
