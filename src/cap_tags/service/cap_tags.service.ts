import { Injectable, } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CapTagsEntity } from '../entity/cap_tags-entity';
import { Repository } from 'typeorm';

@Injectable()
export class CapTagsService extends BaseService<CapTagsEntity>{
    constructor(@InjectRepository(CapTagsEntity) private capTagRP: Repository<CapTagsEntity>){
        super();
    }

    getRepository(): Repository<CapTagsEntity> {
        return this.capTagRP;
    }
}