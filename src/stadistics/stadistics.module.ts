import { Module } from '@nestjs/common';
import { StadisticsService } from './service/stadistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CapSessionEntity } from 'src/cap_session/entity/cap_session-entity';
import { StadisticsController } from './controller/stadistics.controller';
import { DepartamentEntity } from 'src/departament/entity/departament-entity';
import { CargoEntity } from 'src/cargo/entity/cargo-entity';
import { CapacitationEntity } from 'src/capacitation/entity/capacitation-entity';
import { OrgEntity } from 'src/organization/entity/org-entity';

@Module({
  imports: [TypeOrmModule.forFeature([CapSessionEntity,DepartamentEntity,CargoEntity,CapacitationEntity,OrgEntity])],
  providers: [StadisticsService],
  controllers: [StadisticsController]
})
export class StadisticsModule {}