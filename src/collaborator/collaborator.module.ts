import { Module } from '@nestjs/common';
import { CollaboratorService } from './service/collaborator.service';
import { CollaboratorController } from './controller/collaborator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollaboratorEntity } from './entity/collaborator-entity';
import { CapacitationEntity } from 'src/capacitation/entity/capacitation-entity';
import { AssistanceEntity } from 'src/assistance/entity/assistance-entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollaboratorEntity,CapacitationEntity,AssistanceEntity])],
  providers: [CollaboratorService,],
  controllers: [CollaboratorController]
})
export class CollaboratorModule {}
