import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { Repository } from 'typeorm';
import { TypeStateEntity } from '../entity/type-state-entity';

@Injectable()
export class TypeStateService extends BaseService<TypeStateEntity>{
    constructor(@InjectRepository(TypeStateEntity) private typeStateRP: Repository<TypeStateEntity>){
        super();
    }

    getRepository(): Repository<TypeStateEntity>{
        return this.typeStateRP;
    }
}
