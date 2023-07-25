import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { CapacitationEntity } from '../entity/capacitation-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Entity, Repository } from 'typeorm';
import { TagEntity } from 'src/tag/entity/tag-entity';
import { CapSessionEntity } from 'src/cap_session/entity/cap_session-entity';
import { AssistanceEntity } from 'src/assistance/entity/assistance-entity';
import { CapTagsEntity } from 'src/cap_tags/entity/cap_tags-entity';
import { createReadStream, renameSync } from 'fs';
import { Response } from 'express';

@Injectable()
export class CapacitationService extends BaseService<CapacitationEntity>{
    constructor(@InjectRepository(CapacitationEntity) private capacitationRP: Repository<CapacitationEntity>, 
                @InjectRepository(TagEntity) private tagRP: Repository<TagEntity>,
                @InjectRepository(CapTagsEntity) private capTagRP: Repository<CapTagsEntity>,
                @InjectRepository(CapSessionEntity) private capSessionRP: Repository<TagEntity>,
                @InjectRepository(AssistanceEntity) private assistanceRP: Repository<AssistanceEntity>){
        super();
    }

    async createCap(entity){
        console.log(entity)   
        let response = {};
        console.log("Guardando la capaciatación.....");
        const responseCap = await this.capacitationRP.save(entity);

        //Si se guardo correctamente la capacitacion procedemos a guardar el detalle
        if(responseCap["id"] != undefined){
            let tags_array = entity["tags"].filter(tag => tag["isNew"] == undefined).map((tag) => {return {"id": tag["id"], "name": tag["label"], "active": true} });
            let new_tags = entity["tags"].filter(tag => tag["isNew"] != undefined).map((tag) => {return {"name": tag["label"], "active": true} });
            let save_tags_new = [];
            let save_tags = [];

            if(new_tags.length > 0)
                save_tags_new = await this.tagRP.save(new_tags);

            save_tags = await tags_array.concat(save_tags_new).map(tag => { return {"capId": responseCap["id"], "tagId": tag["id"], "active": true}});

            let sessionSave = {};
            let responseSession = {};

            if(save_tags.length > 0){
                console.log("Guardando Etiquetas...");
                await this.capTagRP.save(save_tags);
                console.log("Etiquetas Guardadas...")
            }

            for(let session of entity["sessions"]){

                sessionSave = {
                    capId: responseCap["id"],
                    trainerId: session["trainerId"],
                    centerId: session["centerId"],
                    dates: session["dates"].join(" - "),
                    schedule: session["timeRange"].join(" - "),
                    active: true
                };

                console.log("Guardando Sesiones...");
                responseSession = await this.capSessionRP.save(sessionSave);
                console.log("Sesiones guardadas...");

                if(responseSession["id"] != undefined){
                    let assistanceSave = [];

                    for(let assistance of session["collaborators"]){
                        if(assistance["certificate"] != null && assistance["certificate"] != ""){
                            if(assistance["certificate"].includes("image/")){
                                let filename = assistance["certificate"].split("/")[2];
                                let oldpath = `${process.env.PATH_FILES_TEMP}${filename}`;
                                let newpath = `${process.env.PATH_FILES_EVIDENCE}${filename}`;
                
                                renameSync(oldpath, newpath);
                
                                assistance["certificate"] = `capacitation/preview/${filename}`;
                            }
                        }

                        assistanceSave.push({
                            sessionId: responseSession["id"],
                            collaboratorId: assistance["collaboratorId"],
                            qualification: assistance["qualification"],
                            certificate: assistance["certificate"],
                            description: assistance["description"],
                            active: assistance["active"]
                        });
                    }

                    console.log("Guardando participante de la sesión...");
                    await this.assistanceRP.save(assistanceSave)
                    console.log("Participantes guardados...");
                }
            }

            console.log("Recuperando la capacitación actualizada....")
            response = await this.capacitationRP
                    .createQueryBuilder("cap")
                    .leftJoinAndSelect('cap.org', 'org')
                    .leftJoinAndSelect('cap.state', 'state')
                    .leftJoinAndSelect('cap.priority', 'priority')
                    .leftJoinAndSelect('cap.sessions', 'sessions')
                    .leftJoinAndSelect('cap.tags', 'tags')
                    .leftJoinAndSelect('tags.tag', 'tag')
                    .leftJoinAndSelect('sessions.assistances', 'assistences')
                    .leftJoinAndSelect('assistences.collaborator', 'collaborator')
                    .where("cap.id = :id", { id: responseCap["id"] })
                    .getOne();
        }

        return response;
    }

    async updateCap(entity){
        let keyCapEntity = Object.keys(entity);
        let capUpdate = {};

        keyCapEntity.forEach(key => {
            if((typeof entity[key]) != "object")
                capUpdate[key] = entity[key];
        });

        if(capUpdate["id"]){
            console.log("\nLa capacitación esta siendo actualizada...");
            const responseCap = await this.capacitationRP.update(capUpdate["id"], capUpdate);

            if(responseCap["affected"] > 0){
                console.log("Capacitación actualizada...");

                //Aqui se guardan sesiones y sus detalles
                for(let session of entity["sessions"]){
                    if(session["id"] != undefined){

                        const sessionUpdate = {
                            "id": session["id"],
                            "capId": capUpdate["id"],
                            "trainerId": session["trainerId"],
                            "centerId": session["centerId"],
                            "dates": session["dates"].join(" - "),
                            "schedule": session["timeRange"].join(" - "),
                            "active": session["active"]
                        }

                        console.log("Actulizando Sesion con id: " + sessionUpdate["id"]);
                        const responseSession = await this.capSessionRP.update(sessionUpdate["id"], sessionUpdate);

                        if(responseSession["affected"] > 0){
                            console.log("Sesión Actualizada...");

                            for(let assistance of session["assistances"]){
                                if(assistance["certificate"] != null && assistance["certificate"] != ""){
                                    if(assistance["certificate"].includes("image/")){
                                        let filename = assistance["certificate"].split("/")[2];
                                        let oldpath = `${process.env.PATH_FILES_TEMP}${filename}`;
                                        let newpath = `${process.env.PATH_FILES_EVIDENCE}${filename}`;
                        
                                        renameSync(oldpath, newpath);
                        
                                        assistance["certificate"] = `capacitation/preview/${filename}`;
                                    }
                                }

                                if(assistance["id"] != undefined){
                                    console.log("Actulizando asistencia con id: " + assistance["id"]);
                                    await this.assistanceRP.update(assistance["id"], assistance);
                                    console.log("Asistencia actualizada...");
                                }else{
                                    console.log("Agregando nuevo participante...");
                                    if(assistance["sessionId"] == undefined)
                                        assistance["sessionId"] = session["id"];

                                    await this.assistanceRP.save(assistance);
                                    console.log("Se agrego el nuevo participante");
                                }
                            }
                        }

                    }else{
                        console.log("Agregando una nueva Sesion...");
                        const sessionUpdate = {
                            "capId": capUpdate["id"],
                            "trainerId": session["trainerId"],
                            "centerId": session["centerId"],
                            "dates": session["dates"].join(" - "),
                            "schedule": session["timeRange"].join(" - "),
                            "active": session["active"]
                        }

                        const responseSession = await this.capSessionRP.save(sessionUpdate);
                        console.log("Se agrago la Sesion");

                        if(responseSession["id"] != undefined && session["collaborators"] != undefined){
                            let assistanceSave = session["collaborators"].map(assistance => {
                                if(assistance["certificate"] != null && assistance["certificate"] != ""){
                                    if(assistance["certificate"].includes("image/")){
                                        let filename = assistance["certificate"].split("/")[2];
                                        let oldpath = `${process.env.PATH_FILES_TEMP}${filename}`;
                                        let newpath = `${process.env.PATH_FILES_EVIDENCE}${filename}`;
                        
                                        renameSync(oldpath, newpath);
                        
                                        assistance["certificate"] = `capacitation/preview/${filename}`;
                                    }
                                }

                                return {
                                    sessionId: responseSession["id"],
                                    collaboratorId: assistance["collaboratorId"],
                                    qualification: assistance["qualification"],
                                    certificate: assistance["certificate"],
                                    description: assistance["description"],
                                    active: assistance["active"]
                                };
                            });
                            
                            if(assistanceSave.length > 0){
                                console.log(`Guardando participantes de la sesión...`);
                                await this.assistanceRP.save(assistanceSave)
                                console.log("Participantes guardados con éxito...");
                            }
                        }
                    }
                }

                //Aqui ira el guardar etiquetas
                const tagsCap = await this.capTagRP
                                .createQueryBuilder("capTag")
                                .where("capTag.capId = :idCap", {idCap: capUpdate["id"]})
                                .getMany();

                let tags = entity["tags"].filter(tag => tag["tagId"] != undefined).map(tag => tag["tagId"]);

                let inactive_tags = tagsCap.filter(tagCap => !tags.includes(tagCap["tagId"]) && tagCap["active"] == true);
                let active_tags = tagsCap.filter(tagCap => tags.includes(tagCap["tagId"]) && tagCap["active"] == false);
                let save_tags = tags.filter(tag => !tagsCap.map(tagCap => tagCap["tagId"]).includes(tag) ).map(tag => { return {"capId": capUpdate["id"], "tagId": tag, "active": true}});
                let new_tags = entity["tags"].filter(tag => tag["isNew"] != undefined).map((tag) => {return {"name": tag["label"], "active": true} });
                let save_tags_new = [];

                if(new_tags.length > 0){
                    save_tags_new = await this.tagRP.save(new_tags);
                    console.log(save_tags_new);
                    save_tags_new = save_tags_new.map(tag => { return {"capId": capUpdate["id"], "tagId": tag["id"], "active": true}})
                }

                save_tags = await save_tags.concat(save_tags_new);

                if(inactive_tags.length > 0){
                    console.log("Eliminando Etiquetas.....");
                    for(let tag of inactive_tags){
                        tag["active"] = false;
                        await this.capTagRP.update(tag["id"], tag);
                    }
                }

                if(active_tags.length > 0){
                    console.log("Agregando Etiquetas.....");
                    for(let tag of active_tags){
                        tag["active"] = true;
                        await this.capTagRP.update(tag["id"], tag);
                    }
                }

                if(save_tags.length > 0){
                    console.log(save_tags);
                    console.log("Guardando Etiquetas.....");
                    await this.capTagRP.save(save_tags);
                }
            }
        }

        console.log("Recuperando la capacitación actualizada....\n")
        const response = await this.capacitationRP
                .createQueryBuilder("cap")
                .leftJoinAndSelect('cap.org', 'org')
                .leftJoinAndSelect('cap.state', 'state')
                .leftJoinAndSelect('cap.priority', 'priority')
                .leftJoinAndSelect('cap.sessions', 'sessions')
                .leftJoinAndSelect('cap.tags', 'tags')
                .leftJoinAndSelect('tags.tag', 'tag')
                .leftJoinAndSelect('sessions.assistances', 'assistences')
                .leftJoinAndSelect('assistences.collaborator', 'collaborator')
                .where("cap.id = :id", { id: entity["id"] })
                .getOne();

        return response;
    }

    async findCaps(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let search = query.search == undefined ? "" : query.search;
        let sortBy = query.sortBy == undefined ?  ["cap.id", "ASC"] : query.sortBy;
        let state = query.state == undefined ? 0 : query.state;
        let priority = query.priority == undefined ? 0 : query.priority;
        let organization = query.org == undefined ? 0 : query.org;
        let statusCap = query.status == undefined ? 1 : query.status;

        if(sortBy == "character_asc"){
            sortBy = ["cap.name", "ASC"];
        }else if(sortBy == "character_desc"){
            sortBy = ["cap.name", "DESC"];
        }else if(sortBy == "date_asc"){
            sortBy = ["cap.id", "ASC"];
        }else if(sortBy == "date_desc")
            sortBy = ["cap.id", "DESC"];

        let QB = this.capacitationRP
            .createQueryBuilder("cap")
            .leftJoinAndSelect('cap.org', 'org')
            .leftJoinAndSelect('cap.state', 'state')
            .leftJoinAndSelect('cap.priority', 'priority')
            .leftJoinAndSelect('cap.sessions', 'sessions')
            .leftJoinAndSelect('cap.tags', 'tags')
            .leftJoinAndSelect('tags.tag', 'tag')
            .leftJoinAndSelect('sessions.assistances', 'assistences')
            .leftJoinAndSelect('assistences.collaborator', 'collaborator')
            .where("cap.active = :status", {status: statusCap})
            .andWhere("cap.name LIKE :search", { search: `%${search}%` })
            .andWhere(new Brackets((subcondition) => {
                if(state != 0 && priority != 0 && organization != 0){
                    subcondition.where("state.id = :depId and priority.id = :priority and org.id = :org", {state: state, priority: priority, org: organization})
                }else if(state != 0){
                    subcondition.andWhere("state.id = :id", {id: state})    
                }else if(priority != 0){
                    subcondition.andWhere("priority.id = :id", {id: priority})
                }else if(organization != 0)
                    subcondition.andWhere("org.id = :id", {id: organization})
            }));

        let response = await QB
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

        response = response.map( capacitation => {
            capacitation["sessions"] = capacitation["sessions"].map( session =>  {
                let dateNow = new Date();

                let startTime = session["schedule"].split(" - ").map(item => item.trim())[0];
                let startTimeConvMinutes = startTime != undefined ? (parseInt(startTime.split(":")[0]) * 60) + parseInt(startTime.split(":")[1]) : 0;

                let endTime = session["schedule"].split(" - ").map(item => item.trim())[1];
                let endTimeConvMinutes = endTime != undefined ? (parseInt(endTime.split(":")[0]) * 60) + parseInt(endTime.split(":")[1]) : 0;

                let nowHour = dateNow.toLocaleTimeString().split(":").map((item,index) => [0,1].includes(index) ? item : "").filter(item => item != "").join(":");
                let nowTimeConvMinutes = nowHour != undefined ? (parseInt(nowHour.split(":")[0]) * 60) + parseInt(nowHour.split(":")[1]) : 0;

                //Aqui saco todo lo referente a las fechas de la sesion
                let startDate = session["dates"].split(" - ").map(item => item.trim())[0];
                let startDateConvert = startDate != undefined ? new Date(startDate.trim().replace("/", "-")) : undefined;
                
                let endDate = session["dates"].split(" - ").map(item => item.trim())[1];
                let endDateConvert = endDate != undefined ? new Date(endDate.trim().replace("/", "-")) : undefined;

                if(dateNow.getTime() >= startDateConvert.getTime()){
                    if(dateNow.getTime() <= endDateConvert.getTime()){
                        if(dateNow.getMonth() == endDateConvert.getMonth() && dateNow.getDate() == endDateConvert.getDate() && nowTimeConvMinutes > endTimeConvMinutes)
                            session["statusSession"] = "Finalizada";
                        else{
                            if(dateNow.getMonth() == startDateConvert.getMonth() && dateNow.getDate() == startDateConvert.getDate() && nowTimeConvMinutes >= startTimeConvMinutes)
                                session["statusSession"] = "En Curso";
                            else
                                session["statusSession"] = "Sin iniciar";
                        }
                    }else
                        session["statusSession"] = "Finalizada";
                }else
                    session["statusSession"] = "Sin iniciar";

                return session;
            });

            return capacitation;
        });

        const returnResponse = {
            data: response,
            itemsperPage: itemsperPage,
            totalItems: totalItems,
            pageCount: pageCount,
            currentPage: page
        }

        return returnResponse;
    }

    async getOne(id){
        const response = await this.capacitationRP
                    .createQueryBuilder("cap")
                    .leftJoinAndSelect('cap.org', 'org')
                    .leftJoinAndSelect('cap.state', 'state')
                    .leftJoinAndSelect('cap.priority', 'priority')
                    .leftJoinAndSelect('cap.sessions', 'sessions')
                    .leftJoinAndSelect('cap.tags', 'tags')
                    .leftJoinAndSelect('tags.tag', 'tag')
                    .leftJoinAndSelect('sessions.assistances', 'assistences')
                    .leftJoinAndSelect('assistences.collaborator', 'collaborator')
                    .where("cap.id = :id and tags.active = 1", { id: id })
                    .getOne();
        
        return response;
    }

    async delete(id:number){
        const entity = await this.capacitationRP
                            .createQueryBuilder("repo")
                            .where("repo.id = :id", {id: id})
                            .getOne();
        if(entity){
            entity["active"] = false;
            await this.capacitationRP.update(entity["id"], entity);
            return {
                "statusCode": 200,
                "message": "Estado del colaborador actualizado",
                "error": "-"
            }
        }
        throw new NotFoundException(`El registro a eliminar no existe`);
    }

    getRepository(): Repository<CapacitationEntity> {
        return this.capacitationRP;   
    }

    async returnImage(image: string, response: Response){
        const stream = createReadStream(`${process.env.PATH_FILES_EVIDENCE}${image}`);
        
        response.set({
            'Content-Disposition': `inline; filename="${image}"`,
            'Content-Type': "image/jpeg"
        });

        return new StreamableFile(stream);
    }
}