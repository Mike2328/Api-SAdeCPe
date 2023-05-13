import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { TrainerEntity } from '../entity/trainer-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class TrainerService extends BaseService<TrainerEntity>{
    constructor(@InjectRepository(TrainerEntity) private trainerRP: Repository<TrainerEntity>){
        super()
    }

    getRepository(): Repository<TrainerEntity> {
        return this.trainerRP;
    }

    async findTrainers(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let search = query.search == undefined ? "" : query.search;
        let sortBy = query.sortBy == undefined ?  ["trainer.name", "ASC"] : query.sortBy;

        if(sortBy == "character_asc"){
            sortBy = ["trainer.name", "ASC"];
        }else if(sortBy == "character_desc"){
            sortBy = ["trainer.name", "DESC"];
        }else if(sortBy == "date_asc"){
            sortBy = ["trainer.id", "ASC"];
        }else if(sortBy == "date_desc")
            sortBy = ["trainer.id", "DESC"];

        let QB = this.trainerRP
                .createQueryBuilder("trainer")
                .where("trainer.name LIKE :search", { search: `%${search}%` })

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