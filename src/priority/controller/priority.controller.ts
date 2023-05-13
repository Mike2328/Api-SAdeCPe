import { Controller, Get, Query } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';
import { BaseService } from 'src/base/base.service';
import { PriorityEntity } from '../entity/priority-entity';
import { PriorityService } from '../service/priority.service';

@Controller('priority')
export class PriorityController extends BaseController<PriorityEntity>{
    constructor(private readonly priorityService: PriorityService){
        super();
    }

    getService(): BaseService<PriorityEntity> {
        return this.priorityService;
    }

    @Get("list")
    async findPrioritys(@Query() query){
        return await this.priorityService.findPrioritys(query);
    }
}