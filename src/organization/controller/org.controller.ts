import { Controller, Get, Post, Put, Param, Query, Res, HttpStatus, Body, NotFoundException, HttpCode, UseGuards, Delete } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';
import { OrgEntity } from '../entity/org-entity';
import { OrgService } from '../service/org-service.service';
import { BaseService } from 'src/base/base.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('org')
export class OrgController extends BaseController<OrgEntity>{
    constructor(private readonly orgService: OrgService){
        super();
    }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async save(@Body() entity: OrgEntity): Promise<OrgEntity> {
        const entitySave = entity["data"] != undefined ? entity["data"] : entity;
        if(entitySave){
            return await this.orgService.saveOrg(entitySave);
        }
        throw new NotFoundException(`No se pudo realizar la transaccion`);
    }

    @UseGuards(JwtAuthGuard)
    @Put('update')
    @HttpCode(HttpStatus.OK)
    async update(@Body() entity: OrgEntity): Promise<OrgEntity>{
        const entityUpdate = entity["data"] != undefined ? entity["data"] : entity;
        if(entityUpdate["id"] != undefined){
            return await this.orgService.updateOrg(entityUpdate);
        }
        throw new NotFoundException(`No se pudo realizar la transaccion`);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id:number){
        return await this.orgService.delete(id);
    }

    getService(): BaseService<OrgEntity> {
        return this.orgService;
    }

    @Get("list")
    async findOrg(@Query() query){
        return await this.orgService.findOrg(query);
    }

    @Get('preview/:name')
    async getImage(@Param('name') image: string, @Res({ passthrough: true }) response: Response){
        return await this.orgService.returnImage(image, response);
    }
}