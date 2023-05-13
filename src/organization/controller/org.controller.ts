import { Controller, Get, Query } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';
import { OrgEntity } from '../entity/org-entity';
import { OrgService } from '../service/org-service.service';
import { BaseService } from 'src/base/base.service';

@Controller('org')
export class OrgController extends BaseController<OrgEntity>{
    constructor(private readonly orgService: OrgService){
        super();
    }

    getService(): BaseService<OrgEntity> {
        return this.orgService;
    }

    @Get("list")
    async findOrg(@Query() query){
        return await this.orgService.findOrg(query);
    }
}