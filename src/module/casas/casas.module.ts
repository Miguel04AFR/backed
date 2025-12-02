import { Module } from '@nestjs/common';
import { CasasService } from './casas.service';
import { CasasController } from './casas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Casa } from './entities/casa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Casa])],
  controllers: [CasasController],
  providers: [CasasService],
})
export class CasasModule {}
