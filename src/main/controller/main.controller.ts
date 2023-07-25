import { Controller, Get, Param, Query } from '@nestjs/common';
import { MainService } from '../service/main.service';
import { query } from 'express';

@Controller('home')
export class MainController {
    constructor(private mainService: MainService){}

    @Get("capacitation")
    async findCaps(@Query() query){
        return await this.mainService.findCaps(query);
    }

    @Get("org")
    async findOrg(@Query() query){
        return await this.mainService.findOrg(query);
    }

    @Get("center")
    async findCenters(@Query() query){
        return await this.mainService.findCenters(query);
    }

    @Get("collaborator")
    async findCollaborators(@Query() query){
        return await this.mainService.findcollaborators(query);
    }

    @Get("collaborator/findOne/:id")
    async findcollaborator(@Param("id") id: number){
        return await this.mainService.findOne(id);
    }

    @Get("info-col/:id")
    async getinfoCol(@Param("id") id: number){
        return await this.mainService.getinfoCol(id);
    }

    @Get("info-cap-col/:id")
    async getInfoCapCol(@Param("id") id: number){
        return await this.mainService.getInfoCapCol(id);
    }
}
