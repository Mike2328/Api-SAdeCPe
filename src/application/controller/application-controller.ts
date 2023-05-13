import { BaseController } from "src/base/base.controller";
import { ApplicationEntity } from "../entity/application-entity";
import { ApplicationService } from "../service/application-service";
import { BaseService } from "src/base/base.service";
import { Controller } from "@nestjs/common";

@Controller("application")
export class ApplicationController extends BaseController<ApplicationEntity>{
    constructor(private readonly applicationService: ApplicationService){
        super();
    }

    getService(): BaseService<ApplicationEntity> {
        return this.applicationService;
    }
}