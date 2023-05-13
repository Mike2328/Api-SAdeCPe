import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { StateEntity } from '../entity/state-entity';

@Injectable()
export class StateService extends BaseService<StateEntity>{
    constructor(@InjectRepository(StateEntity) private stateRP: Repository<StateEntity>){
        super();
    }

    getRepository(): Repository<StateEntity>{
        return this.stateRP;
    }

    async findStates(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let stateType =  query.stateType == undefined ? 0 : parseInt(query.stateType);
        let search = query.search == undefined ? "" : query.search;

        let queryOptionsTemp: FindManyOptions ={};
        let queryOptions: FindManyOptions = {
            relations:{typeState: true},
            skip: (itemsperPage * (page - 1)),
            take: itemsperPage
        };

        if(query.sortBy == "character_asc"){
            queryOptions.order = {name: "ASC"};
        }else if(query.sortBy == "character_desc"){
            queryOptions.order = {name: "DESC"};
        }else if(query.sortBy == "date_asc"){
            queryOptions.order = {id: "ASC"};
        }else if(query.sortBy == "date_desc")
            queryOptions.order = {id: "DESC"};
        

        if(stateType != 0){
            queryOptions.where = [{name: Like(`%${search}%`), typeState: {id: stateType}},{description: Like(`%${search}%`), typeState: {id: stateType}}];
            queryOptionsTemp.where = [{name: Like(`%${search}%`), typeState: {id: stateType}},{description: Like(`%${search}%`), typeState: {id: stateType}}];
        }else{
            queryOptions.where = [{name: Like(`%${search}%`)},{description: Like(`%${search}%`)}];
            queryOptionsTemp.where = [{name: Like(`%${search}%`)}, {description: Like(`%${search}%`)}];
        }

        const response = await this.stateRP.find(queryOptions);
        const responseCount = await this.stateRP.count(queryOptionsTemp).then((items) => {
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