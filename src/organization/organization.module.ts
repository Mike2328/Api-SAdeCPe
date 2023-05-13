import { Module } from '@nestjs/common';
import { OrgService } from './service/org-service.service';
import { OrgController } from './controller/org.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrgEntity } from './entity/org-entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrgEntity])],
  providers: [OrgService],
  controllers: [OrgController]
})
export class OrganizationModule {}
