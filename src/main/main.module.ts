import { Module } from '@nestjs/common';
import { MainController } from './controller/main.controller';
import { MainService } from './service/main.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CapacitationEntity } from 'src/capacitation/entity/capacitation-entity';
import { OrgEntity } from 'src/organization/entity/org-entity';
import { CenterEntity } from 'src/center/entity/center-entity';
import { CollaboratorEntity } from 'src/collaborator/entity/collaborator-entity';

@Module({
  imports: [TypeOrmModule.forFeature([CapacitationEntity,OrgEntity,CenterEntity,CollaboratorEntity])],
  controllers: [MainController],
  providers: [MainService]
})
export class MainModule {}
