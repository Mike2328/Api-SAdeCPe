import { Module } from '@nestjs/common';
import { TrainerService } from './service/trainer.service';
import { TrainerController } from './controller/trainer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainerEntity } from './entity/trainer-entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainerEntity])],
  providers: [TrainerService],
  controllers: [TrainerController]
})
export class TrainerModule {}
