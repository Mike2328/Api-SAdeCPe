import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StadisticsService } from '../service/stadistics.service';
import { query } from 'express';

@Controller('stadistics')
export class StadisticsController {
    constructor(private stadisticsService: StadisticsService){}

    // @UseGuards(JwtAuthGuard)
    @Get("comp-year")
    async getCompYear(){
        return await this.stadisticsService.getCompYear();
    }

    @Get("cap-dep")
    async getCapDep(){
        return await this.stadisticsService.getCapDep();
    }

    @Get("cap-org")
    async getCapOrg(@Query() query){
        return await this.stadisticsService.getCapOrg(query);
    }

    @Get("cap-schedule")
    async getCapCar(@Query() query){
        return await this.stadisticsService.getCapCar(query);
    }

    @Get("info-col/:id")
    async getinfoCol(@Param("id") id: number){
        return await this.stadisticsService.getinfoCol(id);
    }

    @Get("info-cap-col/:id")
    async getInfoCapCol(@Param("id") id: number){
        return await this.stadisticsService.getInfoCapCol(id);
    }

    @Get("costs")
    async getCostInfo(){
        return await this.stadisticsService.getCostInfo();
    }

    @Get("training-effectiveness")
    async getEffectiveOrg(){
        return await this.stadisticsService.getEffectiveOrg();
    }
}