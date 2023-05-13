import { BaseService } from "src/base/base.service";
import { ApplicationEntity } from "../entity/application-entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class ApplicationService extends BaseService<ApplicationEntity>{
    constructor(@InjectRepository(ApplicationEntity) private applicationRP: Repository<ApplicationEntity>){
        super();
    }

    getRepository(): Repository<ApplicationEntity> {
        return this.applicationRP;
    }
}