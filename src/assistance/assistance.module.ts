import { Module } from '@nestjs/common';
import { AssistanceService } from './service/assistance.service';
import { AssistanceController } from './controller/assistance.controller';

@Module({
  providers: [AssistanceService],
  controllers: [AssistanceController]
})
export class AssistanceModule {}
