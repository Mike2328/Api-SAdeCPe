import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { OrgEntity } from '../entity/org-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class OrgService extends BaseService<OrgEntity>{
    constructor(@InjectRepository(OrgEntity) private orgRP: Repository<OrgEntity>){
        super();
    }

    getRepository(): Repository<OrgEntity> {
        return this.orgRP;
    }

    async findOrg(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let search = query.search == undefined ? "" : query.search;
        let sortBy = query.sortBy == undefined ?  ["org.name", "ASC"] : query.sortBy;

        if(sortBy == "character_asc"){
            sortBy = ["org.name", "ASC"];
        }else if(sortBy == "character_desc"){
            sortBy = ["org.name", "DESC"];
        }else if(sortBy == "date_asc"){
            sortBy = ["org.id", "ASC"];
        }else if(sortBy == "date_desc")
            sortBy = ["org.id", "DESC"];

        let QB = this.orgRP
            .createQueryBuilder("org")
            .where("org.name LIKE :search", { search: `%${search}%` })


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
