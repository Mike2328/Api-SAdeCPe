import { Module } from '@nestjs/common';
import { PriorityService } from './service/priority.service';
import { PriorityController } from './controller/priority.controller';
import { PriorityEntity } from './entity/priority-entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PriorityEntity])],
  providers: [PriorityService],
  controllers: [PriorityController]
})
export class PriorityModule {}
