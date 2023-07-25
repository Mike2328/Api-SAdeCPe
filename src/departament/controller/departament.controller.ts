import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { DepartamentService } from '../service/departament.service';
import { BaseService } from 'src/base/base.service';
import { BaseController } from 'src/base/base.controller';
import { DepartamentEntity } from '../entity/departament-entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('departament')
export class DepartamentController extends BaseController<DepartamentEntity>{
    constructor(private readonly departamentService: DepartamentService){
        super();
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id:number){
        return await this.departamentService.delete(id);
    }

    getService(): BaseService<DepartamentEntity> {
        return this.departamentService;
    }

    @UseGuards(JwtAuthGuard)
    @Get("list")
    async findDepartaments(@Query() query){
        return await this.departamentService.findDepartaments(query);
    }
}