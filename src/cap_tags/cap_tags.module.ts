import { Module } from '@nestjs/common';
import { CapTagsService } from './service/cap_tags.service';
import { CapTagsController } from './controller/cap_tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CapTagsEntity } from './entity/cap_tags-entity';

@Module({
  imports: [TypeOrmModule.forFeature([CapTagsEntity])],
  providers: [CapTagsService],
  controllers: [CapTagsController]
})
export class CapTagsModule {}
