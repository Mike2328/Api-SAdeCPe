import { Body, Get, HttpCode, HttpStatus, Param, Post, Delete, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { Put } from '@nestjs/common/decorators';
import { BaseService } from './base.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

export abstract class BaseController<T> {
    abstract getService(): BaseService<T>;

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Query() query): Promise<T[]>{
        return await this.getService().findAll(query);
    }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async save(@Body() entity: T): Promise<T> {
        const entitySave = entity["data"] != undefined ? entity["data"] : entity;
        if(entitySave){
            return await this.getService().save(entitySave);
        }
        throw new NotFoundException(`No se pudo realizar la transaccion`);
    }

    @UseGuards(JwtAuthGuard)
    @Put('update')
    @HttpCode(HttpStatus.OK)
    async update(@Body() entity: T): Promise<T>{
        const entityUpdate = entity["data"] != undefined ? entity["data"] : entity;
        if(entityUpdate["id"] != undefined){
            return await this.getService().update(entityUpdate);
        }
        throw new NotFoundException(`No se pudo realizar la transaccion`);
    }

    @UseGuards(JwtAuthGuard)
    @Post('save/many')
    @HttpCode(HttpStatus.CREATED)
    async saveMany(@Body() entities: T[]): Promise<T[]>{
        return await this.getService().saveMany(entities);
    }
}