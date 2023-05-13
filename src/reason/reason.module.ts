import { Module } from '@nestjs/common';
import { ReasonService } from './service/reason.service';
import { ReasonController } from './controller/reason.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReasonEntity } from './entity/reason-entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReasonEntity])],
  providers: [ReasonService],
  controllers: [ReasonController]
})
export class ReasonModule {}
