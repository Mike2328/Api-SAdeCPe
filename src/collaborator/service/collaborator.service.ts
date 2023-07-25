import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollaboratorEntity } from '../entity/collaborator-entity';
import { Brackets, Repository } from 'typeorm';
import { BaseService } from 'src/base/base.service';
import { createReadStream, renameSync, unlinkSync } from 'fs';
import { Response } from 'express';
import { CapacitationEntity } from 'src/capacitation/entity/capacitation-entity';
import { AssistanceEntity } from 'src/assistance/entity/assistance-entity';

@Injectable()
export class CollaboratorService extends BaseService<CollaboratorEntity>{
    constructor(@InjectRepository(CollaboratorEntity) private collaboratorRP: Repository<CollaboratorEntity>,
                @InjectRepository(CapacitationEntity) private capRP: Repository<CapacitationEntity>,
                @InjectRepository(AssistanceEntity) private assistanceRP: Repository<AssistanceEntity>){
        super();
    }

    async saveCol(entity: CollaboratorEntity): Promise<CollaboratorEntity>{
        let keyEntity = Object.keys(entity);
        let entitySave = {};

        keyEntity.forEach(key => {
            if((typeof entity[key]) != "object" || !key.includes("without"))
                entitySave[key] = entity[key];
        });

        if(entitySave["photo"] != null && entitySave["photo"] != ""){
            if(entity["photo"].includes("image/")){
                let filename = entity["photo"].split("/")[2];
                let oldpath = `${process.env.PATH_FILES_TEMP}${filename}`;
                let newpath = `${process.env.PATH_FILES_COLLABORATOR}${filename}`;

                try{
                    renameSync(oldpath, newpath);
                    entitySave["photo"] = `collaborator/preview/${filename}`;
                }catch(e){}
            }
        }

        return await this.collaboratorRP.save(entitySave);
    }

    async updateCol(entity: CollaboratorEntity): Promise<CollaboratorEntity>{
        let keyEntity = Object.keys(entity);
        let entityUpdate = {};

        keyEntity.forEach(key => {
            if((typeof entity[key]) != "object" && !key.includes("without"))
                entityUpdate[key] = entity[key];
        });

        let oldEntity = await this.collaboratorRP
                        .createQueryBuilder("collaborator")
                        .where("collaborator.id = :id", { id: entityUpdate["id"] })
                        .getOne();

        if(entityUpdate["photo"] != null && entityUpdate["photo"] != ""){
            if(entity["photo"].includes("image/")){
                let filename = entity["photo"].split("/")[2];
                let oldpath = `${process.env.PATH_FILES_TEMP}${filename}`;
                let newpath = `${process.env.PATH_FILES_COLLABORATOR}${filename}`;

                if(oldEntity["photo"] != "" && oldEntity["photo"] != null){
                    try {
                        let filenameRemove = oldEntity["photo"].split("/")[2];
                        let pathRemove = `${process.env.PATH_FILES_COLLABORATOR}${filenameRemove}`;
                        unlinkSync(pathRemove);
                        console.log('File removed');
                    } catch(e){}
                }

                try{
                    renameSync(oldpath, newpath);
                    entityUpdate["photo"] = `collaborator/preview/${filename}`;
                }catch(e){}
            }
        }

        await this.collaboratorRP.update(entityUpdate["id"],entityUpdate);

        return await this.collaboratorRP.createQueryBuilder("col")
                    .where("col.id = :id", {id: `${entityUpdate["id"]}`})
                    .getOne();
    }

    async delete(id:number){
        const entity = await this.collaboratorRP
                            .createQueryBuilder("repo")
                            .where("repo.id = :id", {id: id})
                            .getOne();
        if(entity){
            entity["active"] = false;

            let response = await this.capRP
                                 .createQueryBuilder("cap")
                                 .leftJoinAndSelect("cap.sessions", "sessions")
                                 .leftJoinAndSelect("sessions.assistances", "assistances")
                                 .where("cap.active = 1")
                                 .andWhere("sessions.active = 1")
                                 .andWhere("assistances.active = 1 and assistances.collaboratorId = :id", {id: entity["id"]})
                                 .getMany();

            let assisInactive = [];

            for(let capacitation of response){
                for(let session of capacitation["sessions"]){
                    let sessionDates = session["dates"].split("-").map(date => date.trim().split("/").map(item => parseInt(item) > 9 ? parseInt(item) : `0${parseInt(item)}`).join("/"));
                    let sessionDate = sessionDates[0] != undefined ? new Date(sessionDates[0]) : undefined;
                    
                    if(sessionDate != undefined){
                        let dateNow = new Date();
                        let status = "Sin iniciar";

                        let startTime = session["schedule"].split(" - ").map(item => item.trim())[0];
                        let startTimeConvMinutes = startTime != undefined ? (parseInt(startTime.split(":")[0]) * 60) + parseInt(startTime.split(":")[1]) : 0;

                        let endTime = session["schedule"].split(" - ").map(item => item.trim())[1];
                        let endTimeConvMinutes = endTime != undefined ? (parseInt(endTime.split(":")[0]) * 60) + parseInt(endTime.split(":")[1]) : 0;

                        let nowHour = dateNow.toLocaleTimeString().split(":").map((item,index) => [0,1].includes(index) ? item : "").filter(item => item != "").join(":");
                        let nowTimeConvMinutes = nowHour != undefined ? (parseInt(nowHour.split(":")[0]) * 60) + parseInt(nowHour.split(":")[1]) : 0;
                        dateNow = new Date(`${dateNow.getFullYear()}-${(dateNow.getMonth() + 1)}-${dateNow.getDate()}`);

                        let startDate = session["dates"].split(" - ").map(item => item.trim())[0];
                        let startDateConvert = startDate != undefined ? new Date(startDate.trim().replace("/", "-")) : undefined;
                        
                        let endDate = session["dates"].split(" - ").map(item => item.trim())[1];
                        let endDateConvert = endDate != undefined ? new Date(endDate.trim().replace("/", "-")) : undefined;

                        if(dateNow.getTime() >= startDateConvert.getTime()){
                            if(dateNow.getTime() <= endDateConvert.getTime()){
                                if(dateNow.getMonth() == endDateConvert.getMonth() && dateNow.getDate() == endDateConvert.getDate() && nowTimeConvMinutes > endTimeConvMinutes){
                                    status = "Finalizada";
                                }else{
                                    if((dateNow.getMonth() >= startDateConvert.getMonth() && dateNow.getDate() >= startDateConvert.getDate()) || 
                                        (dateNow.getMonth() > startDateConvert.getMonth() && dateNow.getDate() < startDateConvert.getDate()) && 
                                        nowTimeConvMinutes >= startTimeConvMinutes){
                                        status = "En Curso";
                                    }
                                }
                            }else
                                status = "Finalizada";
                        }

                        for(let assistance of session["assistances"]){
                            if(["En Curso","Sin iniciar"].includes(status))
                                assisInactive.push(assistance);
                        }
                    }
                }
            }

            for(let assitance of assisInactive){
                assitance["active"] = false;
                assitance["comment"] = "Fue dado de baja en la empresa";
                await this.assistanceRP.update(assitance["id"], assitance);

                console.log(assitance);
            }

            await this.collaboratorRP.update(entity["id"], entity);

            return {
                "statusCode": 200,
                "message": "Estado del colaborador actualizado",
                "error": "-"
            }
        }
        throw new NotFoundException(`El registro a eliminar no existe`);
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
        let statusPatient = query.status == undefined ? 1 : query.status;

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
                .where("collaborator.active = :status", {status: statusPatient})
                .andWhere("CONCAT(collaborator.name, ' ', collaborator.lastName) LIKE :search", { search: `%${search}%`})
                .andWhere(new Brackets((subcondition) => {
                    if(departament != 0 && employeePos != 0){
                        subcondition.where("dep.id = :depId and empPos.id = :empId", {depId: departament, empId: employeePos})
                    }else if(departament != 0){
                        subcondition.andWhere("dep.id = :id", {id: departament})    
                    }else if(employeePos != 0)
                        subcondition.andWhere("empPos.id = :id", {id: employeePos})
                }));

        let response = await QB
                        .orderBy(sortBy[0], sortBy[1])
                        .skip(itemsperPage * (page - 1))
                        .take(itemsperPage)
                        .getMany();
        
        response.map(col => {
            if(col["photo"] == "" || col["photo"] == null)
                col["photo"] = `collaborator/preview/Default.png`;

            return col;
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

    async findOne(id: number): Promise<CollaboratorEntity>{
        let response = await this.collaboratorRP
                            .createQueryBuilder("collaborator")
                            .leftJoinAndSelect("collaborator.position", "empPos")
                            .where("collaborator.id = :id", { id: id })
                            .getOne();

        console.log(response["photo"])
        if(response["photo"] == "" || response["photo"] == null)
            response["photo"] = `collaborator/preview/Default.png`;

        return response;
    }

    async returnImage(image: string, response: Response){
        const stream = createReadStream(`${process.env.PATH_FILES_COLLABORATOR}${image}`);
        
        response.set({
            'Content-Disposition': `inline; filename="${image}"`,
            'Content-Type': "image/jpeg"
        });

        return new StreamableFile(stream);
    }
}