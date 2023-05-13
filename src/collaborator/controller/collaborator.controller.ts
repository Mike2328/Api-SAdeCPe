import { Controller, Get, Param, Query } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';
import { CollaboratorEntity } from '../entity/collaborator-entity';
import { CollaboratorService } from '../service/collaborator.service';
import { BaseService } from 'src/base/base.service';

@Controller('collaborator')
export class CollaboratorController extends BaseController<CollaboratorEntity>{
    constructor(private readonly collaboratorService: CollaboratorService){
        super();
    }

    getService(): BaseService<CollaboratorEntity> {
        return this.collaboratorService;
    }

    @Get("list")
    async findcollaborators(@Query() query){
        return await this.collaboratorService.findcollaborators(query);
    }

    @Get("findOne/:id")
    async findcollaborator(@Param("id") id: number){
        return await this.collaboratorService.findOne(id);
    }
}
