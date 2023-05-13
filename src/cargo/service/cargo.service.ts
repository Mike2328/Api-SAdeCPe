import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CargoEntity } from '../entity/cargo-entity';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { BaseService } from 'src/base/base.service';

@Injectable()
export class CargoService extends BaseService<CargoEntity>{
    constructor(@InjectRepository(CargoEntity) private cargoRP: Repository<CargoEntity>){
        super();
    }

    getRepository(): Repository<CargoEntity>{
        return this.cargoRP;
    }

    async findEmployerPossitions(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let departament =  query.departament == undefined ? 0 : parseInt(query.departament);
        let search = query.search == undefined ? "" : query.search;

        let queryOptionsTemp: FindManyOptions ={};
        let queryOptions: FindManyOptions = {
            relations:{departament: true},
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
        

        if(departament != 0){
            queryOptions.where = [{name: Like(`%${search}%`), departament: {id: departament}},{description: Like(`%${search}%`), departament: {id: departament}}];
            queryOptionsTemp.where = [{name: Like(`%${search}%`), departament: {id: departament}},{description: Like(`%${search}%`), departament: {id: departament}}];
        }else{
            queryOptions.where = [{name: Like(`%${search}%`)},{description: Like(`%${search}%`)}];
            queryOptionsTemp.where = [{name: Like(`%${search}%`)}, {description: Like(`%${search}%`)}];
        }

        const response = await this.cargoRP.find(queryOptions);
        const responseCount = await this.cargoRP.count(queryOptionsTemp).then((items) => {
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