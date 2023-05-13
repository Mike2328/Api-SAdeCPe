import { Body, Get, HttpCode, HttpStatus, Param, Post, Delete, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { Put } from '@nestjs/common/decorators';
import { BaseService } from './base.service';
import { query } from 'express';

export abstract class BaseController<T> {
    abstract getService(): BaseService<T>;

    @Get()
    async findAll(@Query() query): Promise<T[]>{
        return await this.getService().findAll(query);
    }

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async save(@Body() entity: T): Promise<T> {
        const entitySave = entity["data"] != undefined ? entity["data"] : entity;
        if(entitySave){
            return await this.getService().save(entitySave);
        }
        throw new NotFoundException(`No se pudo realizar la transaccion`);
    }

    @Put('update')
    @HttpCode(HttpStatus.OK)
    async update(@Body() entity: T): Promise<T>{
        const entityUpdate = entity["data"] != undefined ? entity["data"] : entity;
        if(entityUpdate["id"] != undefined){
            return await this.getService().update(entityUpdate);
        }
        throw new NotFoundException(`No se pudo realizar la transaccion`);
    }

    @Post('save/many')
    @HttpCode(HttpStatus.CREATED)
    async saveMany(@Body() entities: T[]): Promise<T[]>{
        return await this.getService().saveMany(entities);
    }

    @Delete('delete/:id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id:any){
        const entity_found = await this.getService().findOne({ where: { id: id }});
        if(entity_found){
            return await this.getService().delete(id);
        }
        throw new NotFoundException(`El registro a eliminar no existe`);
    }
}