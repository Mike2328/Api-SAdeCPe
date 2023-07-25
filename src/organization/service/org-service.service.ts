import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { OrgEntity } from '../entity/org-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createReadStream, renameSync, unlinkSync } from 'fs';
import { Response } from 'express';

@Injectable()
export class OrgService extends BaseService<OrgEntity>{
    constructor(@InjectRepository(OrgEntity) private orgRP: Repository<OrgEntity>){
        super();
    }

    async saveOrg(Entity: OrgEntity): Promise<OrgEntity>{
        if(Entity["photo"] != null && Entity["photo"] != ""){
            if(Entity["photo"].includes("image/")){
                let filename = Entity["photo"].split("/")[2];
                let oldpath = `${process.env.PATH_FILES_TEMP}${filename}`;
                let newpath = `${process.env.PATH_FILES_ORG}${filename}`;

                try{
                    renameSync(oldpath, newpath);
                    Entity["photo"] = `org/preview/${filename}`;
                }catch(e){}
            }
        }

        return await this.orgRP.save(Entity);
    }

    async updateOrg(entity: OrgEntity): Promise<OrgEntity>{
        let keyEntity = Object.keys(entity);
        let entityUpdate = {};

        keyEntity.forEach(key => {
            if((typeof entity[key]) != "object" && !key.includes("without"))
                entityUpdate[key] = entity[key];
        });

        let oldEntity = await this.orgRP
                        .createQueryBuilder("org")
                        .where("org.id = :id", { id: entityUpdate["id"] })
                        .getOne();

        if(entityUpdate["photo"] != null && entityUpdate["photo"] != ""){
            if(entity["photo"].includes("image/")){
                let filename = entity["photo"].split("/")[2];
                let oldpath = `${process.env.PATH_FILES_TEMP}${filename}`;
                let newpath = `${process.env.PATH_FILES_ORG}${filename}`;

                if(oldEntity["photo"] != "" && oldEntity["photo"] != null){
                    try {
                        let filenameRemove = oldEntity["photo"].split("/")[2];
                        let pathRemove = `${process.env.PATH_FILES_ORG}${filenameRemove}`;
                        unlinkSync(pathRemove);
                        console.log('File removed');
                    } catch(e){}
                }

                try{
                    renameSync(oldpath, newpath);
                    entityUpdate["photo"] = `org/preview/${filename}`;
                }catch(e){}
            }
        }

        await this.orgRP.update(entityUpdate["id"],entityUpdate);

        return await this.orgRP.createQueryBuilder("col")
                    .where("col.id = :id", {id: `${entityUpdate["id"]}`})
                    .getOne();
    }

    async delete(id:number){
        const entity = await this.orgRP
                            .createQueryBuilder("repo")
                            .where("repo.id = :id", {id: id})
                            .getOne();
        if(entity){
            entity["active"] = false;
            await this.orgRP.update(entity["id"], entity);
            return {
                "statusCode": 200,
                "message": "Estado del colaborador actualizado",
                "error": "-"
            }
        }
        throw new NotFoundException(`El registro a eliminar no existe`);
    }

    getRepository(): Repository<OrgEntity> {
        return this.orgRP;
    }

    async findOrg(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let search = query.search == undefined ? "" : query.search;
        let sortBy = query.sortBy == undefined ?  ["org.name", "ASC"] : query.sortBy;
        let statusOrg = query.status == undefined ? 1 : query.status;

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
            .where("org.active = :status", {status: statusOrg})
            .andWhere("org.name LIKE :search", { search: `%${search}%` })


        let response = await QB
                        .orderBy(sortBy[0], sortBy[1])
                        .skip(itemsperPage * (page - 1))
                        .take(itemsperPage)
                        .getMany();
        
        response.map(org => {
            if(org["photo"] == "" || org["photo"] == null)
                org["photo"] = `org/preview/Default.png`;

            return org;
        });

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

    async returnImage(image: string, response: Response){
        const stream = createReadStream(`${process.env.PATH_FILES_ORG}${image}`);
        
        response.set({
            'Content-Disposition': `inline; filename="${image}"`,
            'Content-Type': "image/jpeg"
        });

        return new StreamableFile(stream);
    }
}
