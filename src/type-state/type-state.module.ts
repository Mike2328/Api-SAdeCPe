import { Module } from '@nestjs/common';
import { TypeStateService } from './service/type-state.service';
import { TypeStateController } from './controller/type-state.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeStateEntity } from './entity/type-state-entity';
import { StateEntity } from 'src/state/entity/state-entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeStateEntity,StateEntity])],
  providers: [TypeStateService],
  controllers: [TypeStateController]
})
export class TypeStateModule {}
