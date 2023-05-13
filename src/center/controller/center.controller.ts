import { Controller, Get, Query } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';
import { BaseService } from 'src/base/base.service';
import { CenterEntity } from '../entity/center-entity';
import { CenterService } from '../service/center.service';

@Controller('center')
export class CenterController extends BaseController<CenterEntity>{
    constructor(private readonly centerService: CenterService){
        super();
    }

    getService(): BaseService<CenterEntity> {
        return this.centerService;
    }

    @Get("list")
    async findCenters(@Query() query){
        return await this.centerService.findCenters(query);
    }
}