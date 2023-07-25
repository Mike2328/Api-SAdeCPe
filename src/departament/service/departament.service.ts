import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindManyOptions, Like, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { DepartamentEntity } from '../entity/departament-entity';

@Injectable()
export class DepartamentService extends BaseService<DepartamentEntity> {

    constructor(@InjectRepository(DepartamentEntity) private departamentRP: Repository<DepartamentEntity>){
        super();
    }

    async delete(id:number){
        const entity = await this.departamentRP
                            .createQueryBuilder("repo")
                            .where("repo.id = :id", {id: id})
                            .getOne();
        if(entity){
            entity["active"] = false;
            await this.departamentRP.update(entity["id"], entity);
            return {
                "statusCode": 200,
                "message": "Estado del departamento actualizado",
                "error": "-"
            }
        }
        throw new NotFoundException(`El registro a eliminar no existe`);
    }

    getRepository(): Repository<DepartamentEntity>{
        return this.departamentRP;
    }

    async findDepartaments(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let search = query.search == undefined ? "" : query.search;
        let sortBy = query.sortBy == undefined ?  ["dep.name", "ASC"] : query.sortBy;
        let statusDep = query.status == undefined ? 1 : query.status;

        if(sortBy == "character_asc"){
            sortBy = ["dep.name", "ASC"];
        }else if(sortBy == "character_desc"){
            sortBy = ["dep.name", "DESC"];
        }else if(sortBy == "date_asc"){
            sortBy = ["dep.id", "ASC"];
        }else if(sortBy == "date_desc")
            sortBy = ["dep.id", "DESC"];

        let QB = this.departamentRP
            .createQueryBuilder("dep")
            .where("dep.active = :status", {status: statusDep})
            .andWhere("CONCAT(dep.name, ' ', dep.description) LIKE :search", { search: `%${search}%`});

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