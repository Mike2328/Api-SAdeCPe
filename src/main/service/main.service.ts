import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CapacitationEntity } from 'src/capacitation/entity/capacitation-entity';
import { CenterEntity } from 'src/center/entity/center-entity';
import { CollaboratorEntity } from 'src/collaborator/entity/collaborator-entity';
import { OrgEntity } from 'src/organization/entity/org-entity';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class MainService {
    constructor(@InjectRepository(CapacitationEntity) private capacitationRP: Repository<CapacitationEntity>,
                @InjectRepository(OrgEntity) private orgRP: Repository<OrgEntity>,
                @InjectRepository(CenterEntity) private centerRP: Repository<CenterEntity>,
                @InjectRepository(CollaboratorEntity) private collaboratorRP: Repository<CollaboratorEntity>){}

    // async findCaps(query){
    //     let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
    //     let page = query.page == undefined ?  1 : parseInt(query.page);
    //     let search = query.search == undefined ? "" : query.search;
    //     let sortBy = query.sortBy == undefined ?  ["cap.id", "ASC"] : query.sortBy;
    //     let state = query.state == undefined ? 0 : query.state;
    //     let priority = query.priority == undefined ? 0 : query.priority;
    //     let organization = query.org == undefined ? 0 : query.org;
    //     let statusCap = query.status == undefined ? 1 : query.status;

    //     if(sortBy == "character_asc"){
    //         sortBy = ["cap.name", "ASC"];
    //     }else if(sortBy == "character_desc"){
    //         sortBy = ["cap.name", "DESC"];
    //     }else if(sortBy == "date_asc"){
    //         sortBy = ["cap.id", "ASC"];
    //     }else if(sortBy == "date_desc")
    //         sortBy = ["cap.id", "DESC"];

    //     let QB = this.capacitationRP
    //         .createQueryBuilder("cap")
    //         .leftJoinAndSelect('cap.org', 'org')
    //         .leftJoinAndSelect('cap.state', 'state')
    //         .leftJoinAndSelect('cap.priority', 'priority')
    //         .leftJoinAndSelect('cap.sessions', 'sessions')
    //         .leftJoinAndSelect('sessions.center', "center")
    //         .leftJoinAndSelect('cap.tags', 'tags')
    //         .leftJoinAndSelect('tags.tag', 'tag')
    //         .leftJoinAndSelect('sessions.assistances', 'assistences')
    //         .leftJoinAndSelect('assistences.collaborator', 'collaborator')
    //         .where("cap.active = :status", {status: statusCap})
    //         .andWhere("cap.name LIKE :search", { search: `%${search}%` })
    //         .andWhere(new Brackets((subcondition) => {
    //             if(state != 0 && priority != 0 && organization != 0){
    //                 subcondition.where("state.id = :depId and priority.id = :priority and org.id = :org", {state: state, priority: priority, org: organization})
    //             }else if(state != 0){
    //                 subcondition.andWhere("state.id = :id", {id: state})    
    //             }else if(priority != 0){
    //                 subcondition.andWhere("priority.id = :id", {id: priority})
    //             }else if(organization != 0)
    //                 subcondition.andWhere("org.id = :id", {id: organization})
    //         }));

    //     let response = await QB
    //                     .orderBy(sortBy[0], sortBy[1])
    //                     .skip(itemsperPage * (page - 1))
    //                     .take(itemsperPage)
    //                     .getMany();
        

    //     const responseCount = await QB
    //                         .getCount().then((items) => {
    //                             return [items, Math.ceil(items / itemsperPage)];
    //                         });

    //     let newresponse = [];

    //     for(let cap of response){
    //         let nextSession = null;
    //         for(let session of cap["sessions"]){

    //             if(nextSession == null){
    //                 let dateNow = new Date();

    //                 let endTime = session["schedule"].split(" - ").map(item => item.trim())[1];
    //                 let endTimeConvMinutes = endTime != undefined ? (parseInt(endTime.split(":")[0]) * 60) + parseInt(endTime.split(":")[1]) : 0;

    //                 let nowHour = dateNow.toLocaleTimeString().split(":").map((item,index) => [0,1].includes(index) ? item : "").filter(item => item != "").join(":");
    //                 let nowTimeConvMinutes = nowHour != undefined ? (parseInt(nowHour.split(":")[0]) * 60) + parseInt(nowHour.split(":")[1]) : 0;

    //                 let startDate = session["dates"].split(" - ").map(item => item.trim())[0];
    //                 let startDateConvert = startDate != undefined ? new Date(startDate.trim().replace("/", "-")) : undefined;
                    
    //                 let endDate = session["dates"].split(" - ").map(item => item.trim())[1];
    //                 let endDateConvert = endDate != undefined ? new Date(endDate.trim().replace("/", "-")) : undefined;

    //                 if(dateNow.getTime() > startDateConvert.getTime()){
    //                     if(dateNow.getTime() <= endDateConvert.getTime()){
    //                         if(dateNow.getMonth() == endDateConvert.getMonth() && dateNow.getDate() == endDateConvert.getDate() && nowTimeConvMinutes < endTimeConvMinutes)
    //                             nextSession = session
    //                     }
    //                 }else
    //                     nextSession = session;
        
    //             }else{
    //                 let dateNow = new Date();

    //                 let nowHour = dateNow.toLocaleTimeString().split(":").map((item,index) => [0,1].includes(index) ? item : "").filter(item => item != "").join(":");
    //                 let nowTimeConvMinutes = nowHour != undefined ? (parseInt(nowHour.split(":")[0]) * 60) + parseInt(nowHour.split(":")[1]) : 0;

    //                 let startDate = session["dates"].split(" - ").map(item => item.trim())[0];
    //                 let startDateConvert = startDate != undefined ? new Date(startDate.trim().replace("/", "-")) : undefined;

    //                 let endTime = session["schedule"].split(" - ").map(item => item.trim())[1];
    //                 let endTimeConvMinutes = endTime != undefined ? (parseInt(endTime.split(":")[0]) * 60) + parseInt(endTime.split(":")[1]) : 0;

    //                 let endDate = session["dates"].split(" - ").map(item => item.trim())[1];
    //                 let endDateConvert = endDate != undefined ? new Date(endDate.trim().replace("/", "-")) : undefined;

    //                 let nextStartDate = nextSession["dates"].split(" - ").map(item => item.trim())[0];
    //                 let nextstartDateConvert = nextStartDate != undefined ? new Date(nextStartDate.trim().replace("/", "-")) : undefined;


    //                 if(endDateConvert.getTime() < nextstartDateConvert.getTime()){
    //                     if(dateNow.getTime() > startDateConvert.getTime()){
    //                         if(dateNow.getTime() <= endDateConvert.getTime()){
    //                             if(dateNow.getMonth() == endDateConvert.getMonth() && dateNow.getDate() == endDateConvert.getDate() && nowTimeConvMinutes < endTimeConvMinutes)
    //                                 nextSession = session
    //                         }
    //                     }else
    //                         nextSession = session;
    //                 }
    //             }
    //         }

    //         delete cap.sessions;
    //         console.log(cap["name"]);
    //         console.log(nextSession);
    //         console.log("-----------------------------------------------------")
    //         cap["nextSession"] = nextSession;
    //         newresponse.push(cap);
    //     }

    //     let totalItems = responseCount[0];
    //     let pageCount = responseCount[1];

    //     const returnResponse = {
    //         data: newresponse,
    //         itemsperPage: itemsperPage,
    //         totalItems: totalItems,
    //         pageCount: pageCount,
    //         currentPage: page
    //     }

    //     return returnResponse;
    // }

    async findCaps(query){
        let datenow = `${new Date().getFullYear()}/${(new Date().getMonth() + 1)}/${new Date().getDate()}`;
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let search = query.search == undefined ? "" : query.search;
        let state = query.state == undefined ? 0 : query.state;
        let priority = query.priority == undefined ? 0 : query.priority;
        let organization = query.org == undefined ? 0 : query.org;
        let statusCap = query.status == undefined ? 1 : query.status;

        let QB = this.capacitationRP
            .createQueryBuilder("cap")
            .leftJoinAndSelect('cap.org', 'org')
            .leftJoinAndSelect('cap.state', 'state')
            .leftJoinAndSelect('cap.priority', 'priority')
            .leftJoinAndSelect('cap.sessions', 'sessions')
            .leftJoinAndSelect('sessions.center', "center")
            .leftJoinAndSelect('cap.tags', 'tags')
            .leftJoinAndSelect('tags.tag', 'tag')
            .leftJoinAndSelect('sessions.assistances', 'assistences')
            .leftJoinAndSelect('assistences.collaborator', 'collaborator')
            .where("cap.active = :status", {status: statusCap})
            .andWhere("cap.name LIKE :search", { search: `%${search}%` })
            .andWhere("sessions.active = 1")
            .andWhere("convert(substring_index(sessions.dates, ' - ', 1), DATE) >= convert(:now, DATE)", {now: datenow})
            .andWhere(new Brackets((subcondition) => {
                if(state != 0 && priority != 0 && organization != 0){
                    subcondition.where("state.id = :depId and priority.id = :priority and org.id = :org", {state: state, priority: priority, org: organization})
                }else if(state != 0){
                    subcondition.andWhere("state.id = :id", {id: state})    
                }else if(priority != 0){
                    subcondition.andWhere("priority.id = :id", {id: priority})
                }else if(organization != 0)
                    subcondition.andWhere("org.id = :id", {id: organization})
            }))
            .orderBy("sessions.dates", "ASC");
            

        let response = await QB
            .skip(itemsperPage * (page - 1))
            .take(itemsperPage)
            .getMany();

        response = response.map(capacitation => {
            let cap = capacitation
            cap["nextSession"] = capacitation["sessions"][0];
            delete cap.sessions;
            return cap;
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
                .andWhere("CONCAT(CONCAT(collaborator.name, ' ', collaborator.lastName), ' ', collaborator.refNumber) LIKE :search", { search: `%${search}%`})
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

    async getinfoCol(id:number){
        const capacitations = await this.capacitationRP
                            .createQueryBuilder("cap")
                            .leftJoinAndSelect("cap.sessions", "capSession")
                            .leftJoinAndSelect("cap.tags", "capTags")
                            .leftJoinAndSelect("capSession.assistances", "assistances")
                            .leftJoinAndSelect("capTags.tag", "tag")
                            .where("cap.active = 1")
                            .andWhere("capSession.active = 1")
                            .andWhere("capTags.active = 1")
                            .andWhere("assistances.active = 1 and assistances.collaboratorId = :idCol", {idCol: id})
                            .getMany();

        let labels = [];
        let countsPoints = [];

        for(let cap of capacitations){
            const pointsCap = cap["sessions"].filter(session => session["assistances"].some(assistance => assistance["qualification"] != null || assistance["certificate"] != null)).length;

            for(let tag of cap["tags"]){
                let tagExist = labels.includes(tag["tag"]["name"]);

                if(tagExist){
                    let indexTag = labels.findIndex(label => label == tag["tag"]["name"]);
                    countsPoints[indexTag] = countsPoints[indexTag] + pointsCap; 
                }else{
                    labels.push(tag["tag"]["name"]);
                    countsPoints.push(pointsCap);
                }
            }
        }
         
        return {"labels": labels, "points": countsPoints};
    }

    async getInfoCapCol(id:number){
        const capacitations = await this.capacitationRP
                            .createQueryBuilder("cap")
                            .leftJoinAndSelect("cap.sessions", "capSession")
                            .leftJoinAndSelect("capSession.assistances", "assistances")
                            .where("cap.active = 1")
                            .andWhere("capSession.active = 1")
                            .andWhere("assistances.active = 1 and assistances.collaboratorId = :idCol", {idCol: id})
                            .getMany();

        let capsCol = [];

        for(let capacitation of capacitations){
            let objcapCol = {};
            let SessionsCol = [];
            let totalHourSuccess = 0.0;
            let totalHourFailed = 0.0;
            let totalHourProjected = 0.0;

            objcapCol["idCap"] = capacitation["id"];
            objcapCol["nameCap"] = capacitation["name"];

            for(let session of capacitation["sessions"]){
                let objSesCol = {};
                let dateNow = new Date();

                objSesCol["statusColSession"] = "Incompleta"

                let startTime = session["schedule"].split(" - ").map(item => item.trim())[0];
                let startTimeConvMinutes = startTime != undefined ? (parseInt(startTime.split(":")[0]) * 60) + parseInt(startTime.split(":")[1]) : 0;

                let endTime = session["schedule"].split(" - ").map(item => item.trim())[1];
                let endTimeConvMinutes = endTime != undefined ? (parseInt(endTime.split(":")[0]) * 60) + parseInt(endTime.split(":")[1]) : 0;

                let nowHour = dateNow.toLocaleTimeString().split(":").map((item,index) => [0,1].includes(index) ? item : "").filter(item => item != "").join(":");
                let nowTimeConvMinutes = nowHour != undefined ? (parseInt(nowHour.split(":")[0]) * 60) + parseInt(nowHour.split(":")[1]) : 0;
                dateNow = new Date(`${dateNow.getFullYear()}-${(dateNow.getMonth() + 1)}-${dateNow.getDate()}`);

                objSesCol["schedule"] = startTime == endTime ? startTime : session["schedule"];

                //Aqui saco todo lo referente a las fechas de la sesion
                let startDate = session["dates"].split(" - ").map(item => item.trim())[0];
                let startDateConvert = startDate != undefined ? new Date(startDate.trim().replace("/", "-")) : undefined;
                
                let endDate = session["dates"].split(" - ").map(item => item.trim())[1];
                let endDateConvert = endDate != undefined ? new Date(endDate.trim().replace("/", "-")) : undefined;

                objSesCol["dates"] = startDateConvert.toDateString() == endDateConvert.toDateString() ? startDate : session["dates"];

                if(dateNow.getTime() >= startDateConvert.getTime()){
                    if(dateNow.getTime() <= endDateConvert.getTime()){

                        if(dateNow.getMonth() == endDateConvert.getMonth() && dateNow.getDate() == endDateConvert.getDate() && nowTimeConvMinutes > endTimeConvMinutes){
                            objSesCol["stateSession"] = "Finalizada";
                            if(session["assistances"].some(assistance => assistance["qualification"] != null || assistance["certificate"] != null))
                                objSesCol["statusColSession"] = "Completada"
                        }else{
                            if((dateNow.getMonth() >= startDateConvert.getMonth() && dateNow.getDate() >= startDateConvert.getDate()) || 
                               (dateNow.getMonth() > startDateConvert.getMonth() && dateNow.getDate() < startDateConvert.getDate()) && 
                               nowTimeConvMinutes >= startTimeConvMinutes){
                                objSesCol["stateSession"] = "En Curso";
                                objSesCol["statusColSession"] = "Pendiente";
                            }else{
                                objSesCol["stateSession"] = "Sin iniciar";
                                objSesCol["statusColSession"] = "Pendiente";
                            }
                        }
                    }else{
                        objSesCol["stateSession"] = "Finalizada";
                        if(session["assistances"].some(assistance => assistance["qualification"] != null || assistance["certificate"] != null))
                            objSesCol["statusColSession"] = "Completada"
                    }
                }else{
                    objSesCol["stateSession"] = "Sin iniciar";
                    objSesCol["statusColSession"] = "Pendiente";
                }

                let daysSession = endDateConvert.getTime() - startDateConvert.getTime();
                daysSession = (daysSession / 1000 / 60 / 60 / 24) + 1;

                let duration = (endTimeConvMinutes - startTimeConvMinutes) * daysSession;

                let durationHour = Math.floor(duration / 60);
                let durationMinutes = duration % 60;

                objSesCol["duration"] = parseFloat(`${durationHour}.${(durationMinutes > 9 ? "" : "0")}${durationMinutes}`);
                objSesCol["durationDescrip"] = `${durationHour}h ${durationMinutes}m`;

                if(objSesCol["stateSession"] == "Finalizada" && objSesCol["statusColSession"] == "Completada"){
                    let totalHour = (parseInt(totalHourSuccess.toString().split(".")[0]) * 60);
                    let totalMinutes = totalHourSuccess.toString().split(".")[1] ? parseInt(totalHourFailed.toString().split(".")[1]) : 0;

                    totalHour = (totalHour + totalMinutes) + duration;
                    let totalConvHour = Math.floor(totalHour / 60);
                    let totalConvMinutes = totalHour % 60;
                    totalHourSuccess = parseFloat(`${totalConvHour}.${(totalConvMinutes > 9 ? "" : "0")}${totalConvMinutes}`);

                    objcapCol["totalHourSuccess"] = totalHourSuccess;
                    objcapCol["totalHourSuccessDescrip"] = totalHourSuccess != 0 ? `${totalConvHour}h ${totalConvMinutes > 9 ? "" : "0"}${totalConvMinutes}m` : "0h 0m";
                }

                if(objSesCol["stateSession"] == "Finalizada" && objSesCol["statusColSession"] == "Incompleta"){
                    let totalHour = (parseInt(totalHourFailed.toString().split(".")[0]) * 60);
                    let totalMinutes = totalHourFailed.toString().split(".")[1] ? parseInt(totalHourFailed.toString().split(".")[1]) : 0;

                    totalHour = (totalHour + totalMinutes) + duration;
                    let totalConvHour = Math.floor(totalHour / 60);
                    let totalConvMinutes = totalHour % 60;
                    totalHourFailed = parseFloat(`${totalConvHour}.${(totalConvMinutes > 9 ? "" : "0")}${totalConvMinutes}`);

                    objcapCol["totalHourFailed"] = totalHourFailed;
                    objcapCol["totalHourFailedDescrip"] = totalHourFailed != 0 ? `${totalConvHour}h ${totalConvMinutes > 9 ? "" : "0"}${totalConvMinutes}m` : "0h 0m";
               }

               if( ["Sin iniciar","En Curso"].includes(objSesCol["stateSession"]) && objSesCol["statusColSession"] == "Pendiente"){      
                    let totalHour = (parseInt(totalHourProjected.toString().split(".")[0]) * 60);
                    let totalMinutes = totalHourProjected.toString().split(".")[1] != undefined ? parseInt(totalHourProjected.toString().split(".")[1]) : 0;

                    totalHour = (totalHour + totalMinutes) + duration;
                    let totalConvHour = Math.floor(totalHour / 60);
                    let totalConvMinutes = totalHour % 60;
                    totalHourProjected = parseFloat(`${totalConvHour}.${(totalConvMinutes > 9 ? "" : "0")}${totalConvMinutes}`);

                    objcapCol["totalHourProjected"] = totalHourProjected;
                    objcapCol["totalHourProjectedDescrip"] = totalHourProjected != 0 ? `${totalConvHour}h ${totalConvMinutes > 9 ? "" : "0"}${totalConvMinutes}m` : "0h 0m";
               }
                
                SessionsCol.push(objSesCol);
            }

            objcapCol["totalHourSuccess"] = objcapCol["totalHourSuccess"] != undefined ? objcapCol["totalHourSuccess"] : 0;
            objcapCol["totalHourSuccessDescrip"] = objcapCol["totalHourSuccessDescrip"] != undefined ? objcapCol["totalHourSuccessDescrip"] : "0h 0m";
            objcapCol["totalHourFailed"] = objcapCol["totalHourFailed"] != undefined ? objcapCol["totalHourFailed"] : 0;;
            objcapCol["totalHourFailedDescrip"] = objcapCol["totalHourFailedDescrip"] != undefined ? objcapCol["totalHourFailedDescrip"] : "0h 0m";
            objcapCol["totalHourProjected"] = objcapCol["totalHourProjected"] != undefined ? objcapCol["totalHourProjected"] : 0;;
            objcapCol["totalHourProjectedDescrip"] = objcapCol["totalHourProjectedDescrip"] != undefined ? objcapCol["totalHourProjectedDescrip"] : "0h 0m";

            objcapCol["sessions"] = SessionsCol;
            capsCol.push(objcapCol);
        }

        let capsObj = {};
        let hourCapsSuccess = 0.0;
        let hourCapsFailed = 0.0;
        let hourCapsProjected = 0.0;

        for(let capCol of capsCol){
            let totalHour = (parseInt(capCol["totalHourSuccess"].toString().split(".")[0]) * 60);
            let totalMinutes = capCol["totalHourSuccess"].toString().split(".")[1] != undefined ? parseInt(`${capCol["totalHourSuccess"].toString().split(".")[1]}${capCol["totalHourSuccess"].toString().split(".")[1].length == 1 ? "0" : ""}`) : 0;
            hourCapsSuccess = hourCapsSuccess + (totalHour + totalMinutes);

            totalHour = (parseInt(capCol["totalHourFailed"].toString().split(".")[0]) * 60);
            totalMinutes = capCol["totalHourFailed"].toString().split(".")[1] != undefined ? parseInt(`${capCol["totalHourFailed"].toString().split(".")[1]}${capCol["totalHourFailed"].toString().split(".")[1].length == 1 ? "0" : ""}`) : 0;
            console.log(capCol["totalHourFailed"])
            hourCapsFailed = hourCapsFailed + (totalHour + totalMinutes);

            totalHour = (parseInt(capCol["totalHourProjected"].toString().split(".")[0]) * 60);
            totalMinutes = capCol["totalHourProjected"].toString().split(".")[1] != undefined ? parseInt(`${capCol["totalHourProjected"].toString().split(".")[1]}${capCol["totalHourProjected"].toString().split(".")[1].length == 1 ? "0" : ""}`) : 0;
            hourCapsProjected = hourCapsProjected + (totalHour + totalMinutes);
        }

        capsObj["capacitations"] = capsCol;

        let totalConvHour = Math.floor(hourCapsSuccess / 60);
        let totalConvMinutes = hourCapsSuccess % 60;

        capsObj["hourCapsSuccess"] = parseFloat(`${totalConvHour}.${(totalConvMinutes > 9 ? "" : "0")}${totalConvMinutes}`);
        capsObj["hourCapsSuccessDescrip"] = hourCapsSuccess != 0 ? `${totalConvHour}h ${totalConvMinutes > 9 ? "" : "0"}${totalConvMinutes}m` : "0h 0m";

        totalConvHour = Math.floor(hourCapsFailed / 60);
        totalConvMinutes = hourCapsFailed % 60;

        capsObj["hourCapsFailed"] = parseFloat(`${totalConvHour}.${(totalConvMinutes > 9 ? "" : "0")}${totalConvMinutes}`);
        capsObj["hourCapsFailedDescrip"] = hourCapsFailed != 0 ? `${totalConvHour}h ${totalConvMinutes > 9 ? "" : "0"}${totalConvMinutes}m` : "0h 0m";

        totalConvHour = Math.floor(hourCapsProjected / 60);
        totalConvMinutes = hourCapsProjected % 60;

        capsObj["hourCapsProjected"] = parseFloat(`${totalConvHour}.${(totalConvMinutes > 9 ? "" : "0")}${totalConvMinutes}`);
        capsObj["hourCapsProjectedDescrip"] = hourCapsProjected != 0 ? `${totalConvHour}h ${totalConvMinutes > 9 ? "" : "0"}${totalConvMinutes}m` : "0h 0m";

        return capsObj;
    }
}
