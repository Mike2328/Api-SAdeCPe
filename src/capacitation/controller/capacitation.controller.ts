import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';
import { CapacitationEntity } from '../entity/capacitation-entity';
import { CapacitationService } from '../service/capacitation.service';
import { BaseService } from 'src/base/base.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('capacitation')
export class CapacitationController extends BaseController<CapacitationEntity>{
    constructor(private capacitacionService: CapacitationService){
        super();
    }

    @Get("list")
    async findCaps(@Query() query){
        return await this.capacitacionService.findCaps(query);
    }

    @UseGuards(JwtAuthGuard)
    @Post("create")
    async createCap(@Body() entity){
        const entitySave = entity["data"] != undefined ? entity["data"] : entity;
        if(entitySave){
            return await this.capacitacionService.createCap(entity);
        }
        throw new NotFoundException(`No se pudo realizar la transaccion`);
    }

    @UseGuards(JwtAuthGuard)
    @Put("update")
    async updateCap(@Body() entity){
        const entitySave = entity["data"] != undefined ? entity["data"] : entity;
        if(entitySave){
            return await this.capacitacionService.updateCap(entity);
        }
        throw new NotFoundException(`No se pudo realizar la transaccion`);
    }

    @UseGuards(JwtAuthGuard)
    @Get("find/:id")
    async getOne(@Param("id") id: number){
        return await this.capacitacionService.getOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id:number){
        return await this.capacitacionService.delete(id);
    }

    getService(): BaseService<CapacitationEntity> {
        return this.capacitacionService;
    }

    @Get('preview/:name')
    async getImage(@Param('name') image: string, @Res({ passthrough: true }) response: Response){
        return await this.capacitacionService.returnImage(image, response);
    }
}