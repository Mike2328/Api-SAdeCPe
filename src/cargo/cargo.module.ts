import { Module } from '@nestjs/common';
import { CargoService } from './service/cargo.service';
import { CargoController } from './controller/cargo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CargoEntity } from './entity/cargo-entity';
import { DepartamentEntity } from 'src/departament/entity/departament-entity';

@Module({
  imports: [TypeOrmModule.forFeature([CargoEntity,DepartamentEntity])],
  providers: [CargoService],
  controllers: [CargoController]
})
export class CargoModule {}
