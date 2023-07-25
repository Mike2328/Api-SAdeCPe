import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { response } from 'express';
import { session } from 'passport';
import { start } from 'repl';
import { AssistanceEntity } from 'src/assistance/entity/assistance-entity';
import { CapSessionEntity } from 'src/cap_session/entity/cap_session-entity';
import { CapacitationEntity } from 'src/capacitation/entity/capacitation-entity';
import { CargoEntity } from 'src/cargo/entity/cargo-entity';
import { DepartamentEntity } from 'src/departament/entity/departament-entity';
import { OrgEntity } from 'src/organization/entity/org-entity';
import { Repository } from 'typeorm';

@Injectable()
export class StadisticsService {

    constructor(@InjectRepository(CapacitationEntity) private capacitationRP: Repository<CapacitationEntity>,
                @InjectRepository(DepartamentEntity) private departamentRP: Repository<DepartamentEntity>,
                @InjectRepository(CargoEntity) private cargoRP: Repository<CargoEntity>,
                @InjectRepository(OrgEntity) private orgRP: Repository<OrgEntity>){}

    async getCompYear(){
        // const months = ;
        const dateNow = new Date();
        const capacitations = await this.capacitationRP
                                .createQueryBuilder("cap")
                                .leftJoinAndSelect("cap.sessions", "capSession")
                                .where("cap.active = 1")
                                .andWhere("capSession.active = 1 and capSession.dates like :year", {year: `%${dateNow.getFullYear()}%`})
                                .orWhere("capSession.dates like :lastYear", {lastYear: `%${(dateNow.getFullYear() - 1)}%`})
                                .getMany()

        let sessions = [];

        for(let cap of capacitations)
            sessions = cap["sessions"] != undefined ? sessions.concat(cap["sessions"]) : sessions;

        const sessionsLastYear = sessions.filter(session => {
            let sessionDates = session["dates"].split("-").map(date => date.trim().split("/").map(item => parseInt(item) > 9 ? parseInt(item) : `0${parseInt(item)}`).join("/"));
            if(new Date(sessionDates[0]).getFullYear() == (dateNow.getFullYear() - 1) || new Date(sessionDates[1]).getFullYear() == (dateNow.getFullYear() - 1))
                return true;
            else
                return false;
        });

        const sessionsCurrentYear = sessions.filter(session => {
            let sessionDates = session["dates"].split("-").map(date => date.trim().split("/").map(item => parseInt(item) > 9 ? parseInt(item) : `0${parseInt(item)}`).join("/"));
            if(new Date(sessionDates[0]).getFullYear() == dateNow.getFullYear() || new Date(sessionDates[1]).getFullYear() == dateNow.getFullYear())
                return true;
            else
                return false;
        });

        let labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
        let lastyear = [0,0,0,0,0,0,0,0,0,0,0,0];
        let currentyear = [0,0,0,0,0,0,0,0,0,0,0,0];

        for(let session of sessionsLastYear){
            let sessionDates = session["dates"].split("-").map(date => date.trim().split("/").map(item => parseInt(item) > 9 ? parseInt(item) : `0${parseInt(item)}`).join("/"));
            sessionDates = sessionDates.filter(sess => new Date(sess).getFullYear() == (dateNow.getFullYear() - 1));
            let monthSession = -1;

            for(let date of sessionDates){
                let monthDate = new Date(date).getMonth()
                if(monthSession != (monthDate + 1)){
                    monthSession = (monthDate + 1);
                    lastyear[monthDate] = lastyear[monthDate] + 1;
                }
            }
        }

        for(let session of sessionsCurrentYear){
            let sessionDates = session["dates"].split("-").map(date => date.trim().split("/").map(item => parseInt(item) > 9 ? parseInt(item) : `0${parseInt(item)}`).join("/"));
            sessionDates = sessionDates.filter(sess => new Date(sess).getFullYear() == dateNow.getFullYear());
            let monthSession = -1;

            for(let date of sessionDates){
                let monthDate = new Date(date).getMonth();
                if(monthSession != (monthDate + 1)){
                    monthSession = (monthDate + 1);
                    currentyear[monthDate] = currentyear[monthDate] + 1;
                }
            }
        }

        return {"labels": labels, "lastYear": lastyear, "currentYear": currentyear};
    }

    async getCapDep(){
        const dateNow = new Date();
        const departaments = await this.departamentRP
                            .createQueryBuilder("dep")
                            .where("dep.active = 1")
                            .getMany();

        let deps = [];
        let countSessions = [];


        for(let departament of departaments){
            const capacitations = await this.capacitationRP
                        .createQueryBuilder("cap")
                        .leftJoinAndSelect("cap.sessions", "capSession")
                        .leftJoin("capSession.assistances", "assistances")
                        .leftJoin("assistances.collaborator", "collaborator")
                        .leftJoin("collaborator.position", "cargo")
                        .where("cap.active = 1")
                        .andWhere("capSession.active = 1 and capSession.dates like :year", {year: `%${dateNow.getFullYear()}%`})
                        .andWhere("assistances.active = 1")
                        .andWhere("cargo.departamentId = :id", {id: `${departament["id"]}`})
                        .getMany();

            let countSessionsDep = [];

            for(let cap of capacitations)
                countSessionsDep = cap["sessions"] != undefined ? countSessionsDep.concat(cap["sessions"]) : countSessionsDep;
            
            deps.push(departament["name"]);
            countSessions.push(countSessionsDep.length);
        }

        return {"labels": deps, "data": countSessions};
    }

    async getCapCar(query){
        let counItem = query.items != undefined ? query.items : 10;
        const dateNow = new Date();
        const cargos = await this.cargoRP
                            .createQueryBuilder("cargo")
                            .where("cargo.active = 1")
                            .getMany();

        let deps = [];
        let countSessions = [];


        for(let cargo of cargos){
            const capacitations = await this.capacitationRP
                        .createQueryBuilder("cap")
                        .leftJoinAndSelect("cap.sessions", "capSession")
                        .leftJoinAndSelect("capSession.assistances", "assistances")
                        .leftJoin("assistances.collaborator", "collaborator")
                        .leftJoin("collaborator.position", "cargo")
                        .where("cap.active = 1")
                        .andWhere("capSession.active = 1 and capSession.dates like :year", {year: `%${dateNow.getFullYear()}%`})
                        .andWhere("assistances.active = 1")
                        .andWhere("cargo.id = :id", {id: `${cargo["id"]}`})
                        .getMany();

            let countSessionsCar = [];
            let contSession = 0;

            for(let cap of capacitations)
                countSessionsCar = cap["sessions"] != undefined ? countSessionsCar.concat(cap["sessions"]) : countSessionsCar;
        
            console.log("-------------------------------------------------")
            console.log(cargo["name"])
            console.log(countSessionsCar)
            for(let countSession of countSessionsCar)
                contSession = contSession + countSession["assistances"].length;

            deps.push(cargo["name"]);
            countSessions.push(contSession)
        }

        let countSessionsTemp = countSessions.map((item, index) => [item, index]);
        countSessionsTemp.sort(function(a, b){return b[0] - a[0]});

        let counts = countSessionsTemp.filter((num,index) => index < counItem);
        
        let labels = [];
        let points = [];

        for(let count of counts){
            labels.push(deps[count[1]]);
            points.push(count[0]);
        }
        
        return {"labels": labels, "countSessions": points};
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
                            .orderBy("capSession.dates", "ASC")
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

    async getCapOrg(query){
        let counItem = query.items != undefined ? query.items : 10;
        
        const dateNow = new Date();
        const orgs = await this.orgRP
                            .createQueryBuilder("org")
                            .where("org.active = 1")
                            .getMany();

        let deps = [];
        let countSessions = [];

        for(let org of orgs){
            const capacitations = await this.capacitationRP
                        .createQueryBuilder("cap")
                        .leftJoinAndSelect("cap.sessions", "capSession")
                        .leftJoinAndSelect("capSession.assistances", "assistances")
                        .leftJoin("assistances.collaborator", "collaborator")
                        .leftJoin("collaborator.position", "cargo")
                        .where("cap.active = 1 and cap.orgId = :id", {id: `${org["id"]}`})
                        .andWhere("capSession.active = 1 and capSession.dates like :year", {year: `%${dateNow.getFullYear()}%`})
                        .andWhere("assistances.active = 1")
                        .getMany();

            let contSession = 0;

            for(let cap of capacitations)
                contSession = contSession + cap["sessions"].length;

            deps.push(org["name"]);
            countSessions.push(contSession)
        }

        let countSessionsTemp = countSessions.map((item, index) => [item, index]);
        countSessionsTemp.sort(function(a, b){return b[0] - a[0]});

        let counts = countSessionsTemp.filter((num,index) => index < counItem);
        
        let labels = [];
        let points = [];

        for(let count of counts){
            labels.push(deps[count[1]]);
            points.push(count[0]);
        }
        
        return {"labels": labels, "countSessions": points};
    }

    async getCostInfo(){
        const dateNow = new Date();
        let months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
        const departaments = await this.departamentRP
                            .createQueryBuilder("dep")
                            .where("dep.active = 1")
                            .getMany();
        
        let capDeps = [];


        for(let departament of departaments){
            const response = await this.capacitationRP
                        .createQueryBuilder("cap")
                        .leftJoinAndSelect("cap.sessions", "capSession")
                        .leftJoinAndSelect("capSession.assistances", "assistances")
                        .leftJoinAndSelect("assistances.collaborator", "collaborator")
                        .leftJoinAndSelect("collaborator.position", "cargo")
                        .where("cap.active = 1")
                        .andWhere("capSession.active = 1 and capSession.dates like :year", {year: `%${dateNow.getFullYear()}%`})
                        .andWhere("assistances.active = 1")
                        .andWhere("cargo.departamentId = :id", {id: `${departament["id"]}`})
                        .getMany();

            let capacitations = [];

            for(let capacitation of response){
                let objCap = {};
                objCap["name"] = capacitation["name"];

                objCap["positions"] =  capacitation["sessions"].reduce((array, session) => {
                                            let array_temp = array.concat(session["assistances"].reduce((array, assitance) => {
                                                                if(array.indexOf(assitance["collaborator"]["position"]["name"]) === -1) 
                                                                    array.push(assitance["collaborator"]["position"]["name"]);
                                                                return array;
                                                            },[]));
                                            return array_temp;
                                        }, []).reduce((array, position) => { if(array.indexOf(position) === -1) array.push(position); return array; },[]);
                
                objCap["costUnit"] = capacitation["costUnit"];
                objCap["capAssis"] = capacitation["sessions"].reduce((total, session) => {
                    total =  total +  session["assistances"].length;
                    return total;
                },0);
                objCap["infoMonths"] = {};

                let sessions = [];

                for(let session of capacitation["sessions"]){
                    let objSession = {};
                    let sessionDates = session["dates"].split("-").map(date => date.trim().split("/").map(item => parseInt(item) > 9 ? parseInt(item) : `0${parseInt(item)}`).join("/"));
                    let sessionDate = sessionDates[0] != undefined ? new Date(sessionDates[0]) : undefined;
                    
                    if(sessionDate != undefined){
                        objSession["month"] = months[sessionDate.getMonth()];
                        
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

                        let losses = 0;
                        let projecting = 0;

                        for(let assistance of session["assistances"]){
                            if(["En Curso", "Sin iniciar"].includes(status)){
                                projecting = projecting + capacitation["costUnit"];
                            }else{
                                projecting = projecting + capacitation["costUnit"];
                                if(assistance["qualification"] == null && assistance["certificate"] == null){
                                    losses = losses + capacitation["costUnit"];
                                }
                            }
                        }

                        objSession["lostFunds"] = losses;
                        objSession["ownFunds"] = projecting;

                        

                        sessions.push(objSession);
                    }
                }

                for(let month of months){
                    objCap["infoMonths"][month] = {};
                    objCap["infoMonths"][month]["lostSessionAmount"] = 0;
                    objCap["infoMonths"][month]["sessionCost"] = 0;


                    for(let session of sessions){
                        if(month == session["month"]){
                            objCap["infoMonths"][month]["lostSessionAmount"] = objCap["infoMonths"][month]["lostSessionAmount"] + session["lostFunds"];
                            objCap["infoMonths"][month]["sessionCost"] = objCap["infoMonths"][month]["sessionCost"] + session["ownFunds"];
                        }
                    }
                }

                objCap["costFinal"] = Object.keys(objCap["infoMonths"]).reduce((total, month) =>  {
                    return total + objCap["infoMonths"][month]["sessionCost"];
                }, 0);

                capacitations.push(objCap);
            }
            
            capDeps.push({"name": departament["name"], "details": capacitations});
        }

        return capDeps;
    }

    async getEffectiveOrg(){
        const orgs = await this.orgRP.createQueryBuilder("org")
                                     .where("org.active = 1")
                                     .getMany();

        let labels = [];
        let effective = [];

        for(let org of orgs){
            let objOrg = [];
            let capEffective = [];

            const response = await this.capacitationRP
                                   .createQueryBuilder("cap")
                                   .leftJoinAndSelect("cap.sessions", "capSession")
                                   .leftJoinAndSelect("capSession.assistances", "assistances")
                                   .where("cap.active = 1")
                                   .andWhere("assistances.active = 1")
                                   .andWhere("cap.orgId = :orgId", {orgId: org["id"]})
                                   .getMany();

            for(let capacitation of response){
                let sessionsEffective = [];

                for(let session of capacitation["sessions"]){
                    let sessionDates = session["dates"].split("-").map(date => date.trim().split("/").map(item => parseInt(item) > 9 ? parseInt(item) : `0${parseInt(item)}`).join("/"));
                    let sessionDate = sessionDates[0] != undefined ? new Date(sessionDates[0]) : undefined;
                    
                    if(sessionDate != undefined){
                        let complete = 0;
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
                            if(!["En Curso", "Sin iniciar"].includes(status)){
                                if(assistance["qualification"] != null || assistance["certificate"] != null){
                                    complete++;
                                }
                            }
                        }

                        if(!["En Curso", "Sin iniciar"].includes(status))
                            sessionsEffective.push(parseInt(((complete / session["assistances"].length) * 100).toString()));
                    }
                }
                let cont = sessionsEffective.length;
                let total = sessionsEffective.reduce((total, effective) =>  { return total + effective }, 0)

                if(total != 0)
                    capEffective.push(total / cont)
            }

            let cont = capEffective.length;
            let total = capEffective.reduce((total, effective) =>  { return total + effective }, 0)

            labels.push(org["name"]);
            effective.push(total != 0 ? (total / cont) : total);
        }

        return {"labels": labels, "effective": effective};
    }
}