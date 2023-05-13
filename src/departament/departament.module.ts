import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartamentService } from './service/departament.service';
import { DepartamentController } from './controller/departament.controller';
import { DepartamentEntity } from './entity/departament-entity';
import { CargoEntity } from 'src/cargo/entity/cargo-entity';
import { CargoService } from 'src/cargo/service/cargo.service';
import { CargoController } from 'src/cargo/controller/cargo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DepartamentEntity,CargoEntity])],
  providers: [DepartamentService,CargoService],
  controllers: [DepartamentController,CargoController]
})
export class DepartamentModule {}