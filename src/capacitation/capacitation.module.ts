import { Module } from '@nestjs/common';
import { CapacitationService } from './service/capacitation.service';
import { CapacitationController } from './controller/capacitation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CapacitationEntity } from './entity/capacitation-entity';
import { ReasonEntity } from 'src/reason/entity/reason-entity';
import { TagEntity } from 'src/tag/entity/tag-entity';
import { CapSessionEntity } from 'src/cap_session/entity/cap_session-entity';
import { AssistanceEntity } from 'src/assistance/entity/assistance-entity';
import { CapTagsEntity } from 'src/cap_tags/entity/cap_tags-entity';

@Module({
  imports: [TypeOrmModule.forFeature([CapacitationEntity,TagEntity,CapSessionEntity,AssistanceEntity,CapTagsEntity])],
  providers: [CapacitationService],
  controllers: [CapacitationController]
})
export class CapacitationModule {}
