import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { TrainerService } from '../service/trainer.service';
import { BaseController } from 'src/base/base.controller';
import { TrainerEntity } from '../entity/trainer-entity';
import { BaseService } from 'src/base/base.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('trainer')
export class TrainerController extends BaseController<TrainerEntity>{
    constructor(private readonly trainerService: TrainerService){
        super();
    }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    async save(@Body() entity: TrainerEntity): Promise<TrainerEntity> {
        const entitySave = entity["data"] != undefined ? entity["data"] : entity;
        if(entitySave){
            return await this.trainerService.saveTrainer(entitySave);
        }
        throw new NotFoundException(`No se pudo realizar la transaccion`);
    }

    @UseGuards(JwtAuthGuard)
    @Put('update')
    @HttpCode(HttpStatus.OK)
    async update(@Body() entity: TrainerEntity): Promise<TrainerEntity>{
        const entityUpdate = entity["data"] != undefined ? entity["data"] : entity;
        if(entityUpdate["id"] != undefined){
            return await this.trainerService.updateTrainer(entityUpdate);
        }
        throw new NotFoundException(`No se pudo realizar la transaccion`);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id:number){
        return await this.trainerService.delete(id);
    }

    getService(): BaseService<TrainerEntity> {
        return this.trainerService;
    }

    @UseGuards(JwtAuthGuard)
    @Get("list")
    async findTrainers(@Query() query){
        return await this.trainerService.findTrainers(query);
    }

    @Get('preview/:name')
    async getImage(@Param('name') image: string, @Res({ passthrough: true }) response: Response){
        return await this.trainerService.returnImage(image, response);
    }
}