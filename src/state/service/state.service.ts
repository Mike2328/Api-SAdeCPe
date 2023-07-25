import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { Brackets, FindManyOptions, Like, Repository } from 'typeorm';
import { StateEntity } from '../entity/state-entity';

@Injectable()
export class StateService extends BaseService<StateEntity>{
    constructor(@InjectRepository(StateEntity) private stateRP: Repository<StateEntity>){
        super();
    }

    async delete(id:number){
        const entity = await this.stateRP
                            .createQueryBuilder("repo")
                            .where("repo.id = :id", {id: id})
                            .getOne();
        if(entity){
            entity["active"] = false;
            await this.stateRP.update(entity["id"], entity);
            return {
                "statusCode": 200,
                "message": "Estado del colaborador actualizado",
                "error": "-"
            }
        }
        throw new NotFoundException(`El registro a eliminar no existe`);
    }

    getRepository(): Repository<StateEntity>{
        return this.stateRP;
    }

    async findStates(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let stateType =  query.stateType == undefined ? 0 : parseInt(query.stateType);
        let search = query.search == undefined ? "" : query.search;
        let sortBy = query.sortBy == undefined ?  ["state.name", "ASC"] : query.sortBy;
        let statusState = query.status == undefined ? 1 : query.status;

        if(sortBy == "character_asc"){
            sortBy = ["state.name", "ASC"];
        }else if(sortBy == "character_desc"){
            sortBy = ["state.name", "DESC"];
        }else if(sortBy == "date_asc"){
            sortBy = ["state.id", "ASC"];
        }else if(sortBy == "date_desc")
            sortBy = ["state.id", "DESC"];

        let QB = this.stateRP
            .createQueryBuilder("state")
            .leftJoinAndSelect("state.typeState", "typeState")
            .where("state.active = :status", {status: statusState})
            .andWhere(new Brackets((subcondition) => {
                if(stateType != 0)
                    subcondition.where("typeState.id = :typeStateId ", {typeStateId: stateType})
            }))
            .andWhere("CONCAT(state.name, ' ', state.description) LIKE :search", { search: `%${search}%`});

        const response = await QB
            .orderBy(sortBy[0], sortBy[1])
            .skip(itemsperPage * (page - 1))
            .take(itemsperPage)
            .getMany();

        const responseCount = await QB
            .getCount().then((items) => {
                return [items, Math.ceil(items / itemsperPage)];
            });

        let totalItems = responseCount[0];
        let pageCount = responseCount[1];

        const returnResponse = {
            data: response,
            itemsperPage: itemsperPage,
            totalItems: totalItems,
            pageCount: pageCount,
            currentPage: page
        }

        return returnResponse;
    }
}