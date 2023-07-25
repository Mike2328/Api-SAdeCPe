import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';
import { BaseService } from 'src/base/base.service';
import { CenterEntity } from '../entity/center-entity';
import { CenterService } from '../service/center.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('center')
export class CenterController extends BaseController<CenterEntity>{
    constructor(private readonly centerService: CenterService){
        super();
    }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async save(@Body() entity: CenterEntity): Promise<CenterEntity> {
        const entitySave = entity["data"] != undefined ? entity["data"] : entity;
        if(entitySave){
            return await this.centerService.saveCenter(entitySave);
        }
        throw new NotFoundException(`No se pudo realizar la transaccion`);
    }

    @UseGuards(JwtAuthGuard)
    @Put('update')
    @HttpCode(HttpStatus.OK)
    async update(@Body() entity: CenterEntity): Promise<CenterEntity>{
        const entityUpdate = entity["data"] != undefined ? entity["data"] : entity;
        if(entityUpdate["id"] != undefined){
            return await this.centerService.saveCenter(entityUpdate);
        }
        throw new NotFoundException(`No se pudo realizar la transaccion`);
    }

    getService(): BaseService<CenterEntity> {
        return this.centerService;
    }

    @UseGuards(JwtAuthGuard)
    @Get("list")
    async findCenters(@Query() query){
        return await this.centerService.findCenters(query);
    }

    @Get('preview/:name')
    async getImage(@Param('name') image: string, @Res({ passthrough: true }) response: Response){
        return await this.centerService.returnImage(image, response);
    }
}