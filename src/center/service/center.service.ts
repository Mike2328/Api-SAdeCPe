import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { CenterEntity } from '../entity/center-entity';
import { createReadStream, renameSync } from 'fs';
import { Response } from 'express';

@Injectable()
export class CenterService extends BaseService<CenterEntity>{
    constructor(@InjectRepository(CenterEntity) private centerRP: Repository<CenterEntity>){
        super();
    }

    async saveCenter(Entity: CenterEntity): Promise<CenterEntity>{
        if(Entity["photo"] != null && Entity["photo"] != ""){
            if(Entity["photo"].includes("image/")){
                let filename = Entity["photo"].split("/")[2];
                let oldpath = `${process.env.PATH_FILES_TEMP}${filename}`;
                let newpath = `${process.env.PATH_FILES_CENTER}${filename}`;

                renameSync(oldpath, newpath);

                Entity["photo"] = `center/preview/${filename}`;
            }
        }

        return await this.centerRP.save(Entity);
    }

    async delete(id:number){
        const entity = await this.centerRP
                            .createQueryBuilder("repo")
                            .where("repo.id = :id", {id: id})
                            .getOne();
        if(entity){
            entity["active"] = false;
            await this.centerRP.update(entity["id"], entity);
            return {
                "statusCode": 200,
                "message": "Estado del departamento actualizado",
                "error": "-"
            }
        }
        throw new NotFoundException(`El registro a eliminar no existe`);
    }

    getRepository(): Repository<CenterEntity> {
        return this.centerRP;
    }

    async findCenters(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let search = query.search == undefined ? "" : query.search;
        let sortBy = query.sortBy == undefined ?  ["center.name", "ASC"] : query.sortBy;
        let statusCenter = query.status == undefined ? 1 : query.status;

        if(sortBy == "character_asc"){
            sortBy = ["center.name", "ASC"];
        }else if(sortBy == "character_desc"){
            sortBy = ["center.name", "DESC"];
        }else if(sortBy == "date_asc"){
            sortBy = ["center.id", "ASC"];
        }else if(sortBy == "date_desc")
            sortBy = ["center.id", "DESC"];

        let QB = this.centerRP
            .createQueryBuilder("center")
            .where("center.active = :status", {status: statusCenter})
            .andWhere("CONCAT(center.name, ' ', center.address) LIKE :search", { search: `%${search}%`});

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

    async returnImage(image: string, response: Response){
        const stream = createReadStream(`${process.env.PATH_FILES_CENTER}${image}`);
        
        response.set({
            'Content-Disposition': `inline; filename="${image}"`,
            'Content-Type': "image/jpeg"
        });

        return new StreamableFile(stream);
    }
}