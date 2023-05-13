import { Module } from '@nestjs/common';
import { ApplicationService } from './service/application-service';
import { ApplicationController } from './controller/application-controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationEntity } from './entity/application-entity';

@Module({
    imports: [TypeOrmModule.forFeature([ApplicationEntity])],
    providers: [ApplicationService],
    controllers: [ApplicationController]
})
export class ApplicationModule {}
