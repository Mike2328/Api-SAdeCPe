import { Module } from '@nestjs/common';
import { CapSessionService } from './service/cap_session.service';
import { CapSessionController } from './controller/cap_session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CapSessionEntity } from './entity/cap_session-entity';

@Module({
  imports: [TypeOrmModule.forFeature([CapSessionEntity])],
  providers: [CapSessionService],
  controllers: [CapSessionController]
})
export class CapSessionModule {}
