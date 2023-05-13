import { Controller, Get, Query } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';
import { ReasonEntity } from '../entity/reason-entity';
import { ReasonService } from '../service/reason.service';
import { BaseService } from 'src/base/base.service';

@Controller('reason')
export class ReasonController extends BaseController<ReasonEntity>{
    constructor(private readonly reasonService: ReasonService){
        super();
    }

    getService(): BaseService<ReasonEntity> {
        return this.reasonService;
    }

    @Get("list")
    async findReasons(@Query() query){
        return await this.reasonService.findReasons(query);
    }
}