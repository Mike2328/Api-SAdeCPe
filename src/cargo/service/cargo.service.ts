import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CargoEntity } from '../entity/cargo-entity';
import { Brackets, FindManyOptions, Like, Repository } from 'typeorm';
import { BaseService } from 'src/base/base.service';

@Injectable()
export class CargoService extends BaseService<CargoEntity>{
    constructor(@InjectRepository(CargoEntity) private cargoRP: Repository<CargoEntity>){
        super();
    }

    async delete(id:number){
        const entity = await this.cargoRP
                            .createQueryBuilder("repo")
                            .where("repo.id = :id", {id: id})
                            .getOne();
        if(entity){
            entity["active"] = false;
            await this.cargoRP.update(entity["id"], entity);
            return {
                "statusCode": 200,
                "message": "Estado del cargo actualizado",
                "error": "-"
            }
        }
        throw new NotFoundException(`El registro a eliminar no existe`);
    }

    getRepository(): Repository<CargoEntity>{
        return this.cargoRP;
    }

    async findEmployerPossitions(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let departament =  query.departament == undefined ? 0 : parseInt(query.departament);
        let search = query.search == undefined ? "" : query.search;
        let sortBy = query.sortBy == undefined ?  ["collaborator.name", "ASC"] : query.sortBy;
        let statusSchedule = query.status == undefined ? 1 : query.status;

        if(sortBy == "character_asc"){
            sortBy = ["cargo.name", "ASC"];
        }else if(sortBy == "character_desc"){
            sortBy = ["cargo.name", "DESC"];
        }else if(sortBy == "date_asc"){
            sortBy = ["cargo.id", "ASC"];
        }else if(sortBy == "date_desc")
            sortBy = ["cargo.id", "DESC"];

        let QB = this.cargoRP
            .createQueryBuilder("cargo")
            .leftJoinAndSelect("cargo.departament", "dep")
            .where("cargo.active = :status", {status: statusSchedule})
            .andWhere("CONCAT(cargo.name, ' ', cargo.description) LIKE :search", { search: `%${search}%`})
            .andWhere(new Brackets((subcondition) => {
                if(departament != 0)
                    subcondition.andWhere("cargo.departamentId = :id", {id: departament})
            }));

 
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