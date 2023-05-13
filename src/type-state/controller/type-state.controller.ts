import { Controller } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';
import { BaseService } from 'src/base/base.service';
import { TypeStateEntity } from '../entity/type-state-entity';
import { TypeStateService } from '../service/type-state.service';


@Controller('type-state')
export class TypeStateController extends BaseController<TypeStateEntity>{
    constructor(private readonly typeStateService: TypeStateService){
        super();
    }

    getService(): BaseService<TypeStateEntity> {
        return this.typeStateService;
    }
}