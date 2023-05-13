import { Module } from '@nestjs/common';
import { CollaboratorService } from './service/collaborator.service';
import { CollaboratorController } from './controller/collaborator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollaboratorEntity } from './entity/collaborator-entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollaboratorEntity])],
  providers: [CollaboratorService,],
  controllers: [CollaboratorController]
})
export class CollaboratorModule {}
