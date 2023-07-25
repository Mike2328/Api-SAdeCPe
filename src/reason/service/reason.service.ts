import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { ReasonEntity } from '../entity/reason-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class ReasonService extends BaseService<ReasonEntity>{
    constructor(@InjectRepository(ReasonEntity) private reasonRP: Repository<ReasonEntity>){
        super();
    }

    async findReasons(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let search = query.search == undefined ? "" : query.search;
        let sortBy = query.sortBy == undefined ?  ["reason.name", "ASC"] : query.sortBy;
        let statusReason = query.status == undefined ? 1 : query.status;

        if(sortBy == "character_asc"){
            sortBy = ["reason.name", "ASC"];
        }else if(sortBy == "character_desc"){
            sortBy = ["reason.name", "DESC"];
        }else if(sortBy == "date_asc"){
            sortBy = ["reason.id", "ASC"];
        }else if(sortBy == "date_desc")
            sortBy = ["reason.id", "DESC"];

        let QB = this.reasonRP
            .createQueryBuilder("reason")
            .where("reason.active = :status ", {status: statusReason})
            .andWhere("CONCAT(reason.name, '', reason.description) LIKE :search", { search: `%${search}%` });

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

    async delete(id:number){
        const entity = await this.reasonRP
                            .createQueryBuilder("repo")
                            .where("repo.id = :id", {id: id})
                            .getOne();
        if(entity){
            entity["active"] = false;
            await this.reasonRP.update(entity["id"], entity);
            return {
                "statusCode": 200,
                "message": "Estado del colaborador actualizado",
                "error": "-"
            }
        }
        throw new NotFoundException(`El registro a eliminar no existe`);
    }

    getRepository(): Repository<ReasonEntity> {
        return this.reasonRP;
    }
}