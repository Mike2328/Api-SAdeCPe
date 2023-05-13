import { Body, Controller, Get, NotFoundException, Post, Query } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';
import { CapacitationEntity } from '../entity/capacitation-entity';
import { CapacitationService } from '../service/capacitation.service';
import { BaseService } from 'src/base/base.service';

@Controller('capacitation')
export class CapacitationController extends BaseController<CapacitationEntity>{
    constructor(private capacitacionService: CapacitationService){
        super();
    }

    @Get("list")
    async findCaps(@Query() query){
        return await this.capacitacionService.findCaps(query);
    }

    @Post("create")
    async createCap(@Body() entity){
        const entitySave = entity["data"] != undefined ? entity["data"] : entity;
        if(entitySave){
            return await this.capacitacionService.createCap(entity);
        }
        throw new NotFoundException(`No se pudo realizar la transaccion`);
    }

    getService(): BaseService<CapacitationEntity> {
        return this.capacitacionService;
    }
}