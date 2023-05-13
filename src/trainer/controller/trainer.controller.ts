import { Controller, Get, Query } from '@nestjs/common';
import { TrainerService } from '../service/trainer.service';
import { BaseController } from 'src/base/base.controller';
import { TrainerEntity } from '../entity/trainer-entity';
import { BaseService } from 'src/base/base.service';

@Controller('trainer')
export class TrainerController extends BaseController<TrainerEntity>{
    constructor(private readonly trainerService: TrainerService){
        super();
    }

    getService(): BaseService<TrainerEntity> {
        return this.trainerService;
    }

    @Get("list")
    async findTrainers(@Query() query){
        return await this.trainerService.findTrainers(query);
    }
}