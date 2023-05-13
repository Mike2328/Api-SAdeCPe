import { Controller, Get, Query } from '@nestjs/common';
import { CargoService } from '../service/cargo.service';
import { BaseService } from 'src/base/base.service';
import { BaseController } from 'src/base/base.controller';
import { CargoEntity } from '../entity/cargo-entity';

@Controller('employees-position')
export class CargoController extends BaseController<CargoEntity>{
    constructor(private readonly cargoService: CargoService){
        super();
    }

    getService(): BaseService<CargoEntity> {
        return this.cargoService;
    }

    @Get("list")
    async findEmployerPossitions(@Query() query){
        return await this.cargoService.findEmployerPossitions(query);
    }
}