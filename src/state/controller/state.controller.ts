import { Controller, Get, Query } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';
import { BaseService } from 'src/base/base.service';
import { StateEntity } from '../entity/state-entity';
import { StateService } from '../service/state.service';

@Controller('state')
export class StateController extends BaseController<StateEntity>{
    constructor(private readonly stateService: StateService){
        super();
    }

    getService(): BaseService<StateEntity> {
        return this.stateService;
    }

    @Get("list")
    async findStates(@Query() query){
        return await this.stateService.findStates(query);
    }
}