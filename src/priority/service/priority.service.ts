import { InjectRepository } from  '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { PriorityEntity } from '../entity/priority-entity';
import { FindManyOptions, Like, Repository } from 'typeorm';

@Injectable()
export class PriorityService extends BaseService<PriorityEntity>{
    constructor(@InjectRepository(PriorityEntity) private priorityRP: Repository<PriorityEntity>){
        super();
    }

    getRepository(): Repository<PriorityEntity> {
        return this.priorityRP;
    }

    async findPrioritys(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let search = query.search == undefined ? "" : query.search;
        let sortBy = query.sortBy == undefined ?  ["priority.name", "ASC"] : query.sortBy;
        let statusPriority = query.status == undefined ? 1 : query.status;

        if(sortBy == "character_asc"){
            sortBy = ["priority.name", "ASC"];
        }else if(sortBy == "character_desc"){
            sortBy = ["priority.name", "DESC"];
        }else if(sortBy == "date_asc"){
            sortBy = ["priority.id", "ASC"];
        }else if(sortBy == "date_desc")
            sortBy = ["priority.id", "DESC"];

        let QB = this.priorityRP
            .createQueryBuilder("priority")
            .where("priority.active = :status", {status: statusPriority})
            .andWhere("CONCAT(priority.name, ' ', priority.description) LIKE :search", { search: `%${search}%`});

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