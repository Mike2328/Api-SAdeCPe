import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { TrainerEntity } from '../entity/trainer-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createReadStream, renameSync, unlinkSync } from 'fs';
import { Response } from 'express';

@Injectable()
export class TrainerService extends BaseService<TrainerEntity>{
    constructor(@InjectRepository(TrainerEntity) private trainerRP: Repository<TrainerEntity>){
        super()
    }

    async saveTrainer(Entity: TrainerEntity): Promise<TrainerEntity>{
        if(Entity["photo"] != null && Entity["photo"] != ""){
            if(Entity["photo"].includes("image/")){
                let filename = Entity["photo"].split("/")[2];
                let oldpath = `${process.env.PATH_FILES_TEMP}${filename}`;
                let newpath = `${process.env.PATH_FILES_TRAINER}${filename}`;

                try{
                    renameSync(oldpath, newpath);
                    Entity["photo"] = `trainer/preview/${filename}`;
                }catch(e){}
            }
        }

        return await this.trainerRP.save(Entity);
    }

    async updateTrainer(entity: TrainerEntity): Promise<TrainerEntity>{
        let keyEntity = Object.keys(entity);
        let entityUpdate = {};

        keyEntity.forEach(key => {
            if((typeof entity[key]) != "object" && !key.includes("without"))
                entityUpdate[key] = entity[key];
        });

        let oldEntity = await this.trainerRP
                        .createQueryBuilder("trainer")
                        .where("trainer.id = :id", { id: entityUpdate["id"] })
                        .getOne();

        if(entityUpdate["photo"] != null && entityUpdate["photo"] != ""){
            if(entity["photo"].includes("image/")){
                let filename = entity["photo"].split("/")[2];
                let oldpath = `${process.env.PATH_FILES_TEMP}${filename}`;
                let newpath = `${process.env.PATH_FILES_TRAINER}${filename}`;

                if(oldEntity["photo"] != "" && oldEntity["photo"] != null){
                    try {
                        let filenameRemove = oldEntity["photo"].split("/")[2];
                        let pathRemove = `${process.env.PATH_FILES_TRAINER}${filenameRemove}`;
                        unlinkSync(pathRemove);
                        console.log('File removed');
                    } catch(e){}
                }

                try{
                    renameSync(oldpath, newpath);
                    entityUpdate["photo"] = `trainer/preview/${filename}`;
                }catch(e){}
            }
        }
        console.log(entityUpdate);
        await this.trainerRP.update(entityUpdate["id"],entityUpdate);

        return await this.trainerRP.createQueryBuilder("col")
                    .where("col.id = :id", {id: `${entityUpdate["id"]}`})
                    .getOne();
    }

    async delete(id:number){
        const entity = await this.trainerRP
                            .createQueryBuilder("repo")
                            .where("repo.id = :id", {id: id})
                            .getOne();
        if(entity){
            entity["active"] = false;
            await this.trainerRP.update(entity["id"], entity);
            return {
                "statusCode": 200,
                "message": "Estado del colaborador actualizado",
                "error": "-"
            }
        }
        throw new NotFoundException(`El registro a eliminar no existe`);
    }

    getRepository(): Repository<TrainerEntity> {
        return this.trainerRP;
    }

    async findTrainers(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let search = query.search == undefined ? "" : query.search;
        let sortBy = query.sortBy == undefined ?  ["trainer.name", "ASC"] : query.sortBy;
        let statusTrainer = query.status == undefined ? 1 : query.status;

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
                .where("trainer.active = :status", {status: statusTrainer})
                .andWhere("trainer.name LIKE :search", { search: `%${search}%` })

        let response = await QB
                        .orderBy(sortBy[0], sortBy[1])
                        .skip(itemsperPage * (page - 1))
                        .take(itemsperPage)
                        .getMany();

        response.map(trainer => {
            if(trainer["photo"] == "" || trainer["photo"] == null)
                trainer["photo"] = `trainer/preview/Default.png`;

            return trainer;
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
        const stream = createReadStream(`${process.env.PATH_FILES_TRAINER}${image}`);
        
        response.set({
            'Content-Disposition': `inline; filename="${image}"`,
            'Content-Type': "image/jpeg"
        });

        return new StreamableFile(stream);
    }
}