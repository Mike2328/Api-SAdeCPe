import { Module } from '@nestjs/common';
import { TagService } from './service/tag.service';
import { TagController } from './controller/tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './entity/tag-entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  providers: [TagService],
  controllers: [TagController]
})
export class TagModule {}
