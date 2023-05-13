import { Controller, Get, Query } from '@nestjs/common';
import { DepartamentService } from '../service/departament.service';
import { BaseService } from 'src/base/base.service';
import { BaseController } from 'src/base/base.controller';
import { DepartamentEntity } from '../entity/departament-entity';

@Controller('departament')
export class DepartamentController extends BaseController<DepartamentEntity>{
    constructor(private readonly departamentService: DepartamentService){
        super();
    }

    getService(): BaseService<DepartamentEntity> {
        return this.departamentService;
    }

    @Get("list")
    async findDepartaments(@Query() query){
        return await this.departamentService.findDepartaments(query);
    }
}