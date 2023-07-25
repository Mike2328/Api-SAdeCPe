import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { CargoService } from '../service/cargo.service';
import { BaseService } from 'src/base/base.service';
import { BaseController } from 'src/base/base.controller';
import { CargoEntity } from '../entity/cargo-entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('employees-position')
export class CargoController extends BaseController<CargoEntity>{
    constructor(private readonly cargoService: CargoService){
        super();
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id:number){
        return await this.cargoService.delete(id);
    }

    getService(): BaseService<CargoEntity> {
        return this.cargoService;
    }

    @UseGuards(JwtAuthGuard)
    @Get("list")
    async findEmployerPossitions(@Query() query){
        return await this.cargoService.findEmployerPossitions(query);
    }
}