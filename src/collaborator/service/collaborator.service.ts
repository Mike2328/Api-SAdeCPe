import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollaboratorEntity } from '../entity/collaborator-entity';
import { Brackets, FindManyOptions, Like, Repository } from 'typeorm';
import { BaseService } from 'src/base/base.service';

@Injectable()
export class CollaboratorService extends BaseService<CollaboratorEntity>{
    constructor(@InjectRepository(CollaboratorEntity) private collaboratorRP: Repository<CollaboratorEntity>){
        super();
    }

    getRepository(): Repository<CollaboratorEntity> {
        return this.collaboratorRP;
    }

    async findcollaborators(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let search = query.search == undefined ? "" : query.search;
        let sortBy = query.sortBy == undefined ?  ["collaborator.name", "ASC"] : query.sortBy;
        let departament = query.departament == undefined ? 0 : query.departament;
        let employeePos = query.employeePos == undefined ? 0 : query.employeePos;

        if(sortBy == "character_asc"){
            sortBy = ["collaborator.name", "ASC"];
        }else if(sortBy == "character_desc"){
            sortBy = ["collaborator.name", "DESC"];
        }else if(sortBy == "date_asc"){
            sortBy = ["collaborator.id", "ASC"];
        }else if(sortBy == "date_desc")
            sortBy = ["collaborator.id", "DESC"];

        let QB = this.collaboratorRP
                .createQueryBuilder("collaborator")
                .leftJoinAndSelect("collaborator.position", "empPos")
                .leftJoinAndSelect("empPos.departament","dep")
                .where("CONCAT(collaborator.name, ' ', collaborator.lastName) LIKE :search", { search: `%${search}%` })
                .andWhere(new Brackets((subcondition) => {
                    if(departament != 0 && employeePos != 0){
                        subcondition.where("dep.id = :depId and empPos.id = :empId", {depId: departament, empId: employeePos})
                    }else if(departament != 0){
                        subcondition.andWhere("dep.id = :id", {id: departament})    
                    }else if(employeePos != 0)
                        subcondition.andWhere("empPos.id = :id", {id: employeePos})
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

    async findOne(id: number): Promise<CollaboratorEntity>{
        return await this.collaboratorRP
                    .createQueryBuilder("collaborator")
                    .leftJoinAndSelect("collaborator.position", "empPos")
                    .where("collaborator.id = :id", { id: id })
                    .getOne();
    }
}