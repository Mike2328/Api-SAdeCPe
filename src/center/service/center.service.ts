import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { CenterEntity } from '../entity/center-entity';

@Injectable()
export class CenterService extends BaseService<CenterEntity>{
    constructor(@InjectRepository(CenterEntity) private centerRP: Repository<CenterEntity>){
        super();
    }

    getRepository(): Repository<CenterEntity> {
        return this.centerRP;
    }

    async findCenters(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let search = query.search == undefined ? "" : query.search;

        let queryOptionsTemp: FindManyOptions ={};
        let queryOptions: FindManyOptions = {
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
        

        queryOptions.where = [{name: Like(`%${search}%`)},{address: Like(`%${search}%`)}];
        queryOptionsTemp.where = [{name: Like(`%${search}%`)},{address: Like(`%${search}%`)}];

        const response = await this.centerRP.find(queryOptions);
        const responseCount = await this.centerRP.count(queryOptionsTemp).then((items) => {
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