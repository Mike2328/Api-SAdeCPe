import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';
import { BaseService } from 'src/base/base.service';
import { StateEntity } from '../entity/state-entity';
import { StateService } from '../service/state.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('state')
export class StateController extends BaseController<StateEntity>{
    constructor(private readonly stateService: StateService){
        super();
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id:number){
        return await this.stateService.delete(id);
    }

    getService(): BaseService<StateEntity> {
        return this.stateService;
    }

    @UseGuards(JwtAuthGuard)
    @Get("list")
    async findStates(@Query() query){
        return await this.stateService.findStates(query);
    }
}