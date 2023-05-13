import { Module } from '@nestjs/common';
import { StateService } from './service/state.service';
import { StateController } from './controller/state.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateEntity } from './entity/state-entity';
import { TypeStateEntity } from 'src/type-state/entity/type-state-entity';

@Module({
  imports: [TypeOrmModule.forFeature([StateEntity,TypeStateEntity])],
  providers: [StateService],
  controllers: [StateController]
})
export class StateModule {}
