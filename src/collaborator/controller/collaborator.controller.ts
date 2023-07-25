import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';
import { CollaboratorEntity } from '../entity/collaborator-entity';
import { CollaboratorService } from '../service/collaborator.service';
import { BaseService } from 'src/base/base.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('collaborator')
export class CollaboratorController extends BaseController<CollaboratorEntity>{
    constructor(private readonly collaboratorService: CollaboratorService){
        super();
    }

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async save(@Body() entity: CollaboratorEntity): Promise<CollaboratorEntity> {
        const entitySave = entity["data"] != undefined ? entity["data"] : entity;
        if(entitySave){
            return await this.collaboratorService.saveCol(entitySave);
        }
        throw new NotFoundException(`No se pudo realizar la transaccion`);
    }

    @Put('update')
    @HttpCode(HttpStatus.OK)
    async update(@Body() entity: CollaboratorEntity): Promise<CollaboratorEntity>{
        const entityUpdate = entity["data"] != undefined ? entity["data"] : entity;
        if(entityUpdate["id"] != undefined){
            return await this.collaboratorService.updateCol(entityUpdate);
        }
        throw new NotFoundException(`No se pudo realizar la transaccion`);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id:number){
        return await this.collaboratorService.delete(id);
    }

    getService(): BaseService<CollaboratorEntity> {
        return this.collaboratorService;
    }

    @UseGuards(JwtAuthGuard)
    @Get("list")
    async findcollaborators(@Query() query){
        return await this.collaboratorService.findcollaborators(query);
    }

    @UseGuards(JwtAuthGuard)
    @Get("findOne/:id")
    async findcollaborator(@Param("id") id: number){
        return await this.collaboratorService.findOne(id);
    }

    @Get('preview/:name')
    async getImage(@Param('name') image: string, @Res({ passthrough: true }) response: Response){
        return await this.collaboratorService.returnImage(image, response);
    }
}