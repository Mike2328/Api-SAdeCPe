import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { TagEntity } from '../entity/tag-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class TagService extends BaseService<TagEntity>{
    constructor(@InjectRepository(TagEntity) private tagRP: Repository<TagEntity>){
        super();
    }

    getRepository(): Repository<TagEntity> {
        return this.tagRP;
    }

    async findTags(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let search = query.search == undefined ? "" : query.search;
        let sortBy = query.sortBy == undefined ?  ["tag.name", "ASC"] : query.sortBy;

        if(sortBy == "character_asc"){
            sortBy = ["tag.name", "ASC"];
        }else if(sortBy == "character_desc"){
            sortBy = ["tag.name", "DESC"];
        }else if(sortBy == "date_asc"){
            sortBy = ["tag.id", "ASC"];
        }else if(sortBy == "date_desc")
            sortBy = ["tag.id", "DESC"];

        let QB = this.tagRP
                .createQueryBuilder("tag")
                .where("tag.name LIKE :search", { search: `%${search}%` });

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