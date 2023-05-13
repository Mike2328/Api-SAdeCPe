import { Module } from '@nestjs/common';
import { CenterService } from './service/center.service';
import { CenterController } from './controller/center.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CenterEntity } from './entity/center-entity';

@Module({
  imports: [TypeOrmModule.forFeature([CenterEntity])],
  providers: [CenterService],
  controllers: [CenterController]
})
export class CenterModule {}
