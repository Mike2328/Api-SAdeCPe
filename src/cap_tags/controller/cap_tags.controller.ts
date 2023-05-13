import { Controller } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';
import { CapTagsEntity } from '../entity/cap_tags-entity';
import { CapTagsService } from '../service/cap_tags.service';
import { BaseService } from 'src/base/base.service';

@Controller('cap-tags')
export class CapTagsController extends BaseController<CapTagsEntity>{
    constructor(private readonly capTagservice: CapTagsService){
        super();
    }
    
    getService(): BaseService<CapTagsEntity> {
        return this.capTagservice;
    }
}